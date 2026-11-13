package java.lang.invoke;

/**
 * Compile-time stub ONLY.
 *
 * android.jar does not ship java.lang.invoke.LambdaMetafactory, but javac needs
 * the class (and its bootstrap signatures) to emit invokedynamic for lambdas.
 * build.sh compiles this into build/stubs and puts it on the *bootclasspath* for
 * javac. It is never dexed: d8 desugars every lambda into a normal class.
 */
public final class LambdaMetafactory {

    public static final int FLAG_SERIALIZABLE = 1 << 0;
    public static final int FLAG_MARKERS = 1 << 1;
    public static final int FLAG_BRIDGES = 1 << 2;

    private LambdaMetafactory() {
    }

    public static CallSite metafactory(MethodHandles.Lookup caller,
                                       String invokedName,
                                       MethodType invokedType,
                                       MethodType samMethodType,
                                       MethodHandle implMethod,
                                       MethodType instantiatedMethodType) {
        throw new UnsupportedOperationException("stub");
    }

    public static CallSite altMetafactory(MethodHandles.Lookup caller,
                                          String invokedName,
                                          MethodType invokedType,
                                          Object... args) {
        throw new UnsupportedOperationException("stub");
    }
}
