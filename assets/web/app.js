/* =====================================================================
   Notification Manager — front-end logic
   Talks to Java through window.Android (AppBridge.java).
   When opened in a normal browser a mock bridge with demo data is used.
   Developer: PROTHOTECH
   ===================================================================== */
(function () {
  'use strict';

  // ------------------------------------------------------------------ icons
  var I = {
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.25.4-1.51 1z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6v-5a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 6h17"/><path d="M9 6V4.2c0-.66.54-1.2 1.2-1.2h3.6c.66 0 1.2.54 1.2 1.2V6"/><path d="M5.5 6l1 13.2A2 2 0 0 0 8.5 21h7a2 2 0 0 0 2-1.8L18.5 6"/><path d="M10 10.5v6.5M14 10.5v6.5"/></svg>',
    history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3 4v4.5h4.5"/><path d="M12 7.5V12l3.2 2"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h9M17 6h4M3 12h3M11 12h10M3 18h11M19 18h2"/><circle cx="14.5" cy="6" r="2.3"/><circle cx="8.5" cy="12" r="2.3"/><circle cx="16.5" cy="18" r="2.3"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.8 4.5 5.6v5.8c0 4.7 3.2 8.5 7.5 9.8 4.3-1.3 7.5-5.1 7.5-9.8V5.6z"/><path d="m8.6 12 2.3 2.3 4.6-4.8"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>',
    chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 9 7 7 7-7"/></svg>',
    chevRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
    chevLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.8"/><path d="M12 7v5l3.2 2"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3.5 11 12 3.8l8.5 7.2V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/></svg>',
    stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="13" width="4" height="7.5" rx="1.2"/><rect x="10" y="8" width="4" height="12.5" rx="1.2"/><rect x="16.5" y="3.5" width="4" height="17" rx="1.2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m7.8 12.2 2.8 2.8 5.6-5.8"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.3v.2"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7.5 7.5 4.5-4.5 4.5 4.5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
    open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4.5"/><path d="m11.2 11.8 8.8-8.8M17 6l2.5 2.5M14.5 8.5 16.5 10.5"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M21 3 3 10.5l7 3 3 7z"/><path d="m10 13.5 4.5-4.5"/></svg>',
    db: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13"/><path d="M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
    trend: '<svg viewBox="0 0 100 80" fill="none"><defs><linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#0aa7c6" stop-opacity=".2"/><stop offset="1" stop-color="#5ff6ff"/></linearGradient></defs><path d="M2 62 L30 44 L46 50 L70 28 L90 10" stroke="url(#tg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 4px #19e6ff)"/><path d="M80 8 L93 7 L91 20" stroke="#5ff6ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 4px #19e6ff)"/></svg>'
  };

  function hydrateIcons(root) {
    var list = (root || document).querySelectorAll('i[data-ic]:empty');
    for (var i = 0; i < list.length; i++) {
      var k = list[i].getAttribute('data-ic');
      if (I[k]) list[i].innerHTML = I[k];
    }
  }
  function ic(name) { return '<i data-ic="' + name + '">' + (I[name] || '') + '</i>'; }

  // ------------------------------------------------------------------ helpers
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtNum(n) { n = Number(n) || 0; return n >= 10000 ? (n / 1000).toFixed(1) + 'k' : String(n); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function timeAgo(ts) {
    var d = (Date.now() - ts) / 1000;
    if (d < 45) return 'just now';
    if (d < 3600) return Math.max(1, Math.round(d / 60)) + ' min ago';
    if (d < 86400) return Math.round(d / 3600) + ' h ago';
    if (d < 86400 * 7) return Math.round(d / 86400) + ' d ago';
    var t = new Date(ts); return t.getDate() + ' ' + MONTHS[t.getMonth()];
  }
  function clock(ts) { var t = new Date(ts); return pad(t.getHours()) + ':' + pad(t.getMinutes()); }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function dayKey(ts) { var t = new Date(ts); return t.getFullYear() + '-' + t.getMonth() + '-' + t.getDate(); }
  function dayLabel(ts) {
    var now = new Date(); var t = new Date(ts);
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    if (ts >= today) return 'Today';
    if (ts >= today - 86400000) return 'Yesterday';
    return DAYS[t.getDay()] + ', ' + t.getDate() + ' ' + MONTHS[t.getMonth()] + (t.getFullYear() !== now.getFullYear() ? ' ' + t.getFullYear() : '');
  }
  function debounce(fn, ms) { var h; return function () { var a = arguments; clearTimeout(h); h = setTimeout(function () { fn.apply(null, a); }, ms); }; }

  var AVATAR_COLORS = [['#19e6ff', '#0a5f8a'], ['#ff2d55', '#7a0020'], ['#a347ff', '#3b0f7a'], ['#ffb03a', '#8a4b00'], ['#2bea72', '#0b6b33'], ['#3d7bff', '#10307a'], ['#ff3fd8', '#7a0f66']];
  function letterAvatar(name, pkg) {
    var s = String(pkg || name || '?'); var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    var c = AVATAR_COLORS[h % AVATAR_COLORS.length];
    var ch = (String(name || '?').trim().charAt(0) || '?').toUpperCase();
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#g)"/><text x="32" y="43" font-family="Roboto,Arial,sans-serif" font-size="30" font-weight="700" fill="#fff" text-anchor="middle">' + esc(ch) + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // ------------------------------------------------------------------ bridge
  var NATIVE = typeof window.Android !== 'undefined' && window.Android !== null;
  var B = NATIVE ? window.Android : createMockBridge();

  function raw(fn) {
    try {
      if (typeof B[fn] !== 'function') return null;
      return B[fn].apply(B, Array.prototype.slice.call(arguments, 1));
    } catch (e) { console.error('bridge ' + fn, e); return null; }
  }
  function json(fn) {
    var r = raw.apply(null, arguments);
    if (r == null || r === '') return null;
    if (typeof r !== 'string') return r;
    try { return JSON.parse(r); } catch (e) { console.error('json ' + fn, e); return null; }
  }

  // ------------------------------------------------------------------ state
  var S = {
    view: 'home',
    prevView: 'home',
    apps: [],
    appMap: {},
    stats: null,
    latest: null,
    listener: false,
    settings: {},
    info: {},
    unseen: 0,
    homeCollapsed: false,
    appsFilter: 'all',
    appsQuery: '',
    blockedQuery: '',
    sheetPkg: null,
    hist: { items: [], offset: 0, done: false, loading: false, pkg: '', q: '', lastDay: '' },
    dirty: { stats: true, history: true }
  };
  var PAGE = 40;
  var HOME_ROWS = 6;

  // ------------------------------------------------------------------ icon loading
  var iconCache = {};
  var iconQueue = [];
  var iconBusy = false;

  function iconSrc(pkg, name) { return iconCache[pkg] || letterAvatar(name, pkg); }
  function imgTag(pkg, name, cls) {
    return '<img class="' + (cls || 'app-ic') + '" data-pkg="' + esc(pkg) + '" data-name="' + esc(name) + '" src="' + iconSrc(pkg, name) + '" alt="">';
  }
  function loadIcons(root) {
    $$('img[data-pkg]', root).forEach(function (img) {
      var p = img.getAttribute('data-pkg');
      if (iconCache[p]) { img.src = iconCache[p]; return; }
      if (iconCache[p] === '') return;
      if (iconQueue.indexOf(p) < 0) iconQueue.push(p);
    });
    pumpIcons();
  }
  function pumpIcons() {
    if (iconBusy || !iconQueue.length) return;
    iconBusy = true;
    setTimeout(function () {
      var batch = iconQueue.splice(0, 4);
      batch.forEach(function (p) {
        var url = raw('getAppIcon', p) || '';
        iconCache[p] = url;
        if (url) $$('img[data-pkg="' + cssEsc(p) + '"]').forEach(function (img) { img.src = url; });
      });
      iconBusy = false;
      pumpIcons();
    }, 16);
  }
  function cssEsc(s) { return String(s).replace(/["\\]/g, '\\$&'); }

  // ------------------------------------------------------------------ data refresh
  function loadApps() {
    S.apps = json('getInstalledApps') || [];
    S.appMap = {};
    S.apps.forEach(function (a) { S.appMap[a.pkg] = a; });
  }
  function loadCore() {
    S.listener = !!raw('isListenerEnabled');
    S.settings = json('getSettings') || {};
    S.latest = json('getLatest');
    S.stats = json('getStats') || { total: 0, today: 0, blocked: 0, week: [], hours: [], top: [] };
    S.unseen = Number(raw('getUnseenCount')) || 0;
  }
  function refreshAll() {
    loadCore();
    loadApps();
    renderHome();
    S.dirty.stats = true;
    S.dirty.history = true;
    if (S.view === 'stats') renderStats();
    if (S.view === 'history') resetHistory();
    if (S.view === 'apps') renderApps();
    if (S.view === 'blocked') renderBlocked();
    if (S.view === 'settings') renderSettings();
  }

  // ------------------------------------------------------------------ navigation
  var TABS = ['stats', 'history', 'home', 'apps'];
  function go(view) {
    if (!document.getElementById('view-' + view)) return;
    closeSheet();
    if (view !== S.view) S.prevView = S.view;
    S.view = view;
    $$('.view').forEach(function (v) { v.classList.toggle('active', v.getAttribute('data-view') === view); });
    var tab = TABS.indexOf(view) >= 0 ? view : null;
    $$('#nav button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === tab); });
    if (view === 'home') renderHome();
    if (view === 'stats') renderStats();
    if (view === 'history') {
      if (S.dirty.history || !S.hist.items.length) resetHistory();
      if (S.unseen) { raw('markAllSeen'); S.unseen = 0; renderBadge(); }
    }
    if (view === 'apps') renderApps();
    if (view === 'blocked') renderBlocked();
    if (view === 'settings') renderSettings();
    haptic();
  }
  function haptic() { raw('haptic'); }

  // Called by Java on back press. Return true if handled.
  window.handleBack = function () {
    if ($('#dialog').classList.contains('on')) { closeDialog(); return true; }
    if ($('#sheet').classList.contains('on')) { closeSheet(); return true; }
    if (S.view === 'settings' || S.view === 'blocked') { go(S.prevView && S.prevView !== S.view ? S.prevView : 'home'); return true; }
    if (S.view !== 'home') { go('home'); return true; }
    return false;
  };

  // ------------------------------------------------------------------ HOME
  function renderHome() {
    renderBadge();
    renderDashboard();
    renderHomeApps();
    renderRecent();
  }

  function renderBadge() {
    var b = $('#badge');
    b.textContent = S.unseen > 99 ? '99+' : S.unseen;
    b.classList.toggle('hidden', !S.unseen);
  }

  function enabledPct() {
    if (!S.apps.length) return 0;
    var on = S.apps.filter(function (a) { return a.enabled; }).length;
    return Math.round(on * 100 / S.apps.length);
  }

  function renderDashboard() {
    var pct = enabledPct();
    $('#pct').textContent = pct + '%';
    var C = 2 * Math.PI * 50;
    $('#ringFg').style.strokeDashoffset = String(C * (1 - pct / 100));
    var st = $('#dashState');
    if (S.listener) {
      st.className = 'dash-state';
      st.innerHTML = '<span>Enabled</span>' + ic('check');
    } else {
      st.className = 'dash-state off';
      st.innerHTML = '<span>Access required<small>Tap to grant notification access</small></span>';
    }
    // mini bar chart: last 5 days
    var wk = (S.stats && S.stats.week) || [];
    var vals = wk.slice(-5).map(function (d) { return d.count; });
    while (vals.length < 5) vals.unshift(0);
    var max = Math.max.apply(null, vals.concat([1]));
    var bars = vals.map(function (v, i) {
      var h = v ? Math.max(12, Math.round(v * 100 / max)) : 10 + i * 8;
      return '<span class="bar" style="height:' + Math.min(h, 100) + '%"></span>';
    }).join('');
    $('#miniChart').innerHTML = '<div class="bars">' + bars + '</div>' + I.trend;
  }

  function appRow(a, mode) {
    // mode: 'log' (cyan switch -> logging filter) | 'block' (red switch -> blocked)
    var isBlock = mode === 'block';
    var checked = isBlock ? a.blocked : a.enabled;
    var status;
    if (isBlock) status = a.blocked ? '<span class="app-status blocked">Blocked</span>' : '<span class="app-status off">Allowed</span>';
    else if (a.blocked) status = '<span class="app-status blocked">Blocked' + (a.count ? ' <span class="cnt">· ' + fmtNum(a.count) + '</span>' : '') + '</span>';
    else status = '<span class="app-status' + (a.enabled ? '' : ' off') + '">' + (a.enabled ? 'Enabled' : 'Disabled') + (a.count ? ' <span class="cnt">· ' + fmtNum(a.count) + '</span>' : '') + '</span>';
    return '<div class="app-row" data-pkg="' + esc(a.pkg) + '">' +
      '<button class="row-chev" data-open="' + esc(a.pkg) + '" aria-label="Details">' + ic('chevRight') + '</button>' +
      '<label class="sw' + (isBlock ? ' red' : '') + '"><input type="checkbox" data-' + (isBlock ? 'block' : 'toggle') + '="' + esc(a.pkg) + '"' + (checked ? ' checked' : '') + '><span class="track"><span class="knob"></span></span></label>' +
      '<span class="row-space"></span>' +
      '<div class="app-meta"><span class="app-name">' + esc(a.name) + '</span>' + status + '</div>' +
      imgTag(a.pkg, a.name) +
      '</div>';
  }

  function renderHomeApps() {
    $('#homeAppsCount').textContent = '(' + S.apps.length + ' Apps)';
    var box = $('#homeApps');
    var list = S.apps.slice(0, HOME_ROWS);
    if (!list.length) {
      box.innerHTML = '<div class="empty">' + ic('layers') + '<b>No apps found</b>Installed apps will appear here.</div>';
    } else {
      box.innerHTML = list.map(function (a) { return appRow(a, 'log'); }).join('') +
        (S.apps.length > HOME_ROWS ? '<button class="ghost-btn" data-go="apps" style="width:100%">Show all ' + S.apps.length + ' apps ' + ic('chevRight') + '</button>' : '');
    }
    box.classList.toggle('collapsed', S.homeCollapsed);
    $('#homeCollapse').classList.toggle('collapsed', S.homeCollapsed);
    loadIcons(box);
  }

  function renderRecent(flash) {
    var box = $('#recentBody');
    var n = S.latest;
    if (!n) {
      box.innerHTML = '<div class="recent-item"><span class="recent-text"><b>No notifications yet</b><span>' +
        (S.listener ? 'New notifications will show up here' : 'Grant notification access to start logging') + '</span></span></div>';
      return;
    }
    var line = n.title && n.text ? n.title + ' • ' + n.text : (n.title || n.text);
    box.innerHTML = '<button class="recent-item' + (flash ? ' flash' : '') + '" data-recent="1">' + imgTag(n.pkg, n.appName) +
      '<span class="recent-text"><b>' + esc(n.appName || n.pkg) + '</b><span>' + esc(line) + ' • ' + esc(timeAgo(n.ts)) + '</span></span>' + ic('chevRight') + '</button>';
    loadIcons(box);
  }

  // ------------------------------------------------------------------ STATS
  function renderStats() {
    S.stats = json('getStats') || S.stats || {};
    var st = S.stats;
    var enabled = S.apps.filter(function (a) { return a.enabled; }).length;
    var blockedApps = S.apps.filter(function (a) { return a.blocked; }).length;
    $('#statTiles').innerHTML = [
      ['Total logged', fmtNum(st.total), '#19e6ff', 'rgba(25,230,255,.3)'],
      ['Today', fmtNum(st.today), '#ff2d55', 'rgba(255,45,85,.35)'],
      ['Apps logged', enabled + '/' + S.apps.length, '#a347ff', 'rgba(163,71,255,.35)'],
      ['Blocked apps', blockedApps + ' · ' + fmtNum(st.blocked) + ' hidden', '#ffb03a', 'rgba(255,176,58,.3)']
    ].map(function (t) {
      return '<div class="tile" style="--c:' + t[2] + ';--g:' + t[3] + '"><small>' + t[0] + '</small><strong' + (t[1].length > 8 ? ' style="font-size:18px"' : '') + '>' + esc(t[1]) + '</strong></div>';
    }).join('');

    var wk = st.week || [];
    var max = Math.max.apply(null, wk.map(function (d) { return d.count; }).concat([1]));
    $('#weekChart').innerHTML = wk.map(function (d, i) {
      var h = Math.round(d.count * 100 / max);
      return '<div class="wk' + (i === wk.length - 1 ? ' today' : '') + '"><span class="v">' + fmtNum(d.count) + '</span><span class="b" style="height:' + Math.max(h, 3) + '%"></span><span class="d">' + DAYS[new Date(d.day).getDay()] + '</span></div>';
    }).join('') || '<div class="empty">No data</div>';

    var hrs = st.hours || [];
    var hmax = Math.max.apply(null, hrs.concat([1]));
    $('#hourChart').innerHTML = hrs.map(function (v, i) {
      return '<span title="' + pad(i) + ':00 — ' + v + '" style="height:' + Math.max(3, Math.round(v * 100 / hmax)) + '%"></span>';
    }).join('');

    var top = st.top || [];
    var tmax = top.length ? top[0].count : 1;
    $('#topApps').innerHTML = top.length ? top.map(function (t) {
      var name = (S.appMap[t.pkg] && S.appMap[t.pkg].name) || t.name || t.pkg;
      return '<div class="top-row" data-open="' + esc(t.pkg) + '">' + imgTag(t.pkg, name) +
        '<div class="tr-body"><div class="tr-line"><span>' + esc(name) + '</span><span>' + fmtNum(t.count) + '</span></div>' +
        '<div class="tr-bar"><b style="width:' + Math.max(4, Math.round(t.count * 100 / tmax)) + '%"></b></div></div></div>';
    }).join('') : '<div class="empty">' + ic('stats') + '<b>Nothing yet</b>Statistics appear after notifications are logged.</div>';
    loadIcons($('#view-stats'));
    S.dirty.stats = false;
  }

  // ------------------------------------------------------------------ HISTORY
  function resetHistory() {
    S.hist.items = [];
    S.hist.offset = 0;
    S.hist.done = false;
    S.hist.lastDay = '';
    $('#historyList').innerHTML = '';
    renderChips();
    loadMoreHistory();
    S.dirty.history = false;
  }

  function renderChips() {
    var withData = S.apps.filter(function (a) { return a.count > 0; });
    var html = '<button class="chip all' + (S.hist.pkg ? '' : ' on') + '" data-chip="">All</button>';
    // make sure a selected app that has no row anymore still shows
    if (S.hist.pkg && !withData.some(function (a) { return a.pkg === S.hist.pkg; })) {
      var sel = S.appMap[S.hist.pkg] || { pkg: S.hist.pkg, name: S.hist.pkg, count: 0 };
      withData.unshift(sel);
    }
    html += withData.map(function (a) {
      return '<button class="chip' + (S.hist.pkg === a.pkg ? ' on' : '') + '" data-chip="' + esc(a.pkg) + '">' + imgTag(a.pkg, a.name, '') + esc(a.name) + ' <small>' + fmtNum(a.count) + '</small></button>';
    }).join('');
    $('#historyChips').innerHTML = html;
    loadIcons($('#historyChips'));
    var name = S.hist.pkg ? ((S.appMap[S.hist.pkg] && S.appMap[S.hist.pkg].name) || S.hist.pkg) : '';
    $('#historySub').textContent = name ? 'Notifications from ' + name : 'All logged notifications · ' + fmtNum((S.stats && S.stats.total) || 0);
  }

  function notifItem(n, isNew) {
    var name = n.appName || (S.appMap[n.pkg] && S.appMap[n.pkg].name) || n.pkg;
    return '<div class="n-item' + (isNew ? ' new' : '') + '" data-id="' + n.id + '">' + imgTag(n.pkg, name) +
      '<div class="n-body"><div class="n-top"><b>' + esc(name) + '</b>' + (n.blocked ? '<span class="tag">blocked</span>' : '') + '<time>' + clock(n.ts) + '</time></div>' +
      (n.title ? '<div class="n-title">' + esc(n.title) + '</div>' : '') +
      (n.text ? '<div class="n-text">' + esc(n.text) + '</div>' : '') +
      '</div><button class="n-del" data-del="' + n.id + '" aria-label="Delete">' + ic('x') + '</button></div>';
  }

  function loadMoreHistory() {
    var h = S.hist;
    if (h.loading || h.done) return;
    h.loading = true;
    var rows = json('getNotifications', PAGE, h.offset, h.pkg, h.q) || [];
    h.offset += rows.length;
    if (rows.length < PAGE) h.done = true;
    var html = '';
    rows.forEach(function (n) {
      var k = dayKey(n.ts);
      if (k !== h.lastDay) { html += '<div class="day-head">' + esc(dayLabel(n.ts)) + '</div>'; h.lastDay = k; }
      html += notifItem(n, false);
      h.items.push(n);
    });
    var list = $('#historyList');
    list.insertAdjacentHTML('beforeend', html);
    if (!h.items.length) {
      list.innerHTML = '<div class="empty">' + ic('history') + '<b>' + (h.q ? 'No results' : 'History is empty') + '</b>' +
        (h.q ? 'Try a different search.' : (S.listener ? 'Incoming notifications will be logged here.' : 'Grant notification access so the app can log notifications.')) +
        (!S.listener ? '<br><button class="primary-btn" data-action="grant">' + ic('key') + 'Grant access</button>' : '') + '</div>';
    }
    $('#historyMore').textContent = h.done ? (h.items.length ? '— end of history —' : '') : 'Loading…';
    loadIcons(list);
    h.loading = false;
  }

  // ------------------------------------------------------------------ APPS
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
    $('#appsSub').textContent = on + ' of ' + S.apps.length + ' apps are logged';
    $$('#appsSeg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-f') === S.appsFilter); });
    var box = $('#appsList');
    box.innerHTML = list.length ? list.map(function (a) { return appRow(a, 'log'); }).join('') :
      '<div class="empty">' + ic('search') + '<b>No apps match</b>Change the search or filter.</div>';
    loadIcons(box);
  }

  // ------------------------------------------------------------------ BLOCKED
  function renderBlocked() {
    var blocked = S.apps.filter(function (a) { return a.blocked; });
    $('#blockedInfo').innerHTML = '<strong>' + blocked.length + ' blocked</strong>' +
      'Blocked apps can still be logged (if their switch is on in Apps) but their notifications are removed from your status bar the moment they arrive.' +
      (S.listener ? '' : '<br><br><b style="color:#ff6d88">Notification access is off — blocking will not work until you grant it.</b>');
    var q = S.blockedQuery.toLowerCase();
    var list = S.apps.filter(function (a) { return !q || a.name.toLowerCase().indexOf(q) >= 0 || a.pkg.toLowerCase().indexOf(q) >= 0; });
    list.sort(function (a, b) { return (b.blocked ? 1 : 0) - (a.blocked ? 1 : 0); });
    var box = $('#blockedList');
    box.innerHTML = list.map(function (a) { return appRow(a, 'block'); }).join('') ||
      '<div class="empty">' + ic('shield') + '<b>No apps</b></div>';
    loadIcons(box);
  }

  // ------------------------------------------------------------------ SETTINGS
  function renderSettings() {
    S.listener = !!raw('isListenerEnabled');
    S.settings = json('getSettings') || S.settings;
    S.info = json('getAppInfo') || S.info || {};
    var post = raw('hasPostPermission') !== false;
    var st = S.settings;
    var ret = Number(st.retentionDays);
    function opt(v, l) { return '<option value="' + v + '"' + (ret === v ? ' selected' : '') + '>' + l + '</option>'; }
    function sw(key, on) { return '<label class="sw small"><input type="checkbox" data-setting="' + key + '"' + (on ? ' checked' : '') + '><span class="track"><span class="knob"></span></span></label>'; }

    $('#settingsBody').innerHTML =
      '<div class="set-group"><h4>Permissions</h4><div class="set-card">' +
        '<div class="set-row tap" data-action="grant"><span class="s-ic' + (S.listener ? '' : ' red') + '">' + ic('key') + '</span><div class="s-body"><b>Notification access</b><small class="' + (S.listener ? 'ok' : 'bad') + '">' + (S.listener ? 'Granted — notifications are being logged' : 'Not granted — tap to open system settings') + '</small></div>' + ic('chevRight') + '</div>' +
        '<div class="set-row tap" data-action="post"><span class="s-ic gold">' + ic('bell') + '</span><div class="s-body"><b>Post notifications</b><small class="' + (post ? 'ok' : 'bad') + '">' + (post ? 'Allowed' : 'Needed for the test notification (Android 13+)') + '</small></div>' + ic('chevRight') + '</div>' +
        '<div class="set-row tap" data-action="test"><span class="s-ic purple">' + ic('send') + '</span><div class="s-body"><b>Send test notification</b><small>Check that logging works end-to-end</small></div>' + ic('chevRight') + '</div>' +
      '</div></div>' +
      '<div class="set-group"><h4>Logging</h4><div class="set-card">' +
        '<div class="set-row"><span class="s-ic">' + ic('layers') + '</span><div class="s-body"><b>Ignore persistent notifications</b><small>Skip ongoing items such as music players, downloads and VPNs</small></div>' + sw('ignoreOngoing', st.ignoreOngoing !== false) + '</div>' +
        '<div class="set-row"><span class="s-ic">' + ic('plus') + '</span><div class="s-body"><b>Log new apps automatically</b><small>Default switch state for apps you install later</small></div>' + sw('newAppsEnabled', st.newAppsEnabled !== false) + '</div>' +
        '<div class="set-row"><span class="s-ic red">' + ic('shield') + '</span><div class="s-body"><b>Dismiss blocked apps</b><small>Remove notifications of blocked apps from the status bar</small></div>' + sw('dismissBlocked', st.dismissBlocked !== false) + '</div>' +
      '</div></div>' +
      '<div class="set-group"><h4>Storage</h4><div class="set-card">' +
        '<div class="set-row"><span class="s-ic gold">' + ic('db') + '</span><div class="s-body"><b>Keep history for</b><small>Older entries are deleted automatically</small></div><select id="retention">' + opt(7, '7 days') + opt(30, '30 days') + opt(90, '90 days') + opt(365, '1 year') + opt(0, 'Forever') + '</select></div>' +
        '<div class="set-row tap" data-action="share"><span class="s-ic">' + ic('share') + '</span><div class="s-body"><b>Export history</b><small>Share the last 2000 entries as CSV text</small></div>' + ic('chevRight') + '</div>' +
        '<div class="set-row tap" data-action="clear"><span class="s-ic red">' + ic('trash') + '</span><div class="s-body"><b>Clear all history</b><small>' + fmtNum((S.stats && S.stats.total) || 0) + ' notifications stored</small></div>' + ic('chevRight') + '</div>' +
      '</div></div>' +
      '<div class="about"><div class="logo">' + ic('bell') + '</div><b>Notification Manager</b><br>Version ' + esc(S.info.versionName || '1.0.0') + ' (' + esc(S.info.versionCode || 1) + ')<br>' +
        esc(S.info.package || 'com.mynotification.app') + '<br>Developed by <span class="dev">' + esc(S.info.developer || 'PROTHOTECH') + '</span></div>';
  }

  // ------------------------------------------------------------------ APP SHEET
  function openSheet(pkg) {
    var a = S.appMap[pkg];
    if (!a) return;
    S.sheetPkg = pkg;
    var sheet = $('#sheet');
    sheet.innerHTML = '<div class="grab"></div>' +
      '<div class="sh-head">' + imgTag(a.pkg, a.name) + '<div><b>' + esc(a.name) + '</b><small>' + esc(a.pkg) + '</small></div></div>' +
      '<div class="sh-stats"><div><small>Logged</small><strong>' + fmtNum(a.count) + '</strong></div><div><small>Last notification</small><strong>' + (a.lastTs ? esc(timeAgo(a.lastTs)) : '—') + '</strong></div></div>' +
      '<div class="set-card">' +
        '<div class="set-row"><span class="s-ic">' + ic('db') + '</span><div class="s-body"><b>Log notifications</b><small>Store this app\'s notifications in history</small></div><label class="sw small"><input type="checkbox" data-toggle="' + esc(a.pkg) + '"' + (a.enabled ? ' checked' : '') + '><span class="track"><span class="knob"></span></span></label></div>' +
        '<div class="set-row"><span class="s-ic red">' + ic('shield') + '</span><div class="s-body"><b>Block app</b><small>Dismiss its notifications automatically</small></div><label class="sw small red"><input type="checkbox" data-block="' + esc(a.pkg) + '"' + (a.blocked ? ' checked' : '') + '><span class="track"><span class="knob"></span></span></label></div>' +
      '</div>' +
      '<div class="sh-btns">' +
        '<button class="primary-btn wide" data-sheet="history">' + ic('history') + 'View history</button>' +
        '<button class="ghost-btn" data-sheet="settings">' + ic('sliders') + 'System settings</button>' +
        '<button class="ghost-btn" data-sheet="open">' + ic('open') + 'Open app</button>' +
        '<button class="danger-btn wide" data-sheet="clear">' + ic('trash') + 'Clear this app\'s history</button>' +
      '</div>';
    loadIcons(sheet);
    $('#scrim').classList.add('on');
    sheet.classList.add('on');
    sheet.scrollTop = 0;
  }
  function closeSheet() {
    $('#sheet').classList.remove('on');
    if (!$('#dialog').classList.contains('on')) $('#scrim').classList.remove('on');
    S.sheetPkg = null;
  }

  // ------------------------------------------------------------------ dialog / toast
  var dlgCb = null;
  function confirmDlg(title, text, okLabel, cb) {
    $('#dlgTitle').textContent = title;
    $('#dlgText').textContent = text;
    $('#dlgOk').textContent = okLabel || 'OK';
    dlgCb = cb;
    $('#scrim').classList.add('on');
    $('#dialog').classList.add('on');
  }
  function closeDialog() {
    $('#dialog').classList.remove('on');
    if (!$('#sheet').classList.contains('on')) $('#scrim').classList.remove('on');
    dlgCb = null;
  }
  var toastT;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('on'); }, 2200);
  }

  // ------------------------------------------------------------------ mutations
  function setEnabled(pkg, on) {
    raw('setAppEnabled', pkg, !!on);
    var a = S.appMap[pkg]; if (a) a.enabled = !!on;
    syncAppViews(pkg);
    toast((a ? a.name : pkg) + (on ? ' logging enabled' : ' logging disabled'));
  }
  function setBlocked(pkg, on) {
    raw('setAppBlocked', pkg, !!on);
    var a = S.appMap[pkg]; if (a) a.blocked = !!on;
    syncAppViews(pkg);
    toast((a ? a.name : pkg) + (on ? ' blocked' : ' unblocked'));
  }
  function syncAppViews(pkg) {
    // re-render only what is visible; keep sheet switches consistent
    renderDashboard();
    var a = S.appMap[pkg];
    if (a) {
      $$('.app-row[data-pkg="' + cssEsc(pkg) + '"]').forEach(function (row) {
        var mode = row.querySelector('input[data-block]') ? 'block' : 'log';
        var tmp = document.createElement('div');
        tmp.innerHTML = appRow(a, mode);
        var fresh = tmp.firstChild;
        fresh.style.animation = 'none';
        row.parentNode.replaceChild(fresh, row);
      });
      $$('#sheet input[data-toggle]').forEach(function (i) { i.checked = a.enabled; });
      $$('#sheet input[data-block]').forEach(function (i) { i.checked = a.blocked; });
    }
    if (S.view === 'apps') $('#appsSub').textContent = S.apps.filter(function (x) { return x.enabled; }).length + ' of ' + S.apps.length + ' apps are logged';
    if (S.view === 'blocked') $('#blockedInfo strong').textContent = S.apps.filter(function (x) { return x.blocked; }).length + ' blocked';
  }
  function bulkEnable(on) {
    var list = filteredApps();
    if (!list.length) return;
    raw('setAppsEnabled', JSON.stringify(list.map(function (a) { return a.pkg; })), !!on);
    list.forEach(function (a) { a.enabled = !!on; });
    renderApps();
    renderDashboard();
    toast(list.length + ' apps ' + (on ? 'enabled' : 'disabled'));
  }
  function clearHistory() {
    confirmDlg('Clear history?', 'All logged notifications will be permanently deleted from this device.', 'Clear', function () {
      raw('clearHistory');
      S.latest = null;
      S.unseen = 0;
      S.apps.forEach(function (a) { a.count = 0; a.lastTs = 0; });
      refreshAll();
      toast('History cleared');
    });
  }

  // ------------------------------------------------------------------ events
  document.addEventListener('click', function (e) {
    var t = e.target;
    var el;

    if ((el = t.closest('[data-go]'))) { go(el.getAttribute('data-go')); return; }
    if ((el = t.closest('[data-tab]'))) { go(el.getAttribute('data-tab')); return; }
    if ((el = t.closest('[data-back]'))) { window.handleBack(); return; }
    if ((el = t.closest('[data-open]'))) { openSheet(el.getAttribute('data-open')); return; }

    if ((el = t.closest('[data-chip]'))) {
      S.hist.pkg = el.getAttribute('data-chip');
      resetHistory();
      $('#view-history').scrollTop = 0;
      return;
    }
    if ((el = t.closest('[data-del]'))) {
      var id = el.getAttribute('data-del');
      if (raw('deleteNotification', String(id))) {
        var item = el.closest('.n-item');
        item.style.transition = 'opacity .2s, transform .2s';
        item.style.opacity = '0'; item.style.transform = 'translateX(30px)';
        setTimeout(function () { if (item.parentNode) item.parentNode.removeChild(item); }, 200);
        S.hist.items = S.hist.items.filter(function (n) { return String(n.id) !== String(id); });
        S.hist.offset = Math.max(0, S.hist.offset - 1);
        S.latest = json('getLatest');
        S.dirty.stats = true;
      }
      return;
    }
    if ((el = t.closest('.n-item'))) { el.classList.toggle('open'); return; }

    if ((el = t.closest('[data-recent]'))) {
      if (S.latest) { S.hist.pkg = ''; S.dirty.history = true; }
      go('history');
      return;
    }

    if ((el = t.closest('[data-sheet]'))) {
      var pkg = S.sheetPkg;
      var act = el.getAttribute('data-sheet');
      if (!pkg) return;
      if (act === 'history') { S.hist.pkg = pkg; S.dirty.history = true; go('history'); }
      else if (act === 'settings') raw('openAppNotificationSettings', pkg);
      else if (act === 'open') { if (!raw('openApp', pkg)) toast('This app cannot be opened'); }
      else if (act === 'clear') {
        var a = S.appMap[pkg];
        confirmDlg('Clear ' + (a ? a.name : pkg) + '?', 'Delete every logged notification from this app.', 'Delete', function () {
          var n = raw('clearAppHistory', pkg) || 0;
          if (a) { a.count = 0; a.lastTs = 0; }
          closeSheet();
          refreshAll();
          toast(n + ' notifications deleted');
        });
      }
      return;
    }

    if ((el = t.closest('[data-action]'))) {
      var action = el.getAttribute('data-action');
      if (action === 'clear') clearHistory();
      else if (action === 'share') { raw('shareHistory'); if (!NATIVE) toast('Export is available on the device'); }
      else if (action === 'grant') raw('openListenerSettings');
      else if (action === 'post') { raw('requestPostPermission'); }
      else if (action === 'test') {
        var ok = raw('sendTestNotification');
        toast(ok ? 'Test notification sent' : 'Allow notifications first');
      }
      else if (action === 'enableAll') bulkEnable(true);
      else if (action === 'disableAll') bulkEnable(false);
      return;
    }

    if (t.closest('#dashState') && !S.listener) { raw('openListenerSettings'); return; }
    if (t.closest('#homeCollapse')) {
      S.homeCollapsed = !S.homeCollapsed;
      $('#homeApps').classList.toggle('collapsed', S.homeCollapsed);
      $('#homeCollapse').classList.toggle('collapsed', S.homeCollapsed);
      return;
    }
    if (t.closest('#appsSeg button')) {
      S.appsFilter = t.closest('#appsSeg button').getAttribute('data-f');
      renderApps();
      return;
    }
    if (t.id === 'scrim') { if ($('#dialog').classList.contains('on')) closeDialog(); else closeSheet(); return; }
    if (t.id === 'dlgCancel') { closeDialog(); return; }
    if (t.id === 'dlgOk') { var cb = dlgCb; closeDialog(); if (cb) cb(); return; }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-toggle')) { setEnabled(t.getAttribute('data-toggle'), t.checked); haptic(); }
    else if (t.hasAttribute('data-block')) { setBlocked(t.getAttribute('data-block'), t.checked); haptic(); }
    else if (t.hasAttribute('data-setting')) {
      raw('setSetting', t.getAttribute('data-setting'), String(t.checked));
      S.settings[t.getAttribute('data-setting')] = t.checked;
      if (t.getAttribute('data-setting') === 'newAppsEnabled') { loadApps(); renderDashboard(); }
      toast('Saved');
    } else if (t.id === 'retention') {
      raw('setSetting', 'retentionDays', t.value);
      S.settings.retentionDays = Number(t.value);
      toast('Saved');
    }
  });

  $('#historySearch').addEventListener('input', debounce(function (e) {
    S.hist.q = e.target.value.trim();
    resetHistory();
  }, 250));
  $('#appsSearch').addEventListener('input', debounce(function (e) { S.appsQuery = e.target.value.trim(); renderApps(); }, 150));
  $('#blockedSearch').addEventListener('input', debounce(function (e) { S.blockedQuery = e.target.value.trim(); renderBlocked(); }, 150));

  $('#view-history').addEventListener('scroll', function () {
    var v = this;
    if (v.scrollTop + v.clientHeight > v.scrollHeight - 400) loadMoreHistory();
  });

  // ------------------------------------------------------------------ callbacks from Java
  window.onNewNotification = function (n) {
    if (!n) return;
    S.latest = n;
    S.unseen += 1;
    var a = S.appMap[n.pkg];
    if (a) { a.count += 1; a.lastTs = n.ts; }
    if (S.stats) { S.stats.total = (S.stats.total || 0) + 1; S.stats.today = (S.stats.today || 0) + 1; }
    S.dirty.stats = true;

    renderBadge();
    renderRecent(true);
    var bell = $('.bell-btn');
    bell.classList.remove('ring-anim'); void bell.offsetWidth; bell.classList.add('ring-anim');

    if (S.view === 'history') {
      var h = S.hist;
      var matchPkg = !h.pkg || h.pkg === n.pkg;
      var q = h.q.toLowerCase();
      var matchQ = !q || [n.title, n.text, n.appName].join(' ').toLowerCase().indexOf(q) >= 0;
      if (matchPkg && matchQ) {
        var list = $('#historyList');
        var first = list.querySelector('.day-head');
        var html = notifItem(n, true);
        if (!first || first.textContent !== 'Today') html = '<div class="day-head">Today</div>' + html;
        if (!h.items.length) list.innerHTML = '';
        if (first && first.textContent === 'Today') first.insertAdjacentHTML('afterend', html);
        else list.insertAdjacentHTML('afterbegin', html);
        h.items.unshift(n); h.offset += 1;
        if (!h.lastDay) h.lastDay = dayKey(n.ts);
        loadIcons(list);
      }
      raw('markAllSeen'); S.unseen = 0; renderBadge();
    } else {
      S.dirty.history = true;
    }
    if (S.view === 'home') { renderHomeApps(); renderDashboard(); }
    if (S.view === 'stats') renderStats();
  };

  window.onListenerState = function (on) {
    S.listener = !!on || !!raw('isListenerEnabled');
    renderDashboard();
    renderRecent();
    if (S.view === 'settings') renderSettings();
  };

  window.onAppResume = function () { refreshAll(); };
  window.onPermissionResult = function (ok) {
    toast(ok ? 'Notifications allowed' : 'Permission denied');
    if (S.view === 'settings') renderSettings();
  };

  // refresh relative times every minute
  setInterval(function () { if (S.view === 'home') renderRecent(); }, 60000);

  // ------------------------------------------------------------------ boot
  hydrateIcons();
  refreshAll();
  if (!S.listener) {
    setTimeout(function () {
      if (S.listener) return;
      confirmDlg('Allow notification access', 'To log and manage notifications from other apps, enable "Notification Manager" in the Notification access screen.', 'Open settings', function () {
        raw('openListenerSettings');
      });
      $('#dlgOk').className = 'primary-btn';
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
      ['com.spotify.music', 'Spotify'], ['com.twitter.android', 'X'], ['com.google.android.apps.maps', 'Maps'],
      ['com.android.vending', 'Play Store'], ['com.google.android.calendar', 'Calendar'], ['com.android.settings', 'Settings']
    ].map(function (a, i) { return { pkg: a[0], name: a[1], system: i > 8, enabled: i !== 7 && i !== 10, blocked: i === 7 }; });
    var samples = [['New message', 'Hey! Are we still on for tonight?'], ['2 new messages', 'Project update and invoice attached'], ['Liked your photo', 'sara_k and 12 others liked your post'], ['New video', 'A channel you follow uploaded a video'], ['Download complete', 'report.pdf finished downloading'], ['Reminder', 'Team meeting in 15 minutes']];
    var notes = []; var id = 1;
    for (var i = 0; i < 70; i++) {
      var a = apps[(i * 7 + (i % 3)) % 9]; var s = samples[i % samples.length];
      notes.push({ id: id++, pkg: a.pkg, appName: a.name, title: s[0], text: s[1], subText: '', category: '', ts: now - i * 37 * 60000 - (i % 5) * 900000, blocked: a.blocked, seen: i > 2 });
    }
    notes[0].pkg = 'com.google.android.gm'; notes[0].appName = 'Gmail'; notes[0].title = '2 new messages'; notes[0].text = 'Inbox'; notes[0].ts = now - 60000;
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
        var r = notes.filter(function (n) { return (!pkg || n.pkg === pkg) && (!q || (n.title + ' ' + n.text + ' ' + n.appName).toLowerCase().indexOf(q) >= 0); });
        return JSON.stringify(r.slice(offset, offset + limit));
      },
      getLatest: function () { return notes.length ? JSON.stringify(notes[0]) : 'null'; },
      getStats: function () {
        var d0 = new Date(); d0.setHours(0, 0, 0, 0); var t0 = d0.getTime();
        var week = []; for (var k = 6; k >= 0; k--) { var f = t0 - k * 86400000; week.push({ day: f, count: notes.filter(function (n) { return n.ts >= f && n.ts < f + 86400000; }).length + (6 - k) * 3 + 2 }); }
        var hours = []; for (var h = 0; h < 24; h++) hours.push(Math.round(4 + 10 * Math.abs(Math.sin(h / 3.2))));
        var c = counts(); var top = Object.keys(c).map(function (p) { var a = apps.filter(function (x) { return x.pkg === p; })[0]; return { pkg: p, name: a ? a.name : p, count: c[p] }; }).sort(function (x, y) { return y.count - x.count; }).slice(0, 6);
        return JSON.stringify({ total: notes.length, today: notes.filter(function (n) { return n.ts >= t0; }).length, blocked: notes.filter(function (n) { return n.blocked; }).length, week: week, hours: hours, top: top });
      },
      getUnseenCount: function () { return notes.filter(function (n) { return !n.seen; }).length; },
      markAllSeen: function () { notes.forEach(function (n) { n.seen = true; }); },
      clearHistory: function () { notes = []; },
      clearAppHistory: function (p) { var b = notes.length; notes = notes.filter(function (n) { return n.pkg !== p; }); return b - notes.length; },
      deleteNotification: function (i) { var b = notes.length; notes = notes.filter(function (n) { return String(n.id) !== String(i); }); return b !== notes.length; },
      isListenerEnabled: function () { return true; },
      openListenerSettings: function () {}, openAppNotificationSettings: function () {}, openApp: function () { return false; },
      hasPostPermission: function () { return true; }, requestPostPermission: function () {},
      sendTestNotification: function () {
        var n = { id: id++, pkg: 'org.telegram.messenger', appName: 'Telegram', title: 'Test', text: 'Mock notification ' + new Date().toLocaleTimeString(), ts: Date.now(), blocked: false, seen: false };
        notes.unshift(n); setTimeout(function () { window.onNewNotification(n); }, 300); return true;
      },
      getSettings: function () { return JSON.stringify(settings); },
      setSetting: function (k, v) { settings[k] = v === 'true' ? true : v === 'false' ? false : Number(v); return true; },
      getAppInfo: function () { return JSON.stringify({ versionName: '1.0.0', versionCode: 1, package: 'com.mynotification.app', developer: 'PROTHOTECH' }); },
      shareHistory: function () {}, toast: function () {}, haptic: function () {}
    };
  }
})();
