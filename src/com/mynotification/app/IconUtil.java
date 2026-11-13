package com.mynotification.app;

import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Base64;
import android.util.LruCache;

import java.io.ByteArrayOutputStream;

/**
 * Converts installed-app icons into PNG data-URLs that the WebView can display.
 * Developer: PROTHOTECH
 */
public final class IconUtil {

    static final int ICON_PX = 96;

    /** pkg -> data URL (about 10 KB each). */
    static final LruCache<String, String> CACHE = new LruCache<String, String>(160);

    private IconUtil() {
    }

    public static String iconDataUrl(Context ctx, String pkg) {
        if (pkg == null || pkg.length() == 0) return "";
        String hit = CACHE.get(pkg);
        if (hit != null) return hit;
        String url = "";
        try {
            PackageManager pm = ctx.getPackageManager();
            Drawable d = pm.getApplicationIcon(pkg);
            Bitmap bmp = toBitmap(d, ICON_PX);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            bmp.compress(Bitmap.CompressFormat.PNG, 100, bos);
            url = "data:image/png;base64," + Base64.encodeToString(bos.toByteArray(), Base64.NO_WRAP);
        } catch (Exception ignored) {
            // app uninstalled or icon unreadable -> JS shows a letter avatar
        }
        if (url.length() > 0) CACHE.put(pkg, url);
        return url;
    }

    static Bitmap toBitmap(Drawable d, int size) {
        if (d instanceof BitmapDrawable) {
            Bitmap src = ((BitmapDrawable) d).getBitmap();
            if (src != null) return Bitmap.createScaledBitmap(src, size, size, true);
        }
        Bitmap bmp = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
        Canvas c = new Canvas(bmp);
        Drawable copy = d.getConstantState() != null ? d.getConstantState().newDrawable().mutate() : d;
        copy.setBounds(0, 0, size, size);
        copy.draw(c);
        return bmp;
    }
}
