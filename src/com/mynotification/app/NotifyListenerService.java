package com.mynotification.app;

import android.app.Notification;
import android.content.ComponentName;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Receives every notification posted on the device (after the user grants
 * "Notification access"), stores it in SQLite and pushes it live to the WebView.
 * Developer: PROTHOTECH
 */
public class NotifyListenerService extends NotificationListenerService {

    static final String TAG = "NotifyListener";

    static volatile boolean sConnected = false;

    static final ExecutorService IO = Executors.newSingleThreadExecutor();

    /** notification key -> signature of the last stored content (de-duplicates updates). */
    final Map<String, String> lastByKey = new HashMap<String, String>();
    final Map<String, String> labelCache = new HashMap<String, String>();
    int insertCounter = 0;

    @Override
    public void onListenerConnected() {
        super.onListenerConnected();
        sConnected = true;
        MainActivity.dispatch("window.onListenerState && window.onListenerState(true)");
    }

    @Override
    public void onListenerDisconnected() {
        super.onListenerDisconnected();
        sConnected = false;
        MainActivity.dispatch("window.onListenerState && window.onListenerState(false)");
        if (Build.VERSION.SDK_INT >= 24) {
            try {
                requestRebind(new ComponentName(this, NotifyListenerService.class));
            } catch (Exception e) {
                Log.w(TAG, "rebind failed", e);
            }
        }
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        if (sbn == null) return;
        try {
            handlePosted(sbn);
        } catch (Exception e) {
            Log.e(TAG, "onNotificationPosted", e);
        }
    }

    void handlePosted(StatusBarNotification sbn) {
        final String pkg = sbn.getPackageName();
        final Notification n = sbn.getNotification();
        if (pkg == null || n == null) return;

        // group summaries duplicate their children
        if ((n.flags & Notification.FLAG_GROUP_SUMMARY) != 0) return;

        final Context ctx = getApplicationContext();
        final NotificationDb db = NotificationDb.get(ctx);
        int[] pref = db.getAppPref(pkg, Prefs.newAppsEnabled(ctx));
        final boolean enabled = pref[0] == 1;
        final boolean blocked = pref[1] == 1;

        // "Blocked Apps": dismiss from the status bar
        boolean ongoing = (n.flags & Notification.FLAG_ONGOING_EVENT) != 0
                || (n.flags & Notification.FLAG_FOREGROUND_SERVICE) != 0;
        if (blocked && !ongoing && Prefs.dismissBlocked(ctx)) {
            try {
                cancelNotification(sbn.getKey());
            } catch (Exception e) {
                Log.w(TAG, "cancel failed", e);
            }
        }

        if (!enabled) return;                              // filtered out by the toggle
        if (ongoing && Prefs.ignoreOngoing(ctx)) return;    // music players, downloads...

        Bundle ex = n.extras;
        String title = "";
        String text = "";
        String subText = "";
        if (ex != null) {
            title = cs(ex.getCharSequence(Notification.EXTRA_TITLE));
            if (title.length() == 0) title = cs(ex.getCharSequence(Notification.EXTRA_TITLE_BIG));
            text = cs(ex.getCharSequence(Notification.EXTRA_BIG_TEXT));
            if (text.length() == 0) text = cs(ex.getCharSequence(Notification.EXTRA_TEXT));
            if (text.length() == 0) {
                CharSequence[] lines = ex.getCharSequenceArray(Notification.EXTRA_TEXT_LINES);
                if (lines != null) {
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < lines.length; i++) {
                        if (lines[i] == null) continue;
                        if (sb.length() > 0) sb.append('\n');
                        sb.append(lines[i]);
                    }
                    text = sb.toString().trim();
                }
            }
            subText = cs(ex.getCharSequence(Notification.EXTRA_SUB_TEXT));
        }
        if (text.length() == 0 && n.tickerText != null) text = n.tickerText.toString().trim();
        if (title.length() == 0 && text.length() == 0) return;

        // de-duplicate repeated updates of the same notification
        String key = sbn.getKey();
        String sig = title + "\u0001" + text;
        if (key != null) {
            if (sig.equals(lastByKey.get(key))) return;
            if (lastByKey.size() > 400) lastByKey.clear();
            lastByKey.put(key, sig);
        }

        final String fTitle = clip(title, 500);
        final String fText = clip(text, 4000);
        final String fSub = clip(subText, 200);
        final String category = n.category == null ? "" : n.category;
        final String appName = label(pkg);
        long post = sbn.getPostTime();
        final long ts = post > 0 ? post : System.currentTimeMillis();
        final boolean prune = (++insertCounter % 50) == 1;

        IO.execute(() -> {
            long id = db.insert(pkg, appName, fTitle, fText, fSub, category, ts, blocked);
            if (prune) {
                int days = Prefs.retentionDays(ctx);
                if (days > 0) db.prune(System.currentTimeMillis() - days * 86400000L);
            }
            try {
                JSONObject o = new JSONObject();
                o.put("id", id);
                o.put("pkg", pkg);
                o.put("appName", appName);
                o.put("title", fTitle);
                o.put("text", fText);
                o.put("subText", fSub);
                o.put("category", category);
                o.put("ts", ts);
                o.put("blocked", blocked);
                o.put("seen", false);
                MainActivity.dispatch("window.onNewNotification && window.onNewNotification("
                        + MainActivity.jsSafe(o.toString()) + ")");
            } catch (JSONException e) {
                Log.w(TAG, "json", e);
            }
        });
    }

    String label(String pkg) {
        String cached = labelCache.get(pkg);
        if (cached != null) return cached;
        String name = pkg;
        try {
            PackageManager pm = getPackageManager();
            ApplicationInfo ai = pm.getApplicationInfo(pkg, 0);
            CharSequence l = pm.getApplicationLabel(ai);
            if (l != null) name = l.toString();
        } catch (Exception ignored) {
        }
        labelCache.put(pkg, name);
        return name;
    }

    static String cs(CharSequence c) {
        return c == null ? "" : c.toString().trim();
    }

    static String clip(String s, int max) {
        if (s == null) return "";
        return s.length() > max ? s.substring(0, max) : s;
    }
}
