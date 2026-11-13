#!/usr/bin/env python3
"""
strip_params.py  —  Notification Manager build helper (PROTHOTECH)

Walks a directory of compiled .class files and removes the optional
`MethodParameters` attribute from every method (javac emits it for lambdas /
when -parameters is used). Some d8 versions warn or fail on malformed
MethodParameters entries produced when compiling against android.jar, and
the attribute is useless on Android anyway.

Also verifies the class-file major version is <= 52 (Java 8) so that d8
never sees unexpected bytecode.

Usage:  python3 strip_params.py build/classes
"""
import os
import struct
import sys

STRIP = {b"MethodParameters"}
MAX_MAJOR = 52  # Java 8


class Reader:
    def __init__(self, data):
        self.d = data
        self.p = 0

    def u1(self):
        v = self.d[self.p]
        self.p += 1
        return v

    def u2(self):
        v = struct.unpack_from(">H", self.d, self.p)[0]
        self.p += 2
        return v

    def u4(self):
        v = struct.unpack_from(">I", self.d, self.p)[0]
        self.p += 4
        return v

    def raw(self, n):
        v = self.d[self.p:self.p + n]
        self.p += n
        return v


def parse_constant_pool(r):
    count = r.u2()
    utf8 = {}
    i = 1
    while i < count:
        tag = r.u1()
        if tag == 1:                       # Utf8
            ln = r.u2()
            utf8[i] = bytes(r.raw(ln))
        elif tag in (3, 4):                # Integer, Float
            r.raw(4)
        elif tag in (5, 6):                # Long, Double (two slots)
            r.raw(8)
            i += 1
        elif tag in (7, 8, 16, 19, 20):    # Class, String, MethodType, Module, Package
            r.raw(2)
        elif tag in (9, 10, 11, 12, 17, 18):  # refs, NameAndType, Dynamic, InvokeDynamic
            r.raw(4)
        elif tag == 15:                    # MethodHandle
            r.raw(3)
        else:
            raise ValueError("unknown constant pool tag %d" % tag)
        i += 1
    return utf8


def copy_attributes(r, utf8, strip):
    """Read an attribute table, return (bytes, removed_count)."""
    n = r.u2()
    kept = []
    removed = 0
    for _ in range(n):
        name_idx = r.u2()
        length = r.u4()
        body = r.raw(length)
        if strip and utf8.get(name_idx) in STRIP:
            removed += 1
            continue
        kept.append(struct.pack(">HI", name_idx, length) + bytes(body))
    return struct.pack(">H", len(kept)) + b"".join(kept), removed


def process(path):
    with open(path, "rb") as f:
        data = f.read()
    r = Reader(data)
    if r.u4() != 0xCAFEBABE:
        raise ValueError("not a class file")
    r.u2()                     # minor
    major = r.u2()
    if major > MAX_MAJOR:
        raise ValueError("%s: class version %d > %d (compile with -source 8 -target 8)"
                         % (path, major, MAX_MAJOR))
    utf8 = parse_constant_pool(r)
    header_end = r.p
    r.raw(6)                   # access, this, super
    icount = r.u2()
    r.raw(2 * icount)
    out = [bytes(data[:r.p])]
    removed = 0

    for _member in ("fields", "methods"):
        count = r.u2()
        out.append(struct.pack(">H", count))
        for _ in range(count):
            out.append(bytes(r.raw(6)))   # access, name, descriptor
            attrs, rem = copy_attributes(r, utf8, _member == "methods")
            removed += rem
            out.append(attrs)

    attrs, _ = copy_attributes(r, utf8, False)
    out.append(attrs)
    if r.p != len(data):
        raise ValueError("trailing bytes in %s" % path)

    if removed:
        with open(path, "wb") as f:
            f.write(b"".join(out))
    _ = header_end
    return removed


def main():
    if len(sys.argv) != 2:
        print("usage: strip_params.py <classes-dir>")
        sys.exit(2)
    root = sys.argv[1]
    files = 0
    removed = 0
    for dp, _dn, fns in os.walk(root):
        for fn in fns:
            if fn.endswith(".class"):
                files += 1
                removed += process(os.path.join(dp, fn))
    print("strip_params: %d class files checked, %d MethodParameters attributes removed"
          % (files, removed))


if __name__ == "__main__":
    main()
