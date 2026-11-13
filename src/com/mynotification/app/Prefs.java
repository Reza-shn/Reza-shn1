package com.mynotification.app;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Small SharedPreferences wrapper for user settings.
 * Developer: PROTHOTECH
 */
public final class Prefs {

    static final String FILE = "nm_settings";

    public static final String KEY_IGNORE_ONGOING = "ignoreOngoing";
    public static final String KEY_NEW_APPS_ENABLED = "newAppsEnabled";
    public static final String KEY_RETENTION_DAYS = "retentionDays";
    public static final String KEY_DISMISS_BLOCKED = "dismissBlocked";

    private Prefs() {
    }

    static SharedPreferences sp(Context ctx) {
        return ctx.getApplicationContext().getSharedPreferences(FILE, Context.MODE_PRIVATE);
    }

    public static boolean ignoreOngoing(Context ctx) {
        return sp(ctx).getBoolean(KEY_IGNORE_ONGOING, true);
    }

    public static boolean newAppsEnabled(Context ctx) {
        return sp(ctx).getBoolean(KEY_NEW_APPS_ENABLED, true);
    }

    public static boolean dismissBlocked(Context ctx) {
        return sp(ctx).getBoolean(KEY_DISMISS_BLOCKED, true);
    }

    /** 0 = keep forever. */
    public static int retentionDays(Context ctx) {
        return sp(ctx).getInt(KEY_RETENTION_DAYS, 30);
    }

    /** Generic setter used by the web UI. Returns true if the key is known. */
    public static boolean set(Context ctx, String key, String value) {
        if (key == null || value == null) return false;
        SharedPreferences.Editor e = sp(ctx).edit();
        if (KEY_IGNORE_ONGOING.equals(key) || KEY_NEW_APPS_ENABLED.equals(key)
                || KEY_DISMISS_BLOCKED.equals(key)) {
            e.putBoolean(key, "true".equalsIgnoreCase(value) || "1".equals(value));
        } else if (KEY_RETENTION_DAYS.equals(key)) {
            int days;
            try {
                days = Integer.parseInt(value.trim());
            } catch (NumberFormatException ex) {
                return false;
            }
            if (days < 0) days = 0;
            e.putInt(key, days);
        } else {
            return false;
        }
        e.apply();
        return true;
    }
}
