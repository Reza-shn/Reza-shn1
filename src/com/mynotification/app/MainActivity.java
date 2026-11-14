package com.mynotification.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Hosts the HTML/CSS/JS user interface (assets/web) in a WebView and exposes
 * the native bridge as window.Android.
 * Developer: PROTHOTECH
 */
public class MainActivity extends Activity {

    static final String TAG = "NotifyManager";
    static final String START_URL = "file:///android_asset/web/index.html";
    static final int REQ_POST_NOTIF = 101;

    /** Currently visible activity, used by the listener service to push live events. */
    static volatile MainActivity sInstance;

    WebView web;
    AppBridge bridge;
    boolean pageReady = false;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setupWindow();

        web = new WebView(this);
        web.setBackgroundColor(isSystemDark() ? Color.BLACK : Color.parseColor("#F2F2F7"));
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(false);
        s.setMediaPlaybackRequiresUserGesture(true);
        s.setTextZoom(100);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setCacheMode(WebSettings.LOAD_NO_CACHE);

        bridge = new AppBridge(this);
        web.addJavascriptInterface(bridge, "Android");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleExternal(url);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleExternal(request.getUrl().toString());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                pageReady = true;
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage m) {
                Log.d(TAG, "JS: " + m.message() + " @" + m.sourceId() + ":" + m.lineNumber());
                return true;
            }
        });

        setContentView(web);
        web.loadUrl(START_URL);

        requestPostNotificationsIfNeeded();
    }

    void setupWindow() {
        applySystemBars(isSystemDark());
    }

    boolean isSystemDark() {
        return (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK)
                == Configuration.UI_MODE_NIGHT_YES;
    }

    /** Matches status / navigation bars to the web theme (light = iOS grouped gray). */
    void applySystemBars(boolean dark) {
        int bg = dark ? Color.BLACK : Color.parseColor("#F2F2F7");
        Window w = getWindow();
        w.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        w.setStatusBarColor(bg);
        w.setNavigationBarColor(bg);
        if (web != null) web.setBackgroundColor(bg);
        View decor = w.getDecorView();
        int flags = decor.getSystemUiVisibility();
        if (Build.VERSION.SDK_INT >= 23) {
            if (dark) flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            else flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        }
        if (Build.VERSION.SDK_INT >= 26) {
            if (dark) flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            else flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        }
        decor.setSystemUiVisibility(flags);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        runJs("window.onSystemTheme && window.onSystemTheme(" + isSystemDark() + ")");
    }

    /** Keeps app pages inside the WebView; anything else opens externally. */
    boolean handleExternal(String url) {
        if (url == null) return false;
        if (url.startsWith("file:///android_asset/")) return false;
        try {
            Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
        } catch (Exception e) {
            Log.w(TAG, "cannot open " + url, e);
        }
        return true;
    }

    void requestPostNotificationsIfNeeded() {
        if (Build.VERSION.SDK_INT >= 33) {
            if (checkSelfPermission("android.permission.POST_NOTIFICATIONS")
                    != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, REQ_POST_NOTIF);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_POST_NOTIF) {
            boolean ok = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            runJs("window.onPermissionResult && window.onPermissionResult(" + ok + ")");
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        sInstance = this;
        if (web != null) web.onResume();
        // user may come back from the "Notification access" settings screen
        runJs("window.onAppResume && window.onAppResume()");
    }

    @Override
    protected void onPause() {
        if (web != null) web.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (sInstance == this) sInstance = null;
        if (web != null) {
            web.removeJavascriptInterface("Android");
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        if (web == null) {
            finish();
            return;
        }
        web.evaluateJavascript("(window.handleBack ? window.handleBack() : false)", value -> {
            if (!"true".equals(value)) {
                moveTaskToBack(true);
            }
        });
    }

    void runJs(final String js) {
        if (web == null) return;
        runOnUiThread(() -> {
            if (web != null) web.evaluateJavascript(js, null);
        });
    }

    /** Called from any thread (listener service, bridge). */
    static void dispatch(String js) {
        MainActivity a = sInstance;
        if (a != null) a.runJs(js);
    }

    /** JSON is valid JS except for U+2028/U+2029 on older engines. */
    static String jsSafe(String json) {
        return json.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029");
    }
}
