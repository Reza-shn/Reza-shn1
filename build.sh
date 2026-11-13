#!/usr/bin/env bash
# =====================================================================
#  Notification Manager — APK build script (no Android Studio, no Gradle)
#  Developer : PROTHOTECH
#  Package   : com.mynotification.app
#
#  Pipeline  : aapt2 compile -> aapt2 link -> javac (Java 8) ->
#              strip_params.py -> d8 -> zip -> zipalign -> apksigner
#
#  Requires  : JDK 17+ (javac/keytool), python3, zip,
#              Android SDK with build-tools (>=30) and a platform (android-34 preferred)
#
#  Optional env vars:
#    ANDROID_HOME / ANDROID_SDK_ROOT   SDK location
#    BUILD_TOOLS_VERSION               e.g. 34.0.0  (default: newest installed)
#    PLATFORM                          e.g. android-34 (default: android-34 or newest)
#    KEYSTORE_PATH  KEYSTORE_PASS  KEY_ALIAS  KEY_PASS   release signing key
#    KEYSTORE_BASE64                   base64 keystore (CI secrets) -> decoded to KEYSTORE_PATH
# =====================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

log()  { printf '\033[1;36m==>\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31mERROR:\033[0m %s\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------- version
prop() { grep -E "^$1=" version.properties | head -1 | cut -d'=' -f2- | tr -d '\r'; }
VERSION_CODE="$(prop versionCode)"
VERSION_NAME="$(prop versionName)"
MIN_SDK="$(prop minSdk)"
TARGET_SDK="$(prop targetSdk)"
PKG="$(prop packageName)"
[ -n "$VERSION_CODE" ] && [ -n "$VERSION_NAME" ] || fail "version.properties is incomplete"
MIN_SDK="${MIN_SDK:-21}"
TARGET_SDK="${TARGET_SDK:-34}"
PKG="${PKG:-com.mynotification.app}"

# ---------------------------------------------------------------- SDK
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
if [ -z "$SDK" ]; then
  for c in "$HOME/Android/Sdk" "$HOME/android-sdk" "/usr/local/lib/android/sdk" "/opt/android-sdk"; do
    [ -d "$c" ] && SDK="$c" && break
  done
fi
[ -n "$SDK" ] && [ -d "$SDK" ] || fail "Android SDK not found. Set ANDROID_HOME."

if [ -n "${BUILD_TOOLS_VERSION:-}" ]; then
  BT="$SDK/build-tools/$BUILD_TOOLS_VERSION"
else
  BT="$(ls -d "$SDK"/build-tools/*/ 2>/dev/null | sed 's:/*$::' | sort -V | tail -1)"
fi
[ -d "$BT" ] || fail "build-tools not found in $SDK/build-tools"

if [ -n "${PLATFORM:-}" ]; then
  PLAT_DIR="$SDK/platforms/$PLATFORM"
elif [ -f "$SDK/platforms/android-$TARGET_SDK/android.jar" ]; then
  PLAT_DIR="$SDK/platforms/android-$TARGET_SDK"
else
  PLAT_DIR="$(ls -d "$SDK"/platforms/android-*/ 2>/dev/null | sed 's:/*$::' | sort -V | tail -1)"
fi
ANDROID_JAR="$PLAT_DIR/android.jar"
[ -f "$ANDROID_JAR" ] || fail "android.jar not found ($ANDROID_JAR)"

AAPT2="$BT/aapt2"
D8="$BT/d8"
ZIPALIGN="$BT/zipalign"
APKSIGNER="$BT/apksigner"
for t in "$AAPT2" "$D8" "$ZIPALIGN" "$APKSIGNER"; do [ -x "$t" ] || fail "missing tool: $t"; done
command -v javac   >/dev/null || fail "javac not found (install a JDK)"
command -v keytool >/dev/null || fail "keytool not found (install a JDK)"
command -v python3 >/dev/null || fail "python3 not found"
command -v zip     >/dev/null || fail "zip not found"

log "SDK         : $SDK"
log "build-tools : $(basename "$BT")"
log "platform    : $(basename "$PLAT_DIR")"
log "version     : $VERSION_NAME ($VERSION_CODE)  min=$MIN_SDK target=$TARGET_SDK"

# ---------------------------------------------------------------- dirs
OUT="$ROOT/build"
rm -rf "$OUT"
mkdir -p "$OUT/res" "$OUT/gen" "$OUT/stubs" "$OUT/classes" "$OUT/dex" "$ROOT/dist"

# ---------------------------------------------------------------- 1. resources
log "aapt2 compile"
"$AAPT2" compile --dir "$ROOT/res" -o "$OUT/res/compiled.zip"

log "aapt2 link"
"$AAPT2" link \
  -o "$OUT/app.unaligned.apk" \
  -I "$ANDROID_JAR" \
  --manifest "$ROOT/AndroidManifest.xml" \
  -A "$ROOT/assets" \
  --java "$OUT/gen" \
  --min-sdk-version "$MIN_SDK" \
  --target-sdk-version "$TARGET_SDK" \
  --version-code "$VERSION_CODE" \
  --version-name "$VERSION_NAME" \
  --rename-manifest-package "$PKG" \
  --custom-package "$PKG" \
  --auto-add-overlay \
  "$OUT/res/compiled.zip"

# ---------------------------------------------------------------- 2. java
log "javac (LambdaMetafactory stub)"
javac -nowarn -source 8 -target 8 -encoding UTF-8 \
  -bootclasspath "$ANDROID_JAR" \
  -d "$OUT/stubs" \
  $(find "$ROOT/stubs" -name '*.java') 2>&1 | grep -v -E 'bootstrap class path|source value 8|target value 8|To suppress warnings|^[0-9]+ warnings?$' || true
[ -f "$OUT/stubs/java/lang/invoke/LambdaMetafactory.class" ] || fail "stub compile failed"

log "javac (app sources, Java 8)"
find "$ROOT/src" "$OUT/gen" -name '*.java' > "$OUT/sources.txt"
set +e
javac -source 8 -target 8 -encoding UTF-8 -Xlint:-options -Xlint:-deprecation \
  -bootclasspath "$ANDROID_JAR:$OUT/stubs" \
  -classpath "$ANDROID_JAR" \
  -d "$OUT/classes" \
  @"$OUT/sources.txt"
JRC=$?
set -e
[ $JRC -eq 0 ] || fail "javac failed"

log "strip_params.py"
python3 "$ROOT/strip_params.py" "$OUT/classes"

# ---------------------------------------------------------------- 3. dex
log "d8"
find "$OUT/classes" -name '*.class' > "$OUT/classes.txt"
"$D8" --release \
  --min-api "$MIN_SDK" \
  --lib "$ANDROID_JAR" \
  --output "$OUT/dex" \
  $(cat "$OUT/classes.txt")
[ -f "$OUT/dex/classes.dex" ] || fail "d8 produced no classes.dex"

log "add classes.dex to APK"
( cd "$OUT/dex" && zip -q -j "$OUT/app.unaligned.apk" classes*.dex )

# ---------------------------------------------------------------- 4. align
log "zipalign"
"$ZIPALIGN" -f -p 4 "$OUT/app.unaligned.apk" "$OUT/app.aligned.apk"

# ---------------------------------------------------------------- 5. sign
KEYSTORE_PATH="${KEYSTORE_PATH:-$ROOT/keystore/release.jks}"
KEYSTORE_PASS="${KEYSTORE_PASS:-prothotech123}"
KEY_ALIAS="${KEY_ALIAS:-prothotech}"
KEY_PASS="${KEY_PASS:-$KEYSTORE_PASS}"
mkdir -p "$(dirname "$KEYSTORE_PATH")"

if [ -n "${KEYSTORE_BASE64:-}" ] && [ ! -f "$KEYSTORE_PATH" ]; then
  log "decoding keystore from KEYSTORE_BASE64"
  echo "$KEYSTORE_BASE64" | base64 -d > "$KEYSTORE_PATH"
fi

if [ ! -f "$KEYSTORE_PATH" ]; then
  log "generating new signing key ($KEYSTORE_PATH) — KEEP IT for future updates!"
  keytool -genkeypair -v \
    -keystore "$KEYSTORE_PATH" -storetype PKCS12 \
    -storepass "$KEYSTORE_PASS" -keypass "$KEY_PASS" \
    -alias "$KEY_ALIAS" -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=PROTHOTECH, OU=Mobile, O=PROTHOTECH, L=Tehran, ST=Tehran, C=IR" >/dev/null
fi

APK_NAME="NotificationManager-v${VERSION_NAME}.apk"
log "apksigner"
"$APKSIGNER" sign \
  --ks "$KEYSTORE_PATH" \
  --ks-pass "pass:$KEYSTORE_PASS" \
  --ks-key-alias "$KEY_ALIAS" \
  --key-pass "pass:$KEY_PASS" \
  --v1-signing-enabled true \
  --v2-signing-enabled true \
  --min-sdk-version "$MIN_SDK" \
  --out "$ROOT/dist/$APK_NAME" \
  "$OUT/app.aligned.apk"

"$APKSIGNER" verify --min-sdk-version "$MIN_SDK" "$ROOT/dist/$APK_NAME"
rm -f "$ROOT/dist/$APK_NAME.idsig"

log "DONE  ->  dist/$APK_NAME  ($(du -h "$ROOT/dist/$APK_NAME" | cut -f1))"
