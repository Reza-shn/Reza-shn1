package com.mynotification.app;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;
import android.view.HapticFeedbackConstants;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * JavaScript bridge (window.Android). Every method returns plain strings / primitives;
 * complex data is returned as JSON text and parsed in app.js.
 * Methods annotated with @JavascriptInterface run on a WebView background thread.
 * Developer: PROTHOTECH
 */
public class AppBridge {

    static final String TAG = "AppBridge";
    static final String DEVELOPER = "PROTHOTECH";
    static final String TEST_CHANNEL = "nm_test";

    final Activity activity;
    final Context ctx;

    AppBridge(Activity activity) {
        this.activity = activity;
        this.ctx = activity.getApplicationContext();
    }

    // ------------------------------------------------------------------
    // Apps
    // ------------------------------------------------------------------

    static class AppItem {
        String pkg;
        String name;
        boolean system;
        int count;
        long lastTs;
        boolean enabled;
        boolean blocked;
    }

    /** All launchable apps + any app that has logged notifications. */
    @JavascriptInterface
    public String getInstalledApps() {
        JSONArray arr = new JSONArray();
        try {
            PackageManager pm = ctx.getPackageManager();
            NotificationDb db = NotificationDb.get(ctx);
            boolean defEnabled = Prefs.newAppsEnabled(ctx);
            Map<String, int[]> prefs = db.getAllAppPrefs();
            Map<String, Integer> counts = db.countsByPkg();
            Map<String, Long> lastTs = db.lastTsByPkg();
            String self = ctx.getPackageName();

            Map<String, AppItem> items = new LinkedHashMap<String, AppItem>();
            Intent launcher = new Intent(Intent.ACTION_MAIN);
            launcher.addCategory(Intent.CATEGORY_LAUNCHER);
            List<ResolveInfo> ris = pm.queryIntentActivities(launcher, 0);
            List<String> pkgs = new ArrayList<String>();
            for (int i = 0; i < ris.size(); i++) {
                ResolveInfo ri = ris.get(i);
                if (ri.activityInfo != null) pkgs.add(ri.activityInfo.packageName);
            }
            for (String p : counts.keySet()) pkgs.add(p);

            for (int i = 0; i < pkgs.size(); i++) {
                String p = pkgs.get(i);
                if (p == null || p.equals(self) || items.containsKey(p)) continue;
                ApplicationInfo ai;
                try {
                    ai = pm.getApplicationInfo(p, 0);
                } catch (PackageManager.NameNotFoundException e) {
                    continue; // uninstalled
                }
                AppItem it = new AppItem();
                it.pkg = p;
                CharSequence label = pm.getApplicationLabel(ai);
                it.name = label == null ? p : label.toString();
                it.system = (ai.flags & ApplicationInfo.FLAG_SYSTEM) != 0
                        && (ai.flags & ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) == 0;
                Integer c = counts.get(p);
                it.count = c == null ? 0 : c;
                Long lt = lastTs.get(p);
                it.lastTs = lt == null ? 0L : lt;
                int[] pr = prefs.get(p);
                it.enabled = pr == null ? defEnabled : pr[0] == 1;
                it.blocked = pr != null && pr[1] == 1;
                items.put(p, it);
            }

            List<AppItem> list = new ArrayList<AppItem>(items.values());
            Collections.sort(list, (a, b) -> {
                if (a.count != b.count) return a.count > b.count ? -1 : 1;
                if (a.lastTs != b.lastTs) return a.lastTs > b.lastTs ? -1 : 1;
                return a.name.compareToIgnoreCase(b.name);
            });

            for (int i = 0; i < list.size(); i++) {
                AppItem it = list.get(i);
                JSONObject o = new JSONObject();
                o.put("pkg", it.pkg);
                o.put("name", it.name);
                o.put("system", it.system);
                o.put("count", it.count);
                o.put("lastTs", it.lastTs);
                o.put("enabled", it.enabled);
                o.put("blocked", it.blocked);
                arr.put(o);
            }
        } catch (Exception e) {
            Log.e(TAG, "getInstalledApps", e);
        }
        return arr.toString();
    }

    @JavascriptInterface
    public String getAppIcon(String pkg) {
        return IconUtil.iconDataUrl(ctx, pkg);
    }

    @JavascriptInterface
    public boolean setAppEnabled(String pkg, boolean enabled) {
        if (pkg == null || pkg.length() == 0) return false;
        NotificationDb.get(ctx).setEnabled(pkg, enabled, Prefs.newAppsEnabled(ctx));
        return true;
    }

    /** Kept for API compatibility with the original spec: flips the logging filter. */
    @JavascriptInterface
    public boolean toggleAppNotifications(String pkg) {
        if (pkg == null || pkg.length() == 0) return false;
        NotificationDb db = NotificationDb.get(ctx);
        boolean def = Prefs.newAppsEnabled(ctx);
        int[] cur = db.getAppPref(pkg, def);
        boolean next = cur[0] != 1;
        db.setEnabled(pkg, next, def);
        return next;
    }

    @JavascriptInterface
    public boolean setAppBlocked(String pkg, boolean blocked) {
        if (pkg == null || pkg.length() == 0) return false;
        NotificationDb.get(ctx).setBlocked(pkg, blocked, Prefs.newAppsEnabled(ctx));
        return true;
    }

    /** pkgsJson: JSON array of package names. */
    @JavascriptInterface
    public boolean setAppsEnabled(String pkgsJson, boolean enabled) {
        try {
            JSONArray a = new JSONArray(pkgsJson);
            List<String> list = new ArrayList<String>();
            for (int i = 0; i < a.length(); i++) list.add(a.getString(i));
            NotificationDb.get(ctx).setEnabledBulk(list, enabled, Prefs.newAppsEnabled(ctx));
            return true;
        } catch (JSONException e) {
            return false;
        }
    }

    // ------------------------------------------------------------------
    // Notifications / history
    // ------------------------------------------------------------------

    @JavascriptInterface
    public String getNotifications(int limit, int offset, String pkg, String search) {
        return NotificationDb.get(ctx).query(limit, offset, pkg, search).toString();
    }

    @JavascriptInterface
    public String getLatest() {
        JSONObject o = NotificationDb.get(ctx).latest();
        return o == null ? "null" : o.toString();
    }

    @JavascriptInterface
    public String getStats() {
        return NotificationDb.get(ctx).stats().toString();
    }

    @JavascriptInterface
    public int getUnseenCount() {
        return NotificationDb.get(ctx).countUnseen();
    }

    @JavascriptInterface
    public void markAllSeen() {
        NotificationDb.get(ctx).markAllSeen();
    }

    @JavascriptInterface
    public void clearHistory() {
        NotificationDb.get(ctx).clearAll();
    }

    @JavascriptInterface
    public int clearAppHistory(String pkg) {
        if (pkg == null) return 0;
        return NotificationDb.get(ctx).clearForPkg(pkg);
    }

    @JavascriptInterface
    public boolean deleteNotification(String id) {
        try {
            return NotificationDb.get(ctx).delete(Long.parseLong(id));
        } catch (NumberFormatException e) {
            return false;
        }
    }

    /** Shares the last 2000 notifications as CSV text through the Android share sheet. */
    @JavascriptInterface
    public void shareHistory() {
        JSONArray rows = NotificationDb.get(ctx).query(2000, 0, null, null);
        SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US);
        StringBuilder sb = new StringBuilder("time,app,package,title,text\n");
        for (int i = 0; i < rows.length(); i++) {
            JSONObject o = rows.optJSONObject(i);
            if (o == null) continue;
            sb.append(f.format(new Date(o.optLong("ts")))).append(',')
                    .append(csv(o.optString("appName"))).append(',')
                    .append(csv(o.optString("pkg"))).append(',')
                    .append(csv(o.optString("title"))).append(',')
                    .append(csv(o.optString("text"))).append('\n');
        }
        final Intent send = new Intent(Intent.ACTION_SEND);
        send.setType("text/plain");
        send.putExtra(Intent.EXTRA_SUBJECT, "Notification history");
        send.putExtra(Intent.EXTRA_TEXT, sb.toString());
        activity.runOnUiThread(() -> {
            try {
                activity.startActivity(Intent.createChooser(send, "Export history"));
            } catch (Exception e) {
                Log.w(TAG, "share", e);
            }
        });
    }

    static String csv(String s) {
        if (s == null) return "\"\"";
        return "\"" + s.replace("\"", "\"\"").replace("\n", " ") + "\"";
    }

    // ------------------------------------------------------------------
    // Permissions & system screens
    // ------------------------------------------------------------------

    @JavascriptInterface
    public boolean isListenerEnabled() {
        String flat = Settings.Secure.getString(ctx.getContentResolver(), "enabled_notification_listeners");
        if (TextUtils.isEmpty(flat)) return false;
        ComponentName me = new ComponentName(ctx, NotifyListenerService.class);
        String[] parts = flat.split(":");
        for (int i = 0; i < parts.length; i++) {
            ComponentName cn = ComponentName.unflattenFromString(parts[i]);
            if (cn != null && cn.equals(me)) return true;
        }
        return false;
    }

    @JavascriptInterface
    public boolean isListenerConnected() {
        return NotifyListenerService.sConnected;
    }

    @JavascriptInterface
    public void openListenerSettings() {
        Intent i = new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS");
        if (!startSafely(i)) {
            startSafely(new Intent(Settings.ACTION_SETTINGS));
        }
    }

    @JavascriptInterface
    public void openAppNotificationSettings(String pkg) {
        Intent i;
        if (Build.VERSION.SDK_INT >= 26) {
            i = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            i.putExtra(Settings.EXTRA_APP_PACKAGE, pkg);
        } else {
            i = new Intent("android.settings.APP_NOTIFICATION_SETTINGS");
            i.putExtra("app_package", pkg);
            try {
                i.putExtra("app_uid", ctx.getPackageManager().getApplicationInfo(pkg, 0).uid);
            } catch (Exception ignored) {
            }
        }
        if (!startSafely(i)) {
            Intent d = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                    Uri.parse("package:" + pkg));
            startSafely(d);
        }
    }

    @JavascriptInterface
    public boolean openApp(String pkg) {
        Intent i = ctx.getPackageManager().getLaunchIntentForPackage(pkg);
        return i != null && startSafely(i);
    }

    @JavascriptInterface
    public boolean hasPostPermission() {
        if (Build.VERSION.SDK_INT >= 33) {
            return ctx.checkSelfPermission("android.permission.POST_NOTIFICATIONS")
                    == PackageManager.PERMISSION_GRANTED;
        }
        return true;
    }

    @JavascriptInterface
    public void requestPostPermission() {
        if (Build.VERSION.SDK_INT >= 33) {
            activity.runOnUiThread(() -> activity.requestPermissions(
                    new String[]{"android.permission.POST_NOTIFICATIONS"}, MainActivity.REQ_POST_NOTIF));
        }
    }

    /** Posts a notification from this app so the user can verify the listener works. */
    @JavascriptInterface
    public boolean sendTestNotification() {
        if (!hasPostPermission()) {
            requestPostPermission();
            return false;
        }
        try {
            NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
            Notification.Builder b;
            if (Build.VERSION.SDK_INT >= 26) {
                NotificationChannel ch = new NotificationChannel(TEST_CHANNEL,
                        ctx.getString(R.string.test_channel), NotificationManager.IMPORTANCE_DEFAULT);
                nm.createNotificationChannel(ch);
                b = new Notification.Builder(ctx, TEST_CHANNEL);
            } else {
                b = new Notification.Builder(ctx);
            }
            Intent open = new Intent(ctx, MainActivity.class);
            open.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
            int piFlags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= 23) piFlags |= PendingIntent.FLAG_IMMUTABLE;
            PendingIntent pi = PendingIntent.getActivity(ctx, 0, open, piFlags);
            SimpleDateFormat f = new SimpleDateFormat("HH:mm:ss", Locale.US);
            b.setSmallIcon(R.drawable.ic_stat_notify)
                    .setContentTitle("Notification Manager")
                    .setContentText("Test notification at " + f.format(new Date()) + " ✓")
                    .setAutoCancel(true)
                    .setContentIntent(pi);
            nm.notify((int) (System.currentTimeMillis() % 100000), b.build());
            return true;
        } catch (Exception e) {
            Log.e(TAG, "test notification", e);
            return false;
        }
    }

    boolean startSafely(Intent i) {
        try {
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(i);
            return true;
        } catch (Exception e) {
            Log.w(TAG, "startActivity failed: " + i, e);
            return false;
        }
    }

    // ------------------------------------------------------------------
    // Settings & misc
    // ------------------------------------------------------------------

    @JavascriptInterface
    public String getSettings() {
        JSONObject o = new JSONObject();
        try {
            o.put(Prefs.KEY_IGNORE_ONGOING, Prefs.ignoreOngoing(ctx));
            o.put(Prefs.KEY_NEW_APPS_ENABLED, Prefs.newAppsEnabled(ctx));
            o.put(Prefs.KEY_DISMISS_BLOCKED, Prefs.dismissBlocked(ctx));
            o.put(Prefs.KEY_RETENTION_DAYS, Prefs.retentionDays(ctx));
        } catch (JSONException ignored) {
        }
        return o.toString();
    }

    @JavascriptInterface
    public boolean setSetting(String key, String value) {
        return Prefs.set(ctx, key, value);
    }

    @JavascriptInterface
    public String getAppInfo() {
        JSONObject o = new JSONObject();
        try {
            PackageInfo pi = ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0);
            o.put("versionName", pi.versionName);
            o.put("versionCode", Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : pi.versionCode);
            o.put("package", ctx.getPackageName());
            o.put("developer", DEVELOPER);
            o.put("sdk", Build.VERSION.SDK_INT);
            o.put("device", Build.MANUFACTURER + " " + Build.MODEL);
        } catch (Exception ignored) {
        }
        return o.toString();
    }

    @JavascriptInterface
    public void toast(final String msg) {
        activity.runOnUiThread(() -> Toast.makeText(ctx, msg, Toast.LENGTH_SHORT).show());
    }

    @JavascriptInterface
    public void haptic() {
        activity.runOnUiThread(() -> {
            if (activity.getWindow() != null) {
                activity.getWindow().getDecorView()
                        .performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);
            }
        });
    }
}
