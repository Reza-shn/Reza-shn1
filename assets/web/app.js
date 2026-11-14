/* =====================================================================
   Notification Manager — front-end logic (iOS glass UI, fa / en)
   Talks to Java through window.Android (AppBridge.java).
   In a normal browser a mock bridge with demo data is used.
   Developer: PROTHOTECH
   ===================================================================== */
(function () {
  'use strict';

  // ================================================================== i18n
  var STR = {
    en: {
      'home.title': 'Notifications', 'home.sub': 'Control and track what your apps send',
      'home.wApps': 'Apps logged', 'home.wToday': 'Today', 'home.ofApps': '{a} of {b} apps',
      'home.todaySub': 'notifications · {n} this week',
      'home.recent': 'Recent', 'home.apps': 'Apps', 'home.appsFoot': 'Turn an app off to stop saving its notifications in History.',
      'home.noRecent': 'No notifications yet', 'home.noRecentSub': 'New notifications will appear here.',
      'common.seeAll': 'See All', 'common.back': 'Back', 'common.edit': 'Edit', 'common.more': 'More',
      'common.cancel': 'Cancel', 'common.ok': 'OK', 'common.delete': 'Delete', 'common.clear': 'Clear', 'common.saved': 'Saved',
      'nav.unread': 'Unread notifications',
      'q.history': 'History', 'q.blocked': 'Blocked', 'q.test': 'Test', 'q.clear': 'Clear',
      'tab.home': 'Home', 'tab.history': 'History', 'tab.stats': 'Stats', 'tab.apps': 'Apps',
      'access.title': 'Notification access is off', 'access.sub': 'Allow access so the app can log notifications.', 'access.btn': 'Allow',
      'access.alertTitle': 'Allow Notification Access', 'access.alertText': 'To log and manage notifications from other apps, turn on “Notification Manager” in the next screen.', 'access.open': 'Open Settings',
      'history.title': 'History', 'history.search': 'Search', 'history.all': 'All', 'history.count': '{n} notifications saved', 'history.from': 'From {app}',
      'history.empty': 'History is empty', 'history.emptySub': 'Incoming notifications will be saved here.', 'history.noResults': 'No Results', 'history.noResultsSub': 'Try a different search.',
      'history.end': 'End of history', 'history.loading': 'Loading…', 'history.blocked': 'Blocked', 'history.export': 'Export as CSV', 'history.clearAll': 'Clear All History',
      'day.today': 'Today', 'day.yesterday': 'Yesterday',
      'ago.now': 'now', 'ago.min': '{n}m', 'ago.hour': '{n}h', 'ago.day': '{n}d',
      'stats.title': 'Statistics', 'stats.sub': 'How your apps reach you', 'stats.week': 'Last 7 Days', 'stats.hours': 'By Hour', 'stats.top': 'Top Apps',
      'stats.total': 'Total', 'stats.today': 'Today', 'stats.apps': 'Apps Logged', 'stats.blocked': 'Blocked', 'stats.notifs': 'notifications', 'stats.hidden': '{n} hidden', 'stats.none': 'Statistics appear once notifications are logged.',
      'apps.title': 'Apps', 'apps.search': 'Search apps', 'apps.fAll': 'All', 'apps.fOn': 'On', 'apps.fOff': 'Off', 'apps.fUser': 'User', 'apps.sub': '{a} of {b} apps are logged',
      'apps.enableShown': 'Turn On All Shown', 'apps.disableShown': 'Turn Off All Shown', 'apps.none': 'No apps match',
      'apps.logging': 'Logging', 'apps.off': 'Off', 'apps.blockedTag': 'Blocked', 'apps.bulkOn': '{n} apps turned on', 'apps.bulkOff': '{n} apps turned off',
      'blocked.title': 'Blocked Apps', 'blocked.sub': '{n} apps blocked',
      'blocked.info': 'Notifications from blocked apps are removed from the status bar as soon as they arrive. They are still saved in History if the app is turned on in Apps.',
      'blocked.noAccess': 'Notification access is off — blocking needs it.',
      'sheet.logged': 'Logged', 'sheet.last': 'Last', 'sheet.log': 'Save to History', 'sheet.block': 'Block Notifications', 'sheet.viewHistory': 'View History',
      'sheet.sysSettings': 'System Notification Settings', 'sheet.open': 'Open App', 'sheet.clear': 'Clear This App’s History', 'sheet.cantOpen': 'This app can’t be opened',
      'sheet.clearTitle': 'Clear {app}?', 'sheet.clearText': 'Every saved notification from this app will be deleted.', 'sheet.deleted': '{n} deleted',
      'settings.title': 'Settings', 'settings.appearance': 'Appearance', 'settings.language': 'Language', 'settings.theme': 'Theme',
      'theme.auto': 'Auto', 'theme.light': 'Light', 'theme.dark': 'Dark',
      'settings.perm': 'Permissions', 'settings.access': 'Notification Access', 'settings.granted': 'Allowed', 'settings.notGranted': 'Not allowed',
      'settings.post': 'Post Notifications', 'settings.test': 'Send Test Notification',
      'settings.logging': 'Logging', 'settings.ignoreOngoing': 'Ignore Persistent', 'settings.ignoreOngoingSub': 'Music, downloads, VPN and other ongoing items',
      'settings.newApps': 'Log New Apps', 'settings.newAppsSub': 'Default for apps you install later',
      'settings.dismiss': 'Dismiss Blocked Apps', 'settings.dismissSub': 'Remove their notifications from the status bar',
      'settings.storage': 'Storage', 'settings.keep': 'Keep History', 'settings.export': 'Export History', 'settings.clearAll': 'Clear All History',
      'keep.7': '7 Days', 'keep.30': '30 Days', 'keep.90': '90 Days', 'keep.365': '1 Year', 'keep.0': 'Forever', 'keep.title': 'Older notifications are deleted automatically.',
      'about.version': 'Version {v}', 'about.by': 'Developed by',
      'clear.title': 'Clear All History?', 'clear.text': 'All saved notifications will be permanently deleted from this device.', 'clear.done': 'History cleared',
      'toast.on': '{app} — logging on', 'toast.off': '{app} — logging off', 'toast.blocked': '{app} blocked', 'toast.unblocked': '{app} unblocked',
      'toast.testSent': 'Test notification sent', 'toast.allowFirst': 'Allow notifications first', 'toast.permOk': 'Notifications allowed', 'toast.permNo': 'Permission denied',
      'toast.exportDevice': 'Export works on the device', 'toast.deleted': 'Deleted',
      'test.title': 'Notification Manager', 'test.text': 'This is a test notification'
    },
    fa: {
      'home.title': 'اعلان‌ها', 'home.sub': 'اعلان‌های برنامه‌هایتان را مدیریت و دنبال کنید',
      'home.wApps': 'برنامه‌های فعال', 'home.wToday': 'امروز', 'home.ofApps': '{a} از {b} برنامه',
      'home.todaySub': 'اعلان · {n} در این هفته',
      'home.recent': 'آخرین اعلان‌ها', 'home.apps': 'برنامه‌ها', 'home.appsFoot': 'با خاموش کردن هر برنامه، اعلان‌های آن دیگر در تاریخچه ذخیره نمی‌شوند.',
      'home.noRecent': 'هنوز اعلانی نیامده', 'home.noRecentSub': 'اعلان‌های جدید این‌جا نمایش داده می‌شوند.',
      'common.seeAll': 'همه', 'common.back': 'بازگشت', 'common.edit': 'ویرایش', 'common.more': 'بیشتر',
      'common.cancel': 'انصراف', 'common.ok': 'تأیید', 'common.delete': 'حذف', 'common.clear': 'پاک کردن', 'common.saved': 'ذخیره شد',
      'nav.unread': 'اعلان‌های خوانده‌نشده',
      'q.history': 'تاریخچه', 'q.blocked': 'مسدودها', 'q.test': 'آزمایش', 'q.clear': 'پاک‌سازی',
      'tab.home': 'خانه', 'tab.history': 'تاریخچه', 'tab.stats': 'آمار', 'tab.apps': 'برنامه‌ها',
      'access.title': 'دسترسی به اعلان‌ها خاموش است', 'access.sub': 'برای ثبت اعلان‌ها، دسترسی را فعال کنید.', 'access.btn': 'فعال‌سازی',
      'access.alertTitle': 'اجازه‌ی دسترسی به اعلان‌ها', 'access.alertText': 'برای ثبت و مدیریت اعلان‌های برنامه‌های دیگر، در صفحه‌ی بعد گزینه‌ی «مدیریت اعلان‌ها» را روشن کنید.', 'access.open': 'باز کردن تنظیمات',
      'history.title': 'تاریخچه', 'history.search': 'جستجو', 'history.all': 'همه', 'history.count': '{n} اعلان ذخیره شده', 'history.from': 'اعلان‌های {app}',
      'history.empty': 'تاریخچه خالی است', 'history.emptySub': 'اعلان‌های دریافتی این‌جا ذخیره می‌شوند.', 'history.noResults': 'نتیجه‌ای پیدا نشد', 'history.noResultsSub': 'عبارت دیگری را جستجو کنید.',
      'history.end': 'پایان تاریخچه', 'history.loading': 'در حال بارگذاری…', 'history.blocked': 'مسدود', 'history.export': 'خروجی CSV', 'history.clearAll': 'پاک کردن کل تاریخچه',
      'day.today': 'امروز', 'day.yesterday': 'دیروز',
      'ago.now': 'همین الان', 'ago.min': '{n} دقیقه پیش', 'ago.hour': '{n} ساعت پیش', 'ago.day': '{n} روز پیش',
      'stats.title': 'آمار', 'stats.sub': 'برنامه‌ها چطور با شما در ارتباط‌اند', 'stats.week': '۷ روز اخیر', 'stats.hours': 'بر اساس ساعت', 'stats.top': 'پراعلان‌ترین برنامه‌ها',
      'stats.total': 'کل', 'stats.today': 'امروز', 'stats.apps': 'برنامه‌های فعال', 'stats.blocked': 'مسدود', 'stats.notifs': 'اعلان', 'stats.hidden': '{n} اعلان پنهان', 'stats.none': 'پس از ثبت اعلان‌ها، آمار این‌جا نمایش داده می‌شود.',
      'apps.title': 'برنامه‌ها', 'apps.search': 'جستجوی برنامه', 'apps.fAll': 'همه', 'apps.fOn': 'روشن', 'apps.fOff': 'خاموش', 'apps.fUser': 'نصبی', 'apps.sub': '{a} از {b} برنامه ثبت می‌شوند',
      'apps.enableShown': 'روشن کردن همه‌ی موارد نمایش‌داده‌شده', 'apps.disableShown': 'خاموش کردن همه‌ی موارد نمایش‌داده‌شده', 'apps.none': 'برنامه‌ای پیدا نشد',
      'apps.logging': 'در حال ثبت', 'apps.off': 'خاموش', 'apps.blockedTag': 'مسدود', 'apps.bulkOn': '{n} برنامه روشن شد', 'apps.bulkOff': '{n} برنامه خاموش شد',
      'blocked.title': 'برنامه‌های مسدود', 'blocked.sub': '{n} برنامه مسدود است',
      'blocked.info': 'اعلان‌های برنامه‌های مسدود به محض رسیدن از نوار اعلان حذف می‌شوند. اگر ثبت آن برنامه در بخش «برنامه‌ها» روشن باشد، همچنان در تاریخچه ذخیره می‌شوند.',
      'blocked.noAccess': 'دسترسی به اعلان‌ها خاموش است و مسدودسازی بدون آن کار نمی‌کند.',
      'sheet.logged': 'ثبت‌شده', 'sheet.last': 'آخرین', 'sheet.log': 'ذخیره در تاریخچه', 'sheet.block': 'مسدود کردن اعلان‌ها', 'sheet.viewHistory': 'مشاهده‌ی تاریخچه',
      'sheet.sysSettings': 'تنظیمات اعلان سیستم', 'sheet.open': 'باز کردن برنامه', 'sheet.clear': 'پاک کردن تاریخچه‌ی این برنامه', 'sheet.cantOpen': 'این برنامه قابل باز شدن نیست',
      'sheet.clearTitle': 'تاریخچه‌ی {app} پاک شود؟', 'sheet.clearText': 'همه‌ی اعلان‌های ذخیره‌شده‌ی این برنامه حذف می‌شوند.', 'sheet.deleted': '{n} مورد حذف شد',
      'settings.title': 'تنظیمات', 'settings.appearance': 'ظاهر', 'settings.language': 'زبان', 'settings.theme': 'پوسته',
      'theme.auto': 'خودکار', 'theme.light': 'روشن', 'theme.dark': 'تیره',
      'settings.perm': 'دسترسی‌ها', 'settings.access': 'دسترسی به اعلان‌ها', 'settings.granted': 'فعال', 'settings.notGranted': 'غیرفعال',
      'settings.post': 'ارسال اعلان', 'settings.test': 'ارسال اعلان آزمایشی',
      'settings.logging': 'ثبت اعلان‌ها', 'settings.ignoreOngoing': 'نادیده گرفتن اعلان‌های دائمی', 'settings.ignoreOngoingSub': 'موسیقی، دانلود، VPN و موارد مشابه',
      'settings.newApps': 'ثبت برنامه‌های جدید', 'settings.newAppsSub': 'وضعیت پیش‌فرض برای برنامه‌هایی که بعداً نصب می‌کنید',
      'settings.dismiss': 'حذف اعلان برنامه‌های مسدود', 'settings.dismissSub': 'اعلان‌هایشان از نوار اعلان پاک شود',
      'settings.storage': 'حافظه', 'settings.keep': 'نگهداری تاریخچه', 'settings.export': 'خروجی گرفتن از تاریخچه', 'settings.clearAll': 'پاک کردن کل تاریخچه',
      'keep.7': '۷ روز', 'keep.30': '۳۰ روز', 'keep.90': '۹۰ روز', 'keep.365': '۱ سال', 'keep.0': 'همیشه', 'keep.title': 'اعلان‌های قدیمی‌تر به‌طور خودکار حذف می‌شوند.',
      'about.version': 'نسخه‌ی {v}', 'about.by': 'توسعه‌دهنده',
      'clear.title': 'کل تاریخچه پاک شود؟', 'clear.text': 'همه‌ی اعلان‌های ذخیره‌شده برای همیشه از این دستگاه حذف می‌شوند.', 'clear.done': 'تاریخچه پاک شد',
      'toast.on': 'ثبت {app} روشن شد', 'toast.off': 'ثبت {app} خاموش شد', 'toast.blocked': '{app} مسدود شد', 'toast.unblocked': '{app} از مسدودی خارج شد',
      'toast.testSent': 'اعلان آزمایشی ارسال شد', 'toast.allowFirst': 'ابتدا اجازه‌ی ارسال اعلان را بدهید', 'toast.permOk': 'اجازه داده شد', 'toast.permNo': 'اجازه داده نشد',
      'toast.exportDevice': 'خروجی فقط روی گوشی کار می‌کند', 'toast.deleted': 'حذف شد',
      'test.title': 'مدیریت اعلان‌ها', 'test.text': 'این یک اعلان آزمایشی است'
    }
  };

  // ================================================================== prefs (localStorage, guarded)
  function lsGet(k, d) { try { var v = localStorage.getItem('nm.' + k); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem('nm.' + k, v); } catch (e) { } }
  var LANG = lsGet('lang', 'fa');
  var THEME = lsGet('theme', 'auto');

  function t(key, vars) {
    var s = (STR[LANG] && STR[LANG][key]) || STR.en[key] || key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }
  var nf = null;
  function num(n) {
    n = Number(n) || 0;
    if (!nf) { try { nf = new Intl.NumberFormat(LANG === 'fa' ? 'fa-IR' : 'en-US'); } catch (e) { nf = { format: String }; } }
    return nf.format(n);
  }
  function short(n) { n = Number(n) || 0; return n >= 10000 ? num(Math.round(n / 100) / 10) + (LANG === 'fa' ? 'هزار' : 'k') : num(n); }
  function dtf(opts) {
    var loc = LANG === 'fa' ? 'fa-IR-u-ca-persian-nu-arabext' : 'en-US';
    try { return new Intl.DateTimeFormat(loc, opts); } catch (e) { return new Intl.DateTimeFormat('en-US', opts); }
  }
  var fmtCache = {};
  function fmt(kind, ts) {
    var opts = {
      time: { hour: '2-digit', minute: '2-digit', hour12: false },
      day: { weekday: 'long', day: 'numeric', month: 'long' },
      dayYear: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
      wd: { weekday: 'narrow' },
      wdShort: { weekday: 'short' }
    }[kind];
    var k = LANG + kind;
    if (!fmtCache[k]) fmtCache[k] = dtf(opts);
    return fmtCache[k].format(new Date(ts));
  }
  function ago(ts) {
    var d = (Date.now() - ts) / 1000;
    if (d < 60) return t('ago.now');
    if (d < 3600) return t('ago.min', { n: num(Math.round(d / 60)) });
    if (d < 86400) return t('ago.hour', { n: num(Math.round(d / 3600)) });
    if (d < 86400 * 7) return t('ago.day', { n: num(Math.round(d / 86400)) });
    return fmt('day', ts);
  }
  function startOfDay(ts) { var d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function dayLabel(ts) {
    var today = startOfDay(Date.now());
    if (ts >= today) return t('day.today');
    if (ts >= today - 86400000) return t('day.yesterday');
    return fmt(new Date(ts).getFullYear() === new Date().getFullYear() ? 'day' : 'dayYear', ts);
  }

  // ================================================================== icons (SF-Symbols-like line set)
  var I = {
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9.5a6 6 0 0 1 12 0c0 4.5 1.6 6.3 2.4 7.1a.5.5 0 0 1-.36.86H3.96a.5.5 0 0 1-.36-.86C4.4 15.8 6 14 6 9.5z"/><path d="M9.7 20.5a2.5 2.5 0 0 0 4.6 0"/></svg>',
    bellFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5a6.8 6.8 0 0 0-6.8 6.8c0 4.3-1.5 6-2.3 6.8A1.2 1.2 0 0 0 3.8 18h16.4a1.2 1.2 0 0 0 .9-1.9c-.8-.8-2.3-2.5-2.3-6.8A6.8 6.8 0 0 0 12 2.5zM9.2 19.5a3 3 0 0 0 5.6 0z"/></svg>',
    bellSlash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.2 4.6A6 6 0 0 1 18 9.5c0 2.6.5 4.3 1.1 5.4M6 9.5c0 4.5-1.6 6.3-2.4 7.1a.5.5 0 0 0 .36.86H17"/><path d="M9.7 20.5a2.5 2.5 0 0 0 4.6 0"/><path d="M3 3l18 18"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.25.4-1.51 1z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6.2H9V21H4.5a1 1 0 0 1-1-1z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.8"/><path d="M12 7v5.2l3.3 2"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 20V12M10 20V6M15 20v-9M20 20V4"/></svg>',
    apps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="7" height="7" rx="2.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2.2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2.2"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M21 3 10.2 13.8"/><path d="M21 3 14.4 21l-4.2-7.2L3 9.6z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6.5h16"/><path d="M9 6.5V4.8c0-.7.6-1.3 1.3-1.3h3.4c.7 0 1.3.6 1.3 1.3v1.7"/><path d="m6 6.5 1 12.7A2 2 0 0 0 9 21h6a2 2 0 0 0 2-1.8l1-12.7"/><path d="M10 11v5.5M14 11v5.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m20 20-4.2-4.2"/></svg>',
    chevBack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 4.5-7.5 7.5 7.5 7.5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5.5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="18.5" cy="12" r="1.9"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.3 14.2-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4z"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1.8 20.5h20.4zm-1 6h2v6h-2zm0 8h2v2h-2z"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4.5"/><path d="m11.2 11.8 8.8-8.8M17 6l2.5 2.5M14.5 8.5 16.5 10.5"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7.5 7.5 4.5-4.5 4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>',
    open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
    db: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13"/><path d="M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15.4a.6.6 0 0 0-.7-.8z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.8 4.5 5.6v5.8c0 4.7 3.2 8.5 7.5 9.8 4.3-1.3 7.5-5.1 7.5-9.8V5.6z"/></svg>'
  };
  function ic(name, cls) { return '<i data-ic="' + name + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + (I[name] || '') + '</i>'; }
  function hydrate(root) {
    $$('i[data-ic]', root).forEach(function (el) { if (!el.innerHTML) el.innerHTML = I[el.getAttribute('data-ic')] || ''; });
  }

  // ================================================================== helpers
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function cssEsc(s) { return String(s).replace(/["\\]/g, '\\$&'); }
  function debounce(fn, ms) { var h; return function () { var a = arguments; clearTimeout(h); h = setTimeout(function () { fn.apply(null, a); }, ms); }; }
  var PALETTE = ['#007aff', '#34c759', '#ff9500', '#af52de', '#ff2d55', '#5856d6', '#30b0c7', '#ff3b30'];
  function avatar(name, pkg) {
    var s = String(pkg || name || '?'); var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    var c = PALETTE[h % PALETTE.length];
    var ch = (String(name || '?').trim().charAt(0) || '?').toUpperCase();
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="' + c + '"/><text x="32" y="42" font-family="Roboto,Arial,sans-serif" font-size="28" font-weight="600" fill="#fff" text-anchor="middle">' + esc(ch) + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // ================================================================== bridge
  var NATIVE = typeof window.Android !== 'undefined' && window.Android !== null;
  var B = NATIVE ? window.Android : createMockBridge();
  function raw(fn) {
    try {
      if (typeof B[fn] !== 'function') return null;
      return B[fn].apply(B, Array.prototype.slice.call(arguments, 1));
    } catch (e) { console.error('bridge ' + fn, e); return null; }
  }
  function json() {
    var r = raw.apply(null, arguments);
    if (r == null || r === '') return null;
    if (typeof r !== 'string') return r;
    try { return JSON.parse(r); } catch (e) { return null; }
  }
  function haptic() { raw('haptic'); }

  // ================================================================== state
  var S = {
    view: 'home', tab: 'home', stack: [],
    apps: [], appMap: {}, stats: null, latest: [], listener: false, settings: {}, info: {}, unseen: 0,
    appsFilter: 'all', appsQuery: '', blockedQuery: '', sheetPkg: null,
    hist: { items: [], offset: 0, done: false, loading: false, pkg: '', q: '', lastDay: -1 },
    dirtyHistory: true
  };
  var PAGE = 40, HOME_APPS = 6, HOME_RECENT = 3;

  // ================================================================== theme / language
  function systemDark() {
    if (NATIVE) return !!raw('isSystemDark');
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function applyTheme() {
    var dark = THEME === 'dark' || (THEME === 'auto' && systemDark());
    document.documentElement.classList.toggle('dark', dark);
    raw('setSystemBars', dark);
  }
  function applyLang() {
    nf = null; fmtCache = {};
    var h = document.documentElement;
    h.lang = LANG; h.dir = LANG === 'fa' ? 'rtl' : 'ltr';
    document.title = t('test.title');
    $$('[data-t]').forEach(function (el) { el.textContent = t(el.getAttribute('data-t')); });
    $$('[data-t-ph]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-t-ph')); });
    $$('[data-t-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-t-aria'))); });
    $$('#appsSeg button').forEach(function (b) { b.textContent = t(b.getAttribute('data-t')); });
    requestAnimationFrame(movePill);
  }
  window.onSystemTheme = function () { if (THEME === 'auto') applyTheme(); };
  if (window.matchMedia) {
    try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if (THEME === 'auto') applyTheme(); }); } catch (e) { }
  }

  // ================================================================== icons loading
  var iconCache = {}, iconQueue = [], iconBusy = false;
  function img(pkg, name, cls) {
    return '<img class="' + (cls == null ? 'app-ic' : cls) + '" data-pkg="' + esc(pkg) + '" src="' + (iconCache[pkg] || avatar(name, pkg)) + '" alt="">';
  }
  function loadIcons(root) {
    $$('img[data-pkg]', root).forEach(function (el) {
      var p = el.getAttribute('data-pkg');
      if (iconCache[p]) { if (el.src !== iconCache[p]) el.src = iconCache[p]; return; }
      if (iconCache[p] === '') return;
      if (iconQueue.indexOf(p) < 0) iconQueue.push(p);
    });
    pump();
  }
  function pump() {
    if (iconBusy || !iconQueue.length) return;
    iconBusy = true;
    setTimeout(function () {
      iconQueue.splice(0, 4).forEach(function (p) {
        var url = raw('getAppIcon', p) || '';
        iconCache[p] = url;
        if (url) $$('img[data-pkg="' + cssEsc(p) + '"]').forEach(function (el) { el.src = url; });
      });
      iconBusy = false; pump();
    }, 16);
  }

  // ================================================================== data
  function loadApps() {
    S.apps = json('getInstalledApps') || [];
    S.appMap = {};
    S.apps.forEach(function (a) { S.appMap[a.pkg] = a; });
  }
  function loadCore() {
    S.listener = !!raw('isListenerEnabled');
    S.settings = json('getSettings') || {};
    S.stats = json('getStats') || { total: 0, today: 0, blocked: 0, week: [], hours: [], top: [] };
    S.latest = json('getNotifications', HOME_RECENT, 0, '', '') || [];
    S.unseen = Number(raw('getUnseenCount')) || 0;
  }
  function refreshAll() {
    loadCore(); loadApps();
    S.dirtyHistory = true;
    renderView(S.view);
    renderBadge();
  }
  function appName(pkg, fallback) { return (S.appMap[pkg] && S.appMap[pkg].name) || fallback || pkg; }

  // ================================================================== navigation
  var TABS = ['home', 'history', 'stats', 'apps'];
  function showView(view) {
    S.view = view;
    $$('.view').forEach(function (v) { v.classList.toggle('active', v.getAttribute('data-view') === view); });
    renderView(view);
    updateScrolled($('.view[data-view="' + view + '"]'));
  }
  function go(tab) {
    if (TABS.indexOf(tab) < 0) return;
    closeSheet(); closeActionSheet();
    S.stack = []; S.tab = tab;
    $$('#tabbar button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === tab); });
    $('#tabbar').classList.remove('no-tab');
    movePill();
    showView(tab);
    haptic();
  }
  function push(page) {
    closeSheet(); closeActionSheet();
    S.stack.push(S.view);
    var el = $('.view[data-view="' + page + '"]');
    el.scrollTop = 0;
    showView(page);
    haptic();
  }
  function pop() {
    var prev = S.stack.pop() || S.tab;
    showView(prev);
  }
  function movePill() {
    var btn = $('#tabbar button[data-tab="' + S.tab + '"]');
    var pill = $('#tabPill');
    if (!btn || !pill) return;
    pill.style.width = btn.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + (btn.offsetLeft - 5) + 'px)';
  }
  window.addEventListener('resize', movePill);

  window.handleBack = function () {
    if ($('#alert').classList.contains('on')) { closeAlert(); return true; }
    if ($('#actionsheet').classList.contains('on')) { closeActionSheet(); return true; }
    if ($('#sheet').classList.contains('on')) { closeSheet(); return true; }
    if (S.stack.length) { pop(); return true; }
    if (S.view !== 'home') { go('home'); return true; }
    return false;
  };

  function renderView(v) {
    if (v === 'home') renderHome();
    else if (v === 'history') { if (S.dirtyHistory) resetHistory(); if (S.unseen) { raw('markAllSeen'); S.unseen = 0; renderBadge(); } }
    else if (v === 'stats') renderStats();
    else if (v === 'apps') renderApps();
    else if (v === 'blocked') renderBlocked();
    else if (v === 'settings') renderSettings();
  }

  // large-title → compact nav bar on scroll
  function updateScrolled(v) { if (v) v.classList.toggle('scrolled', v.scrollTop > 36); }
  $$('.view').forEach(function (v) {
    v.addEventListener('scroll', function () {
      updateScrolled(v);
      if (v.getAttribute('data-view') === 'history' && v.scrollTop + v.clientHeight > v.scrollHeight - 500) loadMoreHistory();
    }, { passive: true });
  });

  // ================================================================== HOME
  function renderBadge() {
    var b = $('#badge');
    b.textContent = S.unseen > 99 ? num(99) + '+' : num(S.unseen);
    b.classList.toggle('hidden', !S.unseen);
  }
  function renderHome() {
    // access banner
    $('#accessBanner').innerHTML = S.listener ? '' :
      '<div class="banner glass"><span class="b-ic">' + ic('bellSlash') + '</span><div class="b-body"><b>' + t('access.title') + '</b><small>' + t('access.sub') + '</small></div><button class="pill-btn" data-action="grant">' + t('access.btn') + '</button></div>';

    // widget: apps ring
    var on = S.apps.filter(function (a) { return a.enabled; }).length;
    var pct = S.apps.length ? Math.round(on * 100 / S.apps.length) : 0;
    $('#pct').textContent = num(pct) + (LANG === 'fa' ? '٪' : '%');
    $('#pctSub').textContent = t('home.ofApps', { a: num(on), b: num(S.apps.length) });
    $('#ringFg').style.strokeDashoffset = String(169.65 * (1 - pct / 100));

    // widget: today
    var st = S.stats || {};
    var wk = st.week || [];
    var weekTotal = wk.reduce(function (s, d) { return s + (d.count || 0); }, 0);
    $('#todayNum').textContent = short(st.today || 0);
    $('#todaySub').textContent = t('home.todaySub', { n: short(weekTotal) });
    var max = Math.max.apply(null, wk.map(function (d) { return d.count; }).concat([1]));
    $('#spark').innerHTML = (wk.length ? wk : [0, 0, 0, 0, 0, 0, 0].map(function () { return { count: 0 }; })).map(function (d) {
      return '<span style="height:' + Math.max(10, Math.round(d.count * 100 / max)) + '%"></span>';
    }).join('');

    // recent
    var rec = $('#homeRecent');
    if (!S.latest.length) {
      rec.innerHTML = '<div class="empty">' + ic('bell') + '<b>' + t('home.noRecent') + '</b>' + t('home.noRecentSub') + '</div>';
    } else {
      rec.innerHTML = S.latest.map(function (n) {
        var line = n.title && n.text ? n.title + ' — ' + n.text : (n.title || n.text);
        return '<button class="row" data-go="history">' + img(n.pkg, n.appName) +
          '<span class="r-body"><span class="r-title">' + esc(appName(n.pkg, n.appName)) + '</span><span class="r-sub">' + esc(line) + '</span></span>' +
          '<span class="r-val" style="font-size:13px">' + esc(ago(n.ts)) + '</span></button>';
      }).join('');
    }
    // apps
    var box = $('#homeApps');
    var list = S.apps.slice(0, HOME_APPS);
    box.innerHTML = list.length ? list.map(function (a) { return appRow(a, 'log'); }).join('') :
      '<div class="empty">' + ic('apps') + '<b>' + t('apps.none') + '</b></div>';
    loadIcons(rec); loadIcons(box);
  }

  function appSub(a, mode) {
    if (mode === 'block') return a.blocked ? '<span class="r-sub blocked">' + t('apps.blockedTag') + '</span>' : '<span class="r-sub">' + (a.count ? short(a.count) + ' ' + t('stats.notifs') : '&nbsp;') + '</span>';
    var parts = [];
    if (a.blocked) return '<span class="r-sub blocked">' + t('apps.blockedTag') + (a.count ? ' · ' + short(a.count) : '') + '</span>';
    parts.push(a.enabled ? t('apps.logging') : t('apps.off'));
    if (a.count) parts.push(short(a.count) + ' ' + t('stats.notifs'));
    return '<span class="r-sub' + (a.enabled ? ' on' : '') + '">' + parts.join(' · ') + '</span>';
  }
  function appRow(a, mode) {
    var isBlock = mode === 'block';
    var checked = isBlock ? a.blocked : a.enabled;
    return '<div class="row tap" data-row="' + esc(a.pkg) + '" data-mode="' + mode + '">' + img(a.pkg, a.name) +
      '<span class="r-body" data-open="' + esc(a.pkg) + '"><span class="r-title">' + esc(a.name) + '</span>' + appSub(a, mode) + '</span>' +
      '<label class="sw' + (isBlock ? ' red' : '') + '"><input type="checkbox" data-' + (isBlock ? 'block' : 'toggle') + '="' + esc(a.pkg) + '"' + (checked ? ' checked' : '') + '><span class="track"><span class="knob"></span></span></label>' +
      '</div>';
  }

  // ================================================================== STATS
  function renderStats() {
    S.stats = json('getStats') || S.stats || {};
    var st = S.stats;
    var on = S.apps.filter(function (a) { return a.enabled; }).length;
    var blockedApps = S.apps.filter(function (a) { return a.blocked; }).length;
    var tiles = [
      ['blue', 'bell', t('stats.total'), short(st.total), t('stats.notifs')],
      ['pink', 'clock', t('stats.today'), short(st.today), t('stats.notifs')],
      ['green', 'apps', t('stats.apps'), num(on), t('home.ofApps', { a: num(on), b: num(S.apps.length) })],
      ['red', 'bellSlash', t('stats.blocked'), num(blockedApps), t('stats.hidden', { n: short(st.blocked) })]
    ];
    $('#statTiles').innerHTML = tiles.map(function (x) {
      return '<div class="tile glass ' + x[0] + '"><div class="w-head"><span class="w-ic">' + ic(x[1]) + '</span>' + esc(x[2]) + '</div><strong>' + esc(x[3]) + '</strong><small>' + esc(x[4]) + '</small></div>';
    }).join('');

    var wk = st.week || [];
    var max = Math.max.apply(null, wk.map(function (d) { return d.count; }).concat([1]));
    $('#weekChart').innerHTML = wk.map(function (d, i) {
      return '<div class="wk' + (i === wk.length - 1 ? ' today' : '') + '"><span class="v">' + short(d.count) + '</span><span class="b" style="height:' + Math.max(4, Math.round(d.count * 82 / max)) + '%"></span><span class="d">' + esc(fmt('wdShort', d.day)) + '</span></div>';
    }).join('');

    var hrs = st.hours || [];
    var hmax = Math.max.apply(null, hrs.concat([1]));
    $('#hourChart').innerHTML = hrs.map(function (v) { return '<span style="height:' + Math.max(3, Math.round(v * 100 / hmax)) + '%"></span>'; }).join('');
    $('#hourAxis').innerHTML = [0, 6, 12, 18, 23].map(function (h) { return '<span>' + num(h) + '</span>'; }).join('');

    var top = st.top || [];
    var tmax = top.length ? top[0].count : 1;
    $('#topApps').innerHTML = top.length ? top.map(function (x) {
      var name = appName(x.pkg, x.name);
      return '<button class="row" data-open="' + esc(x.pkg) + '">' + img(x.pkg, name) +
        '<span class="r-body"><span style="display:flex;justify-content:space-between;gap:8px"><span class="r-title">' + esc(name) + '</span><span class="r-val">' + short(x.count) + '</span></span>' +
        '<span class="bar-track"><b style="width:' + Math.max(4, Math.round(x.count * 100 / tmax)) + '%"></b></span></span></button>';
    }).join('') : '<div class="empty">' + ic('chart') + t('stats.none') + '</div>';
    loadIcons($('#topApps'));
  }

  // ================================================================== HISTORY
  function resetHistory() {
    var h = S.hist;
    h.items = []; h.offset = 0; h.done = false; h.lastDay = -1;
    $('#historyList').innerHTML = '';
    renderChips();
    loadMoreHistory();
    S.dirtyHistory = false;
  }
  function renderChips() {
    var withData = S.apps.filter(function (a) { return a.count > 0; });
    if (S.hist.pkg && !withData.some(function (a) { return a.pkg === S.hist.pkg; })) withData.unshift(S.appMap[S.hist.pkg] || { pkg: S.hist.pkg, name: S.hist.pkg, count: 0 });
    $('#historyChips').innerHTML = '<button class="chip' + (S.hist.pkg ? '' : ' on') + '" data-chip="">' + t('history.all') + '</button>' +
      withData.map(function (a) {
        return '<button class="chip' + (S.hist.pkg === a.pkg ? ' on' : '') + '" data-chip="' + esc(a.pkg) + '">' + img(a.pkg, a.name, '') + esc(a.name) + (a.count ? ' <small>' + short(a.count) + '</small>' : '') + '</button>';
      }).join('');
    loadIcons($('#historyChips'));
    $('#historySub').textContent = S.hist.pkg ? t('history.from', { app: appName(S.hist.pkg) }) : t('history.count', { n: short((S.stats && S.stats.total) || 0) });
  }
  function notifRow(n, fresh) {
    var name = appName(n.pkg, n.appName);
    return '<div class="n-wrap" data-id="' + n.id + '"><div class="n-del">' + ic('trash') + t('common.delete') + '</div>' +
      '<div class="n-row' + (fresh ? ' fresh' : '') + '">' + img(n.pkg, name) +
      '<div class="n-body"><div class="n-top"><b>' + esc(name) + '</b>' + (n.blocked ? '<span class="tag">' + t('history.blocked') + '</span>' : '') + '<time>' + esc(fmt('time', n.ts)) + '</time></div>' +
      (n.title ? '<div class="n-title">' + esc(n.title) + '</div>' : '') +
      (n.text ? '<div class="n-text">' + esc(n.text) + '</div>' : '') +
      '</div></div></div>';
  }
  function loadMoreHistory() {
    var h = S.hist;
    if (h.loading || h.done) return;
    h.loading = true;
    var rows = json('getNotifications', PAGE, h.offset, h.pkg, h.q) || [];
    h.offset += rows.length;
    if (rows.length < PAGE) h.done = true;
    var list = $('#historyList');
    rows.forEach(function (n) {
      var d = startOfDay(n.ts);
      if (d !== h.lastDay) {
        h.lastDay = d;
        list.insertAdjacentHTML('beforeend', '<div class="day-head">' + esc(dayLabel(n.ts)) + '</div><div class="group glass day-group" data-day="' + d + '"></div>');
      }
      var groups = list.querySelectorAll('.day-group');
      groups[groups.length - 1].insertAdjacentHTML('beforeend', notifRow(n, false));
      h.items.push(n);
    });
    if (!h.items.length) {
      list.innerHTML = '<div class="group glass"><div class="empty">' + ic(h.q ? 'search' : 'clock') + '<b>' + t(h.q ? 'history.noResults' : 'history.empty') + '</b>' +
        t(h.q ? 'history.noResultsSub' : (S.listener ? 'history.emptySub' : 'access.sub')) +
        (!S.listener && !h.q ? '<br><button class="pill-btn" data-action="grant">' + t('access.btn') + '</button>' : '') + '</div></div>';
    }
    $('#historyMore').textContent = h.done ? (h.items.length > 6 ? t('history.end') : '') : t('history.loading');
    loadIcons(list);
    h.loading = false;
  }
  function deleteNotif(wrap) {
    var id = wrap.getAttribute('data-id');
    if (!raw('deleteNotification', String(id))) return;
    wrap.style.transition = 'height .25s ease, opacity .2s';
    wrap.style.height = wrap.offsetHeight + 'px';
    requestAnimationFrame(function () { wrap.style.height = '0px'; wrap.style.opacity = '0'; });
    setTimeout(function () {
      var g = wrap.parentNode;
      if (g) g.removeChild(wrap);
      if (g && !g.children.length) { var hd = g.previousElementSibling; if (hd && hd.classList.contains('day-head')) hd.remove(); g.remove(); }
    }, 260);
    S.hist.items = S.hist.items.filter(function (n) { return String(n.id) !== String(id); });
    S.hist.offset = Math.max(0, S.hist.offset - 1);
    S.latest = json('getNotifications', HOME_RECENT, 0, '', '') || [];
    haptic();
  }

  // swipe-to-delete (works for LTR and RTL)
  var sw = null;
  document.addEventListener('touchstart', function (e) {
    var row = e.target.closest('.n-row');
    if (!row) return;
    closeOpenSwipes(row);
    sw = { row: row, x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, active: false, base: Number(row.getAttribute('data-off') || 0) };
  }, { passive: true });
  document.addEventListener('touchmove', function (e) {
    if (!sw) return;
    var dx = e.touches[0].clientX - sw.x, dy = e.touches[0].clientY - sw.y;
    if (!sw.active) { if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.3) sw.active = true; else if (Math.abs(dy) > 10) { sw = null; return; } else return; }
    var sign = document.documentElement.dir === 'rtl' ? 1 : -1;      // direction that reveals "Delete"
    var off = Math.max(0, sign * dx + sw.base);
    sw.dx = off;
    sw.row.parentNode.classList.add('swiping');
    sw.row.style.transition = 'none';
    sw.row.style.transform = 'translateX(' + (sign * off) + 'px)';
  }, { passive: true });
  document.addEventListener('touchend', function () {
    if (!sw) return;
    var row = sw.row, sign = document.documentElement.dir === 'rtl' ? 1 : -1, w = row.offsetWidth;
    row.style.transition = '';
    if (sw.active) {
      if (sw.dx > w * 0.55) { row.style.transform = 'translateX(' + (sign * w) + 'px)'; deleteNotif(row.parentNode); }
      else if (sw.dx > 50) { row.style.transform = 'translateX(' + (sign * 96) + 'px)'; row.setAttribute('data-off', '96'); }
      else { resetSwipe(row); }
      row.setAttribute('data-swiped', '1');
      setTimeout(function () { row.removeAttribute('data-swiped'); }, 60);
    }
    sw = null;
  });
  function resetSwipe(r) {
    r.style.transform = ''; r.removeAttribute('data-off');
    setTimeout(function () { if (!r.getAttribute('data-off') && r.parentNode) r.parentNode.classList.remove('swiping'); }, 260);
  }
  function closeOpenSwipes(except) {
    $$('.n-row[data-off]').forEach(function (r) { if (r !== except) resetSwipe(r); });
  }

  // ================================================================== APPS
  function filteredApps() {
    var q = S.appsQuery.toLowerCase();
    return S.apps.filter(function (a) {
      if (q && a.name.toLowerCase().indexOf(q) < 0 && a.pkg.toLowerCase().indexOf(q) < 0) return false;
      if (S.appsFilter === 'enabled') return a.enabled;
      if (S.appsFilter === 'disabled') return !a.enabled;
      if (S.appsFilter === 'user') return !a.system;
      return true;
    });
  }
  function renderApps() {
    var list = filteredApps();
    var on = S.apps.filter(function (a) { return a.enabled; }).length;
    $('#appsSub').textContent = t('apps.sub', { a: num(on), b: num(S.apps.length) });
    $$('#appsSeg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-f') === S.appsFilter); });
    $('#appsList').innerHTML = list.length ? list.map(function (a) { return appRow(a, 'log'); }).join('') :
      '<div class="empty">' + ic('search') + '<b>' + t('apps.none') + '</b></div>';
    loadIcons($('#appsList'));
  }

  // ================================================================== BLOCKED
  function renderBlocked() {
    var n = S.apps.filter(function (a) { return a.blocked; }).length;
    $('#blockedSub').textContent = t('blocked.sub', { n: num(n) });
    $('#blockedInfo').innerHTML = t('blocked.info') + (S.listener ? '' : '<br><br><b class="bad">' + t('blocked.noAccess') + '</b>');
    var q = S.blockedQuery.toLowerCase();
    var list = S.apps.filter(function (a) { return !q || a.name.toLowerCase().indexOf(q) >= 0 || a.pkg.toLowerCase().indexOf(q) >= 0; });
    list.sort(function (a, b) { return (b.blocked ? 1 : 0) - (a.blocked ? 1 : 0); });
    $('#blockedList').innerHTML = list.map(function (a) { return appRow(a, 'block'); }).join('') || '<div class="empty">' + t('apps.none') + '</div>';
    loadIcons($('#blockedList'));
  }

  // ================================================================== SETTINGS
  function keepLabel(d) { return t('keep.' + d) !== 'keep.' + d ? t('keep.' + d) : num(d); }
  function renderSettings() {
    S.listener = !!raw('isListenerEnabled');
    S.settings = json('getSettings') || S.settings;
    S.info = json('getAppInfo') || S.info || {};
    var post = raw('hasPostPermission') !== false;
    var st = S.settings;
    function sw(key, on) { return '<label class="sw"><input type="checkbox" data-setting="' + key + '"' + (on ? ' checked' : '') + '><span class="track"><span class="knob"></span></span></label>'; }
    function seg(name, items, cur) {
      return '<div class="segmented" data-seg="' + name + '">' + items.map(function (x) { return '<button data-v="' + x[0] + '"' + (x[0] === cur ? ' class="on"' : '') + '>' + x[1] + '</button>'; }).join('') + '</div>';
    }
    function row(color, icon, title, right, action, sub, extra) {
      return '<' + (action ? 'button' : 'div') + ' class="row' + (action ? ' tap' : '') + (extra || '') + '"' + (action ? ' data-action="' + action + '"' : '') + '><span class="r-ic ' + color + '">' + ic(icon) + '</span>' +
        '<span class="r-body"><span class="r-title">' + title + '</span>' + (sub ? '<span class="r-sub">' + sub + '</span>' : '') + '</span>' + (right || '') + '</' + (action ? 'button' : 'div') + '>';
    }
    var chev = ic('chev', 'r-chev flip');
    $('#settingsBody').innerHTML =
      '<p class="set-label">' + t('settings.appearance') + '</p><div class="group glass">' +
        row('blue', 'globe', t('settings.language'), seg('lang', [['fa', 'فارسی'], ['en', 'English']], LANG)) +
        row('indigo', 'moon', t('settings.theme'), seg('theme', [['auto', t('theme.auto')], ['light', t('theme.light')], ['dark', t('theme.dark')]], THEME)) +
      '</div>' +
      '<p class="set-label">' + t('settings.perm') + '</p><div class="group glass">' +
        row(S.listener ? 'green' : 'red', 'key', t('settings.access'), '<span class="r-val ' + (S.listener ? 'ok' : 'bad') + '">' + t(S.listener ? 'settings.granted' : 'settings.notGranted') + '</span>' + chev, 'grant') +
        row('orange', 'bell', t('settings.post'), '<span class="r-val ' + (post ? 'ok' : 'bad') + '">' + t(post ? 'settings.granted' : 'settings.notGranted') + '</span>' + chev, 'post') +
        row('purple', 'send', t('settings.test'), chev, 'test') +
      '</div>' +
      '<p class="set-label">' + t('settings.logging') + '</p><div class="group glass">' +
        row('teal', 'layers', t('settings.ignoreOngoing'), sw('ignoreOngoing', st.ignoreOngoing !== false), null, t('settings.ignoreOngoingSub')) +
        row('green', 'plus', t('settings.newApps'), sw('newAppsEnabled', st.newAppsEnabled !== false), null, t('settings.newAppsSub')) +
        row('red', 'bellSlash', t('settings.dismiss'), sw('dismissBlocked', st.dismissBlocked !== false), null, t('settings.dismissSub')) +
      '</div>' +
      '<p class="set-label">' + t('settings.storage') + '</p><div class="group glass">' +
        row('orange', 'db', t('settings.keep'), '<span class="r-val">' + keepLabel(Number(st.retentionDays || 0)) + '</span>' + chev, 'keep') +
        row('blue', 'share', t('settings.export'), chev, 'share') +
        row('red', 'trash', t('settings.clearAll'), '', 'clear', null, ' danger') +
      '</div>' +
      '<div class="about"><div class="logo">' + ic('bellFill') + '</div><b>' + t('test.title') + '</b>' +
        t('about.version', { v: esc(S.info.versionName || '1.1.0') }) + '<br>' + t('about.by') + ' <span class="dev">' + esc(S.info.developer || 'PROTHOTECH') + '</span></div>';
  }

  // ================================================================== SHEET (app details)
  function openSheet(pkg) {
    var a = S.appMap[pkg];
    if (!a) return;
    S.sheetPkg = pkg;
    var sh = $('#sheet');
    function row(color, icon, title, right, action, extra) {
      return '<' + (action ? 'button' : 'div') + ' class="row' + (action ? ' tap' : '') + (extra || '') + '"' + (action ? ' data-sheet="' + action + '"' : '') + '><span class="r-ic ' + color + '">' + ic(icon) + '</span><span class="r-body"><span class="r-title">' + title + '</span></span>' + (right || '') + '</' + (action ? 'button' : 'div') + '>';
    }
    var chev = ic('chev', 'r-chev flip');
    sh.innerHTML = '<div class="grab"></div>' +
      '<div class="sh-head">' + img(a.pkg, a.name) + '<div><b>' + esc(a.name) + '</b><small>' + esc(a.pkg) + '</small></div><button class="close" data-close>' + ic('x') + '</button></div>' +
      '<div class="tiles"><div class="tile blue"><div class="w-head"><span class="w-ic">' + ic('bell') + '</span>' + t('sheet.logged') + '</div><strong>' + short(a.count) + '</strong></div>' +
      '<div class="tile purple"><div class="w-head"><span class="w-ic">' + ic('clock') + '</span>' + t('sheet.last') + '</div><strong style="font-size:18px">' + (a.lastTs ? esc(ago(a.lastTs)) : '—') + '</strong></div></div>' +
      '<div class="group">' +
        row('green', 'db', t('sheet.log'), '<label class="sw"><input type="checkbox" data-toggle="' + esc(a.pkg) + '"' + (a.enabled ? ' checked' : '') + '><span class="track"><span class="knob"></span></span></label>') +
        row('red', 'bellSlash', t('sheet.block'), '<label class="sw red"><input type="checkbox" data-block="' + esc(a.pkg) + '"' + (a.blocked ? ' checked' : '') + '><span class="track"><span class="knob"></span></span></label>') +
      '</div><div class="group">' +
        row('blue', 'clock', t('sheet.viewHistory'), chev, 'history') +
        row('orange', 'gear', t('sheet.sysSettings'), chev, 'settings') +
        row('indigo', 'open', t('sheet.open'), chev, 'open') +
      '</div><div class="group">' +
        row('red', 'trash', t('sheet.clear'), '', 'clear', ' danger') +
      '</div>';
    loadIcons(sh);
    $('#scrim').classList.add('on');
    sh.classList.add('on');
    sh.scrollTop = 0;
    haptic();
  }
  function closeSheet() {
    $('#sheet').classList.remove('on');
    S.sheetPkg = null;
    syncScrim();
  }
  function syncScrim() {
    var any = $('#sheet').classList.contains('on') || $('#actionsheet').classList.contains('on') || $('#alert').classList.contains('on');
    $('#scrim').classList.toggle('on', any);
  }

  // ================================================================== action sheet / alert / HUD
  var asActions = [];
  function actionSheet(title, actions) {
    asActions = actions;
    $('#actionsheet').innerHTML = '<div class="as-group">' + (title ? '<div class="as-title">' + esc(title) + '</div>' : '') +
      actions.map(function (a, i) { return '<button class="as-btn' + (a.destructive ? ' destructive' : '') + (a.on ? ' on' : '') + '" data-as="' + i + '"' + (title && i === 0 ? ' style="border-top:.5px solid var(--sep)"' : '') + '>' + esc(a.label) + '</button>'; }).join('') +
      '</div><div class="as-group"><button class="as-btn cancel" data-as="-1">' + t('common.cancel') + '</button></div>';
    $('#scrim').classList.add('on');
    $('#actionsheet').classList.add('on');
    haptic();
  }
  function closeActionSheet() { $('#actionsheet').classList.remove('on'); syncScrim(); }

  var alertCb = null;
  function alertBox(title, text, okLabel, cb, destructive) {
    alertCb = cb;
    $('#alert').innerHTML = '<h3>' + esc(title) + '</h3><p>' + esc(text) + '</p><div class="al-btns"><button data-al="0">' + t('common.cancel') + '</button><button data-al="1" class="strong' + (destructive ? ' destructive' : '') + '">' + esc(okLabel) + '</button></div>';
    $('#scrim').classList.add('on');
    $('#alert').classList.add('on');
  }
  function closeAlert() { $('#alert').classList.remove('on'); alertCb = null; syncScrim(); }

  var hudT;
  function hud(msg, icon) {
    var h = $('#hud');
    h.innerHTML = ic(icon || 'check') + '<span>' + esc(msg) + '</span>';
    h.classList.add('on');
    clearTimeout(hudT);
    hudT = setTimeout(function () { h.classList.remove('on'); }, 2000);
  }

  // ================================================================== mutations
  function setEnabled(pkg, on) {
    raw('setAppEnabled', pkg, !!on);
    var a = S.appMap[pkg]; if (a) a.enabled = !!on;
    syncApp(pkg);
    hud(t(on ? 'toast.on' : 'toast.off', { app: a ? a.name : pkg }));
  }
  function setBlocked(pkg, on) {
    raw('setAppBlocked', pkg, !!on);
    var a = S.appMap[pkg]; if (a) a.blocked = !!on;
    syncApp(pkg);
    hud(t(on ? 'toast.blocked' : 'toast.unblocked', { app: a ? a.name : pkg }), on ? 'bellSlash' : 'check');
  }
  function syncApp(pkg) {
    var a = S.appMap[pkg];
    if (!a) return;
    $$('.row[data-row="' + cssEsc(pkg) + '"]').forEach(function (r) {
      var tmp = document.createElement('div');
      tmp.innerHTML = appRow(a, r.getAttribute('data-mode'));
      r.parentNode.replaceChild(tmp.firstChild, r);
    });
    $$('#sheet input[data-toggle]').forEach(function (i) { i.checked = a.enabled; });
    $$('#sheet input[data-block]').forEach(function (i) { i.checked = a.blocked; });
    if (S.view === 'home') renderHome();
    if (S.view === 'apps') $('#appsSub').textContent = t('apps.sub', { a: num(S.apps.filter(function (x) { return x.enabled; }).length), b: num(S.apps.length) });
    if (S.view === 'blocked') $('#blockedSub').textContent = t('blocked.sub', { n: num(S.apps.filter(function (x) { return x.blocked; }).length) });
    loadIcons(document);
  }
  function bulk(on) {
    var list = filteredApps();
    if (!list.length) return;
    raw('setAppsEnabled', JSON.stringify(list.map(function (a) { return a.pkg; })), !!on);
    list.forEach(function (a) { a.enabled = !!on; });
    renderApps();
    hud(t(on ? 'apps.bulkOn' : 'apps.bulkOff', { n: num(list.length) }));
  }
  function clearAll() {
    alertBox(t('clear.title'), t('clear.text'), t('common.clear'), function () {
      raw('clearHistory');
      refreshAll();
      hud(t('clear.done'), 'trash');
    }, true);
  }
  function sendTest() {
    var ok = raw('sendTestNotificationText', t('test.title'), t('test.text'));
    if (ok == null) ok = raw('sendTestNotification');
    hud(t(ok ? 'toast.testSent' : 'toast.allowFirst'), ok ? 'send' : 'warn');
  }

  // ================================================================== events
  document.addEventListener('click', function (e) {
    var tg = e.target, el;
    if (tg.closest('.sw')) return; // switches handled by change event

    if ((el = tg.closest('[data-as]'))) {
      var i = Number(el.getAttribute('data-as')); var act = asActions[i];
      closeActionSheet(); if (act && act.fn) act.fn(); return;
    }
    if ((el = tg.closest('[data-al]'))) { var cb = alertCb; closeAlert(); if (el.getAttribute('data-al') === '1' && cb) cb(); return; }
    if (tg.id === 'scrim') { if ($('#alert').classList.contains('on')) closeAlert(); else if ($('#actionsheet').classList.contains('on')) closeActionSheet(); else closeSheet(); return; }
    if (tg.closest('[data-close]')) { closeSheet(); return; }

    if ((el = tg.closest('[data-tab]'))) { go(el.getAttribute('data-tab')); return; }
    if ((el = tg.closest('[data-go]'))) { go(el.getAttribute('data-go')); return; }
    if ((el = tg.closest('[data-push]'))) { push(el.getAttribute('data-push')); return; }
    if (tg.closest('[data-back]')) { pop(); return; }
    if ((el = tg.closest('[data-open]'))) { openSheet(el.getAttribute('data-open')); return; }
    if ((el = tg.closest('.row[data-row]'))) { openSheet(el.getAttribute('data-row')); return; }

    if ((el = tg.closest('[data-chip]'))) { S.hist.pkg = el.getAttribute('data-chip'); resetHistory(); $('.view[data-view="history"]').scrollTop = 0; return; }

    if ((el = tg.closest('.n-row'))) {
      if (el.getAttribute('data-swiped')) return;
      if (el.getAttribute('data-off')) { resetSwipe(el); return; }
      el.classList.toggle('open'); return;
    }
    if ((el = tg.closest('.n-del'))) { deleteNotif(el.parentNode); return; }

    if ((el = tg.closest('[data-seg]'))) {
      var b = tg.closest('button'); if (!b) return;
      var name = el.getAttribute('data-seg'), v = b.getAttribute('data-v');
      if (name === 'lang' && v !== LANG) { LANG = v; lsSet('lang', v); applyLang(); refreshAll(); }
      if (name === 'theme' && v !== THEME) { THEME = v; lsSet('theme', v); applyTheme(); renderSettings(); }
      haptic(); return;
    }
    if ((el = tg.closest('#appsSeg button'))) { S.appsFilter = el.getAttribute('data-f'); renderApps(); haptic(); return; }

    if ((el = tg.closest('[data-sheet]'))) {
      var pkg = S.sheetPkg, what = el.getAttribute('data-sheet');
      if (!pkg) return;
      if (what === 'history') { S.hist.pkg = pkg; S.dirtyHistory = true; go('history'); }
      else if (what === 'settings') raw('openAppNotificationSettings', pkg);
      else if (what === 'open') { if (!raw('openApp', pkg)) hud(t('sheet.cantOpen'), 'warn'); }
      else if (what === 'clear') {
        var a = S.appMap[pkg];
        alertBox(t('sheet.clearTitle', { app: a ? a.name : pkg }), t('sheet.clearText'), t('common.delete'), function () {
          var n = raw('clearAppHistory', pkg) || 0;
          closeSheet(); refreshAll();
          hud(t('sheet.deleted', { n: num(n) }), 'trash');
        }, true);
      }
      return;
    }

    if ((el = tg.closest('[data-action]'))) {
      var action = el.getAttribute('data-action');
      if (action === 'clear') clearAll();
      else if (action === 'share') { raw('shareHistory'); if (!NATIVE) hud(t('toast.exportDevice'), 'share'); }
      else if (action === 'grant') raw('openListenerSettings');
      else if (action === 'post') raw('requestPostPermission');
      else if (action === 'test') sendTest();
      else if (action === 'historyMenu') actionSheet(null, [
        { label: t('history.export'), fn: function () { raw('shareHistory'); if (!NATIVE) hud(t('toast.exportDevice'), 'share'); } },
        { label: t('history.clearAll'), destructive: true, fn: clearAll }
      ]);
      else if (action === 'appsMenu') actionSheet(null, [
        { label: t('apps.enableShown'), fn: function () { bulk(true); } },
        { label: t('apps.disableShown'), destructive: true, fn: function () { bulk(false); } }
      ]);
      else if (action === 'keep') {
        var cur = Number(S.settings.retentionDays || 0);
        actionSheet(t('keep.title'), [7, 30, 90, 365, 0].map(function (d) {
          return { label: keepLabel(d), on: d === cur, fn: function () { raw('setSetting', 'retentionDays', String(d)); S.settings.retentionDays = d; renderSettings(); hud(t('common.saved')); } };
        }));
      }
      return;
    }
  });

  document.addEventListener('change', function (e) {
    var tg = e.target;
    if (tg.hasAttribute('data-toggle')) { setEnabled(tg.getAttribute('data-toggle'), tg.checked); haptic(); }
    else if (tg.hasAttribute('data-block')) { setBlocked(tg.getAttribute('data-block'), tg.checked); haptic(); }
    else if (tg.hasAttribute('data-setting')) {
      var k = tg.getAttribute('data-setting');
      raw('setSetting', k, String(tg.checked));
      S.settings[k] = tg.checked;
      if (k === 'newAppsEnabled') loadApps();
      haptic(); hud(t('common.saved'));
    }
  });

  $('#historySearch').addEventListener('input', debounce(function (e) { S.hist.q = e.target.value.trim(); resetHistory(); }, 250));
  $('#appsSearch').addEventListener('input', debounce(function (e) { S.appsQuery = e.target.value.trim(); renderApps(); }, 150));
  $('#blockedSearch').addEventListener('input', debounce(function (e) { S.blockedQuery = e.target.value.trim(); renderBlocked(); }, 150));

  // ================================================================== callbacks from Java
  window.onNewNotification = function (n) {
    if (!n) return;
    S.latest.unshift(n); S.latest = S.latest.slice(0, HOME_RECENT);
    S.unseen += 1;
    var a = S.appMap[n.pkg]; if (a) { a.count += 1; a.lastTs = n.ts; }
    if (S.stats) {
      S.stats.total = (S.stats.total || 0) + 1; S.stats.today = (S.stats.today || 0) + 1;
      var wk = S.stats.week || []; if (wk.length) wk[wk.length - 1].count += 1;
    }
    renderBadge();
    if (S.view === 'home') renderHome();
    else if (S.view === 'stats') renderStats();
    else if (S.view === 'history') {
      var h = S.hist, q = h.q.toLowerCase();
      if ((!h.pkg || h.pkg === n.pkg) && (!q || [n.title, n.text, n.appName].join(' ').toLowerCase().indexOf(q) >= 0)) {
        var list = $('#historyList'), today = startOfDay(n.ts);
        var first = list.querySelector('.day-group');
        if (!h.items.length) list.innerHTML = '';
        if (first && Number(first.getAttribute('data-day')) === today) first.insertAdjacentHTML('afterbegin', notifRow(n, true));
        else list.insertAdjacentHTML('afterbegin', '<div class="day-head">' + esc(dayLabel(n.ts)) + '</div><div class="group glass day-group" data-day="' + today + '">' + notifRow(n, true) + '</div>');
        h.items.unshift(n); h.offset += 1; if (h.lastDay === -1) h.lastDay = today;
        loadIcons(list);
      }
      raw('markAllSeen'); S.unseen = 0; renderBadge();
    } else S.dirtyHistory = true;
    if (S.view !== 'history') S.dirtyHistory = true;
  };
  window.onListenerState = function (on) { S.listener = !!on || !!raw('isListenerEnabled'); renderView(S.view); };
  window.onAppResume = function () { if (THEME === 'auto') applyTheme(); refreshAll(); };
  window.onPermissionResult = function (ok) { hud(t(ok ? 'toast.permOk' : 'toast.permNo'), ok ? 'check' : 'warn'); if (S.view === 'settings') renderSettings(); };
  setInterval(function () { if (S.view === 'home') renderHome(); }, 60000);

  // ================================================================== boot
  hydrate(document);
  applyTheme();
  applyLang();
  refreshAll();
  $$('#tabbar button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === 'home'); });
  setTimeout(movePill, 50);
  if (!S.listener) {
    setTimeout(function () {
      if (S.listener) return;
      alertBox(t('access.alertTitle'), t('access.alertText'), t('access.open'), function () { raw('openListenerSettings'); });
    }, 700);
  }

  // ==================================================================
  // Mock bridge (browser preview only — never used inside the APK)
  // ==================================================================
  function createMockBridge() {
    var now = Date.now();
    var apps = [
      ['org.telegram.messenger', 'Telegram'], ['com.instagram.android', 'Instagram'], ['com.whatsapp', 'WhatsApp'],
      ['com.google.android.gm', 'Gmail'], ['com.google.android.youtube', 'YouTube'], ['com.android.chrome', 'Chrome'],
      ['ir.divar', 'دیوار'], ['com.spotify.music', 'Spotify'], ['com.google.android.apps.maps', 'Maps'],
      ['com.android.vending', 'Play Store'], ['com.google.android.calendar', 'Calendar'], ['com.android.settings', 'Settings']
    ].map(function (a, i) { return { pkg: a[0], name: a[1], system: i > 8, enabled: i !== 7 && i !== 10, blocked: i === 7 }; });
    var samples = [['علی رضایی', 'سلام! امشب برنامه سر جاشه؟'], ['2 new messages', 'Project update and invoice attached'], ['sara_k', 'liked your photo'], ['ویدیوی جدید', 'کانالی که دنبال می‌کنید ویدیوی جدید گذاشت'], ['Download complete', 'report.pdf finished downloading'], ['یادآوری', 'جلسه‌ی تیم تا ۱۵ دقیقه‌ی دیگر']];
    var notes = [], id = 1;
    for (var i = 0; i < 60; i++) {
      var a = apps[(i * 7 + (i % 3)) % 9], s = samples[i % samples.length];
      notes.push({ id: id++, pkg: a.pkg, appName: a.name, title: s[0], text: s[1], ts: now - i * 41 * 60000 - (i % 5) * 900000, blocked: a.blocked, seen: i > 2 });
    }
    var settings = { ignoreOngoing: true, newAppsEnabled: true, dismissBlocked: true, retentionDays: 30 };
    function counts() { var m = {}; notes.forEach(function (n) { m[n.pkg] = (m[n.pkg] || 0) + 1; }); return m; }
    function last(p) { for (var k = 0; k < notes.length; k++) if (notes[k].pkg === p) return notes[k].ts; return 0; }
    return {
      getInstalledApps: function () {
        var c = counts();
        return JSON.stringify(apps.map(function (a) { return { pkg: a.pkg, name: a.name, system: a.system, enabled: a.enabled, blocked: a.blocked, count: c[a.pkg] || 0, lastTs: last(a.pkg) }; })
          .sort(function (x, y) { return (y.count - x.count) || (y.lastTs - x.lastTs); }));
      },
      getAppIcon: function () { return ''; },
      setAppEnabled: function (p, on) { apps.forEach(function (a) { if (a.pkg === p) a.enabled = on; }); return true; },
      setAppBlocked: function (p, on) { apps.forEach(function (a) { if (a.pkg === p) a.blocked = on; }); return true; },
      setAppsEnabled: function (j, on) { var l = JSON.parse(j); apps.forEach(function (a) { if (l.indexOf(a.pkg) >= 0) a.enabled = on; }); return true; },
      getNotifications: function (limit, offset, pkg, q) {
        q = (q || '').toLowerCase();
        return JSON.stringify(notes.filter(function (n) { return (!pkg || n.pkg === pkg) && (!q || (n.title + ' ' + n.text + ' ' + n.appName).toLowerCase().indexOf(q) >= 0); }).slice(offset, offset + limit));
      },
      getStats: function () {
        var t0 = startOfDay(Date.now()), week = [];
        for (var k = 6; k >= 0; k--) { var f = t0 - k * 86400000; week.push({ day: f, count: notes.filter(function (n) { return n.ts >= f && n.ts < f + 86400000; }).length + (6 - k) * 3 + 2 }); }
        var hours = []; for (var h = 0; h < 24; h++) hours.push(Math.round(4 + 10 * Math.abs(Math.sin(h / 3.2))));
        var c = counts(), top = Object.keys(c).map(function (p) { return { pkg: p, name: p, count: c[p] }; }).sort(function (x, y) { return y.count - x.count; }).slice(0, 5);
        return JSON.stringify({ total: notes.length, today: notes.filter(function (n) { return n.ts >= t0; }).length, blocked: notes.filter(function (n) { return n.blocked; }).length, week: week, hours: hours, top: top });
      },
      getUnseenCount: function () { return notes.filter(function (n) { return !n.seen; }).length; },
      markAllSeen: function () { notes.forEach(function (n) { n.seen = true; }); },
      clearHistory: function () { notes = []; },
      clearAppHistory: function (p) { var b = notes.length; notes = notes.filter(function (n) { return n.pkg !== p; }); return b - notes.length; },
      deleteNotification: function (x) { var b = notes.length; notes = notes.filter(function (n) { return String(n.id) !== String(x); }); return b !== notes.length; },
      isListenerEnabled: function () { return true; },
      openListenerSettings: function () { }, openAppNotificationSettings: function () { }, openApp: function () { return false; },
      hasPostPermission: function () { return true; }, requestPostPermission: function () { },
      sendTestNotificationText: function (title, text) {
        var n = { id: id++, pkg: 'org.telegram.messenger', appName: 'Telegram', title: title, text: text, ts: Date.now(), blocked: false, seen: false };
        notes.unshift(n); setTimeout(function () { window.onNewNotification(n); }, 300); return true;
      },
      getSettings: function () { return JSON.stringify(settings); },
      setSetting: function (k, v) { settings[k] = v === 'true' ? true : v === 'false' ? false : Number(v); return true; },
      getAppInfo: function () { return JSON.stringify({ versionName: '1.1.0', versionCode: 2, package: 'com.mynotification.app', developer: 'PROTHOTECH' }); },
      shareHistory: function () { }, haptic: function () { }, setSystemBars: function () { }, isSystemDark: function () { return false; }
    };
  }
})();
