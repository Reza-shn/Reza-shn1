package com.mynotification.app;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.DatabaseUtils;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Local SQLite storage for logged notifications and per-app filters.
 * Developer: PROTHOTECH
 */
public class NotificationDb extends SQLiteOpenHelper {

    static final String DB_NAME = "notify_manager.db";
    static final int DB_VERSION = 1;

    static final String T_NOTIF = "notifications";
    static final String T_APPS = "app_prefs";

    private static NotificationDb sInstance;

    public static synchronized NotificationDb get(Context ctx) {
        if (sInstance == null) {
            sInstance = new NotificationDb(ctx.getApplicationContext());
        }
        return sInstance;
    }

    NotificationDb(Context ctx) {
        super(ctx, DB_NAME, null, DB_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE " + T_NOTIF + " ("
                + "_id INTEGER PRIMARY KEY AUTOINCREMENT,"
                + "pkg TEXT NOT NULL,"
                + "app_name TEXT,"
                + "title TEXT,"
                + "text TEXT,"
                + "sub_text TEXT,"
                + "category TEXT,"
                + "ts INTEGER NOT NULL,"
                + "blocked INTEGER NOT NULL DEFAULT 0,"
                + "seen INTEGER NOT NULL DEFAULT 0)");
        db.execSQL("CREATE INDEX idx_notif_ts ON " + T_NOTIF + "(ts)");
        db.execSQL("CREATE INDEX idx_notif_pkg ON " + T_NOTIF + "(pkg)");
        db.execSQL("CREATE TABLE " + T_APPS + " ("
                + "pkg TEXT PRIMARY KEY,"
                + "enabled INTEGER NOT NULL DEFAULT 1,"
                + "blocked INTEGER NOT NULL DEFAULT 0)");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + T_NOTIF);
        db.execSQL("DROP TABLE IF EXISTS " + T_APPS);
        onCreate(db);
    }

    // ------------------------------------------------------------------
    // Per-app filters
    // ------------------------------------------------------------------

    /** pkg -> {enabled, blocked} for every app that has a stored preference. */
    public synchronized Map<String, int[]> getAllAppPrefs() {
        Map<String, int[]> out = new HashMap<String, int[]>();
        Cursor c = getReadableDatabase().rawQuery(
                "SELECT pkg, enabled, blocked FROM " + T_APPS, null);
        try {
            while (c.moveToNext()) {
                out.put(c.getString(0), new int[]{c.getInt(1), c.getInt(2)});
            }
        } finally {
            c.close();
        }
        return out;
    }

    /** Returns {enabled, blocked}; falls back to defaults if the app has no row. */
    public synchronized int[] getAppPref(String pkg, boolean defEnabled) {
        Cursor c = getReadableDatabase().rawQuery(
                "SELECT enabled, blocked FROM " + T_APPS + " WHERE pkg=?", new String[]{pkg});
        try {
            if (c.moveToFirst()) {
                return new int[]{c.getInt(0), c.getInt(1)};
            }
        } finally {
            c.close();
        }
        return new int[]{defEnabled ? 1 : 0, 0};
    }

    void ensureRow(SQLiteDatabase db, String pkg, boolean defEnabled) {
        ContentValues cv = new ContentValues();
        cv.put("pkg", pkg);
        cv.put("enabled", defEnabled ? 1 : 0);
        cv.put("blocked", 0);
        db.insertWithOnConflict(T_APPS, null, cv, SQLiteDatabase.CONFLICT_IGNORE);
    }

    public synchronized void setEnabled(String pkg, boolean enabled, boolean defEnabled) {
        SQLiteDatabase db = getWritableDatabase();
        ensureRow(db, pkg, defEnabled);
        ContentValues cv = new ContentValues();
        cv.put("enabled", enabled ? 1 : 0);
        db.update(T_APPS, cv, "pkg=?", new String[]{pkg});
    }

    public synchronized void setBlocked(String pkg, boolean blocked, boolean defEnabled) {
        SQLiteDatabase db = getWritableDatabase();
        ensureRow(db, pkg, defEnabled);
        ContentValues cv = new ContentValues();
        cv.put("blocked", blocked ? 1 : 0);
        db.update(T_APPS, cv, "pkg=?", new String[]{pkg});
    }

    public synchronized void setEnabledBulk(List<String> pkgs, boolean enabled, boolean defEnabled) {
        SQLiteDatabase db = getWritableDatabase();
        db.beginTransaction();
        try {
            ContentValues cv = new ContentValues();
            cv.put("enabled", enabled ? 1 : 0);
            for (int i = 0; i < pkgs.size(); i++) {
                String p = pkgs.get(i);
                ensureRow(db, p, defEnabled);
                db.update(T_APPS, cv, "pkg=?", new String[]{p});
            }
            db.setTransactionSuccessful();
        } finally {
            db.endTransaction();
        }
    }

    // ------------------------------------------------------------------
    // Notifications
    // ------------------------------------------------------------------

    public synchronized long insert(String pkg, String appName, String title, String text,
                                    String subText, String category, long ts, boolean blocked) {
        ContentValues cv = new ContentValues();
        cv.put("pkg", pkg);
        cv.put("app_name", appName);
        cv.put("title", title);
        cv.put("text", text);
        cv.put("sub_text", subText);
        cv.put("category", category);
        cv.put("ts", ts);
        cv.put("blocked", blocked ? 1 : 0);
        cv.put("seen", 0);
        return getWritableDatabase().insert(T_NOTIF, null, cv);
    }

    static JSONObject rowToJson(Cursor c) throws JSONException {
        JSONObject o = new JSONObject();
        o.put("id", c.getLong(0));
        o.put("pkg", c.getString(1));
        o.put("appName", nz(c.getString(2)));
        o.put("title", nz(c.getString(3)));
        o.put("text", nz(c.getString(4)));
        o.put("subText", nz(c.getString(5)));
        o.put("category", nz(c.getString(6)));
        o.put("ts", c.getLong(7));
        o.put("blocked", c.getInt(8) == 1);
        o.put("seen", c.getInt(9) == 1);
        return o;
    }

    static String nz(String s) {
        return s == null ? "" : s;
    }

    static final String COLS = "_id, pkg, app_name, title, text, sub_text, category, ts, blocked, seen";

    public synchronized JSONArray query(int limit, int offset, String pkg, String search) {
        JSONArray arr = new JSONArray();
        StringBuilder where = new StringBuilder("1=1");
        List<String> args = new ArrayList<String>();
        if (pkg != null && pkg.length() > 0) {
            where.append(" AND pkg=?");
            args.add(pkg);
        }
        if (search != null && search.trim().length() > 0) {
            String like = "%" + search.trim().replace("\\", "\\\\").replace("%", "\\%")
                    .replace("_", "\\_") + "%";
            where.append(" AND (title LIKE ? ESCAPE '\\' OR text LIKE ? ESCAPE '\\'"
                    + " OR app_name LIKE ? ESCAPE '\\')");
            args.add(like);
            args.add(like);
            args.add(like);
        }
        if (limit <= 0) limit = 50;
        if (offset < 0) offset = 0;
        String sql = "SELECT " + COLS + " FROM " + T_NOTIF + " WHERE " + where
                + " ORDER BY ts DESC, _id DESC LIMIT " + limit + " OFFSET " + offset;
        Cursor c = getReadableDatabase().rawQuery(sql, args.toArray(new String[args.size()]));
        try {
            while (c.moveToNext()) {
                arr.put(rowToJson(c));
            }
        } catch (JSONException ignored) {
        } finally {
            c.close();
        }
        return arr;
    }

    public synchronized JSONObject latest() {
        Cursor c = getReadableDatabase().rawQuery("SELECT " + COLS + " FROM " + T_NOTIF
                + " ORDER BY ts DESC, _id DESC LIMIT 1", null);
        try {
            if (c.moveToFirst()) return rowToJson(c);
        } catch (JSONException ignored) {
        } finally {
            c.close();
        }
        return null;
    }

    public synchronized int countUnseen() {
        return (int) DatabaseUtils.longForQuery(getReadableDatabase(),
                "SELECT COUNT(*) FROM " + T_NOTIF + " WHERE seen=0", null);
    }

    public synchronized void markAllSeen() {
        ContentValues cv = new ContentValues();
        cv.put("seen", 1);
        getWritableDatabase().update(T_NOTIF, cv, "seen=0", null);
    }

    public synchronized void clearAll() {
        getWritableDatabase().delete(T_NOTIF, null, null);
    }

    public synchronized int clearForPkg(String pkg) {
        return getWritableDatabase().delete(T_NOTIF, "pkg=?", new String[]{pkg});
    }

    public synchronized boolean delete(long id) {
        return getWritableDatabase().delete(T_NOTIF, "_id=?",
                new String[]{String.valueOf(id)}) > 0;
    }

    public synchronized int prune(long olderThan) {
        return getWritableDatabase().delete(T_NOTIF, "ts<?",
                new String[]{String.valueOf(olderThan)});
    }

    /** pkg -> number of logged notifications. */
    public synchronized Map<String, Integer> countsByPkg() {
        Map<String, Integer> m = new HashMap<String, Integer>();
        Cursor c = getReadableDatabase().rawQuery(
                "SELECT pkg, COUNT(*) FROM " + T_NOTIF + " GROUP BY pkg", null);
        try {
            while (c.moveToNext()) {
                m.put(c.getString(0), c.getInt(1));
            }
        } finally {
            c.close();
        }
        return m;
    }

    /** pkg -> timestamp of the latest notification. */
    public synchronized Map<String, Long> lastTsByPkg() {
        Map<String, Long> m = new HashMap<String, Long>();
        Cursor c = getReadableDatabase().rawQuery(
                "SELECT pkg, MAX(ts) FROM " + T_NOTIF + " GROUP BY pkg", null);
        try {
            while (c.moveToNext()) {
                m.put(c.getString(0), c.getLong(1));
            }
        } finally {
            c.close();
        }
        return m;
    }

    static long startOfToday() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTimeInMillis();
    }

    /** Aggregated statistics for the Stats tab and the dashboard mini-chart. */
    public synchronized JSONObject stats() {
        JSONObject o = new JSONObject();
        SQLiteDatabase db = getReadableDatabase();
        try {
            long total = DatabaseUtils.longForQuery(db, "SELECT COUNT(*) FROM " + T_NOTIF, null);
            long blocked = DatabaseUtils.longForQuery(db,
                    "SELECT COUNT(*) FROM " + T_NOTIF + " WHERE blocked=1", null);
            long today0 = startOfToday();
            long today = DatabaseUtils.longForQuery(db,
                    "SELECT COUNT(*) FROM " + T_NOTIF + " WHERE ts>=?",
                    new String[]{String.valueOf(today0)});
            o.put("total", total);
            o.put("blocked", blocked);
            o.put("today", today);

            // last 7 days (oldest first)
            JSONArray week = new JSONArray();
            Calendar cal = Calendar.getInstance();
            cal.setTimeInMillis(today0);
            cal.add(Calendar.DAY_OF_YEAR, -6);
            for (int i = 0; i < 7; i++) {
                long from = cal.getTimeInMillis();
                cal.add(Calendar.DAY_OF_YEAR, 1);
                long to = cal.getTimeInMillis();
                long n = DatabaseUtils.longForQuery(db,
                        "SELECT COUNT(*) FROM " + T_NOTIF + " WHERE ts>=? AND ts<?",
                        new String[]{String.valueOf(from), String.valueOf(to)});
                JSONObject d = new JSONObject();
                d.put("day", from);
                d.put("count", n);
                week.put(d);
            }
            o.put("week", week);

            // hour-of-day distribution (local time)
            long[] hours = new long[24];
            Cursor hc = db.rawQuery("SELECT CAST(strftime('%H', ts/1000, 'unixepoch', 'localtime')"
                    + " AS INTEGER) h, COUNT(*) FROM " + T_NOTIF + " GROUP BY h", null);
            try {
                while (hc.moveToNext()) {
                    int h = hc.getInt(0);
                    if (h >= 0 && h < 24) hours[h] = hc.getLong(1);
                }
            } finally {
                hc.close();
            }
            JSONArray ha = new JSONArray();
            for (int i = 0; i < 24; i++) ha.put(hours[i]);
            o.put("hours", ha);

            // top apps
            JSONArray top = new JSONArray();
            Cursor tc = db.rawQuery("SELECT pkg, MAX(app_name), COUNT(*) c FROM " + T_NOTIF
                    + " GROUP BY pkg ORDER BY c DESC LIMIT 6", null);
            try {
                while (tc.moveToNext()) {
                    JSONObject t = new JSONObject();
                    t.put("pkg", tc.getString(0));
                    t.put("name", nz(tc.getString(1)));
                    t.put("count", tc.getLong(2));
                    top.put(t);
                }
            } finally {
                tc.close();
            }
            o.put("top", top);
        } catch (JSONException ignored) {
        }
        return o;
    }
}
