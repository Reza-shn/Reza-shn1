# Notification Manager — PROTHOTECH

Package: `com.mynotification.app` · Min Android 5.0 (API 21) · Target API 34

Native Java (no AndroidX / AppCompat / Kotlin / Gradle) + HTML/CSS/JS UI in a WebView.

## Build locally
```bash
export ANDROID_HOME=$HOME/Android/Sdk      # needs platforms;android-34 + build-tools
chmod +x build.sh
./build.sh
# -> dist/NotificationManager-v1.0.0.apk
```
On the first build a signing key is created in `keystore/release.jks`
(password `prothotech123`). **Keep this file** — updates must be signed with the same key.

## Build on GitHub
Push the project to a repo → **Actions → Build APK** → download the `NotificationManager-apk` artifact.
For a stable signing key, add repository secrets `KEYSTORE_BASE64` (`base64 -w0 release.jks`),
`KEYSTORE_PASS`, `KEY_ALIAS`, `KEY_PASS`.

## After installing
Open the app → allow **Notification access** for "Notification Manager".
On Android 13+, if the system says "Restricted setting" for a side-loaded APK:
Settings → Apps → Notification Manager → ⋮ → *Allow restricted settings*, then try again.

## Layout
```
AndroidManifest.xml  version.properties  build.sh  strip_params.py
stubs/java/lang/invoke/LambdaMetafactory.java   (compile-time only)
src/com/mynotification/app/
  MainActivity.java          WebView host, back handling, live push to JS
  AppBridge.java             @JavascriptInterface (window.Android)
  NotifyListenerService.java NotificationListenerService -> SQLite
  NotificationDb.java        SQLite (notifications, app_prefs)
  Prefs.java  IconUtil.java
res/   (theme, strings, launcher icons, status-bar icon)
assets/web/ index.html  style.css  app.js
.github/workflows/build.yml
```
