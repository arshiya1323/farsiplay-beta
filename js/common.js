/* PersiaPlay beta — shared code (header, footer, cart, theme, auth modal, animations) */
(function () {
  'use strict';
  var FP = (window.FP = window.FP || {});
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  FP.reduceMotion = reduceMotion;

  /* ---------- Helpers ---------- */
  var FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
  FP.fa = function (v) { return String(v).replace(/[0-9]/g, function (d) { return FA_DIGITS[d]; }); };
  FP.toEnDigits = function (s) {
    return String(s || '').replace(/[۰-۹]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); })
      .replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); });
  };
  FP.num = function (n) { // Persian digits with thousands separator
    var s = Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
    return FP.fa(s);
  };
  FP.toman = function (n) { return FP.num(n) + ' تومان'; };
  FP.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  FP.en = function (s) { return '<bdi class="en" dir="ltr">' + FP.esc(s) + '</bdi>'; };
  /* Escape text and wrap Latin runs (titles, file names, versions) in LTR bdi so RTL lines don't scramble.
     links: optional { "Name": "https://..." } — a run equal to a key becomes an external link. */
  FP.autoLtr = function (text, links) {
    links = links || {};
    var re = /[A-Za-z0-9][A-Za-z0-9_.+\-\/:]*(?:[ ]+[A-Za-z0-9][A-Za-z0-9_.+\-\/:]*)*/g, out = '', last = 0, m;
    text = String(text == null ? '' : text);
    while ((m = re.exec(text))) {
      var run = m[0], tail = (run.match(/[.:\-\/]+$/) || [''])[0];
      run = run.slice(0, run.length - tail.length);
      out += FP.esc(text.slice(last, m.index));
      var inner = FP.esc(run), href = Object.prototype.hasOwnProperty.call(links, run) ? links[run] : null;
      if (href && /^https:\/\//.test(href)) inner = '<a class="ext-link" href="' + FP.esc(href) + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>';
      out += '<bdi class="en" dir="ltr">' + inner + '</bdi>' + FP.esc(tail);
      last = m.index + m[0].length;
    }
    return out + FP.esc(text.slice(last));
  };
  FP.$ = function (sel, root) { return (root || document).querySelector(sel); };
  FP.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Data ---------- */
  var products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  products.forEach(function (p, i) {
    p.id = p.id != null ? String(p.id) : String(i + 1);
    p.price_toman = Number(p.price_toman) || 0;
    p.discount_percent = Number(p.discount_percent) || 0;
    p.rating = Number(p.rating) || 0;
    p.is_free = p.is_free === true;
    if (p.is_free) { p.price_toman = 0; p.discount_percent = 0; }
    p.screenshots = Array.isArray(p.screenshots) ? p.screenshots.filter(function (u) { return typeof u === 'string' && /^assets\//.test(u); }) : [];
    p.features_fa = Array.isArray(p.features_fa) ? p.features_fa : [];
    p.title_fa = String(p.title_fa || p.title_en || '').replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
    p._order = i;
  });
  FP.products = products;
  FP.isFree = function (p) { return !!(p && p.is_free); };
  FP.finalPrice = function (p) { return Math.round(p.price_toman * (100 - p.discount_percent) / 100 / 1000) * 1000; };
  FP.byId = function (id) { id = String(id); for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i]; return null; };
  FP.genreTags = function (p) { return String(p.genre_fa || '').split(/[،,]/).map(function (s) { return s.trim(); }).filter(Boolean); };
  FP.size = function (mb) { mb = Number(mb) || 0; return mb >= 1024 ? FP.fa((mb / 1024).toFixed(1).replace(/\.0$/, '')).replace('.', '٫') + ' گیگابایت' : mb < 100 ? FP.fa(mb.toFixed(1).replace(/\.0$/, '')).replace('.', '٫') + ' مگابایت' : FP.fa(Math.round(mb)) + ' مگابایت'; };
  FP.genres = function () {
    var m = {};
    products.forEach(function (p) { FP.genreTags(p).forEach(function (g) { m[g] = (m[g] || 0) + 1; }); });
    return Object.keys(m).map(function (k) { return { name: k, count: m[k] }; }).sort(function (a, b) { return b.count - a.count; });
  };
  FP.accent = function (p) { return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(p && p.accent || '') ? p.accent : '#7c5cff'; };

  /* ---------- Icons ---------- */
  var I = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    game: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
  };
  FP.icon = I;

  /* ---------- Cover ---------- */
  FP.cover = function (p, opts) {
    opts = opts || {};
    if (p.screenshots && p.screenshots.length && !opts.svg) {
      return '<div class="cover cover-img"><img src="' + FP.esc(p.screenshots[0]) + '" alt="' + FP.esc('تصویر فارسی‌شده‌ی ' + (p.title_fa || p.title_en)) + '" loading="' + (opts.eager ? 'eager' : 'lazy') + '" decoding="async" width="1280" height="720"></div>';
    }
    /* fallback for a product without screenshots: plain accent gradient + English title */
    return '<div class="cover cover-fallback" role="img" aria-label="' + FP.esc('کاور ' + (p.title_fa || p.title_en || '')) + '" style="--glow:' + FP.accent(p) + '">' + FP.en(p.title_en || p.title_fa) + '</div>';
  };

  /* ---------- Product card ---------- */
  FP.priceHTML = function (p) {
    if (FP.isFree(p)) return '<div class="price"><span class="old" style="visibility:hidden">-</span><span class="now free-price">رایگان</span></div>';
    var fin = FP.finalPrice(p);
    return '<div class="price">' + (p.discount_percent > 0 ? '<span class="old">' + FP.num(p.price_toman) + '</span>' : '<span class="old" style="visibility:hidden">-</span>') +
      '<span class="now">' + FP.num(fin) + '<small>تومان</small></span></div>';
  };
  FP.card = function (p, i) {
    var tags = '';
    if (p.discount_percent > 0) tags += '<span class="tag off">' + FP.fa(p.discount_percent) + '٪ تخفیف</span>';
    if (FP.isFree(p)) tags += '<span class="tag free">رایگان</span>';
    if (p.is_new) tags += '<span class="tag new">جدید</span>';
    if (p.is_bestseller) tags += '<span class="tag best">پرفروش</span>';
    var url = 'product.html?id=' + encodeURIComponent(p.id);
    return '<article class="card reveal" style="--glow:' + FP.accent(p) + ';--d:' + ((i || 0) % 4) * 0.07 + 's" data-tilt>' +
      '<a class="cover-wrap" href="' + url + '" tabindex="-1" aria-hidden="true"><div class="tags">' + tags + '</div>' + FP.cover(p) + '</a>' +
      '<div class="card-body"><h3 class="card-title"><a href="' + url + '">' + FP.esc(FP.fa(p.title_fa)) + '</a></h3>' +
      '<div class="card-sub">' + FP.en(p.title_en) + '</div>' +
      '<div class="card-sub"><span>' + FP.esc(FP.genreTags(p)[0] || '') + '</span>' + (p.rating ? '<span class="rating">' + I.star + FP.fa(p.rating.toFixed(1)) + '</span>' : '') + '</div>' +
      '<div class="card-foot">' + FP.priceHTML(p) +
      (FP.isFree(p)
        ? '<a class="add-btn free-btn" href="' + url + '" aria-label="' + FP.esc('دانلود رایگان ' + p.title_fa) + '" title="دانلود رایگان">' + I.download + '</a>'
        : '<button class="add-btn" type="button" data-add="' + FP.esc(p.id) + '" aria-label="' + FP.esc('افزودن ' + p.title_fa + ' به سبد خرید') + '">' + I.plus + '</button>') + '</div></div></article>';
  };
  FP.skeletons = function (n) {
    var s = '';
    for (var i = 0; i < n; i++) s += '<div class="card skeleton" aria-hidden="true"><div class="sk sk-cover"></div><div class="card-body"><div class="sk sk-line" style="width:70%"></div><div class="sk sk-line" style="width:45%"></div><div class="sk sk-line" style="width:55%;height:22px;margin-top:14px"></div></div></div>';
    return s;
  };
  /* render with a short skeleton shimmer first */
  FP.renderGrid = function (el, list, opts) {
    if (!el) return;
    opts = opts || {};
    var html = list.length ? list.map(FP.card).join('') : (opts.empty || '');
    var go = function () { el.innerHTML = html; el.setAttribute('aria-busy', 'false'); FP.enhance(el); };
    if (opts.instant) return go();
    el.setAttribute('aria-busy', 'true');
    el.innerHTML = FP.skeletons(Math.min(opts.sk || list.length || 4, 8));
    setTimeout(go, reduceMotion ? 0 : (opts.delay || 450));
  };

  /* ---------- Cart (localStorage) ---------- */
  var CART_KEY = 'farsiplay_cart_v1';
  function readCart() { try { var c = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); return Array.isArray(c) ? c.filter(function (x) { var p = FP.byId(x.id); return p && !FP.isFree(p); }) : []; } catch (e) { return []; } }
  function writeCart(c) { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) { } }
  var cart = readCart();
  FP.cart = {
    items: function () { return cart.slice(); },
    count: function () { return cart.reduce(function (s, x) { return s + x.qty; }, 0); },
    total: function () { return cart.reduce(function (s, x) { var p = FP.byId(x.id); return s + (p ? FP.finalPrice(p) * x.qty : 0); }, 0); },
    rawTotal: function () { return cart.reduce(function (s, x) { var p = FP.byId(x.id); return s + (p ? p.price_toman * x.qty : 0); }, 0); },
    add: function (id, qty) {
      id = String(id); if (FP.isFree(FP.byId(id))) return; var it = cart.filter(function (x) { return x.id === id; })[0];
      if (it) it.qty = Math.min(9, it.qty + (qty || 1)); else cart.push({ id: id, qty: qty || 1 });
      writeCart(cart); FP.updateCartUI(true);
    },
    setQty: function (id, q) { cart.forEach(function (x) { if (x.id === String(id)) x.qty = Math.max(1, Math.min(9, q)); }); writeCart(cart); FP.updateCartUI(); },
    remove: function (id) { cart = cart.filter(function (x) { return x.id !== String(id); }); writeCart(cart); FP.updateCartUI(); },
    clear: function () { cart = []; writeCart(cart); FP.updateCartUI(); }
  };
  window.addEventListener('storage', function (e) { if (e.key === CART_KEY) { cart = readCart(); FP.updateCartUI(); } });

  FP.updateCartUI = function (bump) {
    var n = FP.cart.count();
    FP.$$('.cart-badge').forEach(function (b) {
      b.textContent = FP.fa(n); b.setAttribute('data-count', n);
      if (bump && !reduceMotion) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    });
    var btn = FP.$('#cartBtn'); if (btn) btn.setAttribute('aria-label', 'سبد خرید، ' + FP.fa(n) + ' مورد');
    renderDrawer();
    document.dispatchEvent(new CustomEvent('cart:change'));
  };

  function renderDrawer() {
    var body = FP.$('#drawerBody'), foot = FP.$('#drawerFoot'); if (!body) return;
    var items = FP.cart.items();
    if (!items.length) {
      body.innerHTML = '<div class="cart-empty">' + I.cart + '<p>سبد خرید شما خالی است.</p><a class="btn btn-primary btn-sm" href="catalog.html">رفتن به فروشگاه</a></div>';
      foot.hidden = true; return;
    }
    foot.hidden = false;
    body.innerHTML = items.map(function (x) {
      var p = FP.byId(x.id);
      return '<div class="cart-item" data-id="' + FP.esc(p.id) + '"><a class="thumb" href="product.html?id=' + encodeURIComponent(p.id) + '" tabindex="-1" aria-hidden="true">' + FP.cover(p, { uid: 'd' }) + '</a>' +
        '<div><h3><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + FP.esc(p.title_fa) + '</a></h3><div class="unit">' + FP.toman(FP.finalPrice(p)) + '</div>' +
        '<div class="qty" role="group" aria-label="تعداد"><button type="button" data-qty="+1" aria-label="افزایش تعداد">+</button><output aria-live="polite">' + FP.fa(x.qty) + '</output><button type="button" data-qty="-1" aria-label="کاهش تعداد">−</button></div></div>' +
        '<button class="remove-btn" type="button" data-remove aria-label="' + FP.esc('حذف ' + p.title_fa) + '">' + I.trash + '</button></div>';
    }).join('');
    var raw = FP.cart.rawTotal(), tot = FP.cart.total();
    FP.$('#drawerSub').textContent = FP.toman(raw);
    FP.$('#drawerOff').textContent = FP.toman(raw - tot);
    FP.$('#drawerTotal').textContent = FP.toman(tot);
  }

  FP.openDrawer = function () {
    var d = FP.$('#cartDrawer'); d.classList.add('open'); d.removeAttribute('inert'); d.setAttribute('aria-hidden', 'false');
    FP.$('#overlay').classList.add('show'); document.body.style.overflow = 'hidden';
    lastFocus = document.activeElement; setTimeout(function () { var c = FP.$('#drawerClose'); c && c.focus(); }, 50);
  };
  FP.closeDrawer = function () {
    var d = FP.$('#cartDrawer'); if (!d.classList.contains('open')) return;
    d.classList.remove('open'); d.setAttribute('inert', ''); d.setAttribute('aria-hidden', 'true');
    if (!FP.$('#authModal').classList.contains('open')) { FP.$('#overlay').classList.remove('show'); document.body.style.overflow = ''; }
    lastFocus && lastFocus.focus && lastFocus.focus();
  };
  var lastFocus = null;

  /* ---------- Toast ---------- */
  FP.toast = function (msg, icon) {
    var wrap = FP.$('#toasts'); if (!wrap) return;
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
    t.innerHTML = (icon || I.check) + '<span>' + msg + '</span>';
    wrap.appendChild(t);
    setTimeout(function () { t.classList.add('hide'); setTimeout(function () { t.remove(); }, 400); }, 2600);
  };

  /* ---------- Layout (header/footer/drawer/modal) ---------- */
  var page = document.body.getAttribute('data-page') || '';
  function navLink(href, label, key) { return '<a href="' + href + '"' + (page === key ? ' aria-current="page"' : '') + '>' + label + '</a>'; }
  var hasPaid = products.some(function (p) { return !FP.isFree(p); });
  FP.hasPaid = hasPaid;
  function buildLayout() {
    var header = '<a class="skip-link" href="#main">پرش به محتوا</a>' +
      '<header class="site-header" id="siteHeader"><div class="container header-inner">' +
      '<a class="logo" href="index.html" aria-label="پرشیاپلی، صفحه اصلی"><span class="logo-mark" aria-hidden="true"><span class="logo-3d"><picture><source srcset="assets/brand/emblem-128.webp 1x, assets/brand/emblem-256.webp 2x" type="image/webp"><img src="assets/brand/emblem-128.png" srcset="assets/brand/emblem-128.png 1x, assets/brand/emblem-256.png 2x" width="44" height="44" alt="" decoding="async" draggable="false"></picture><span class="logo-shine"></span></span></span><span>پرشیاپلی<small>فارسی‌ساز بازی‌های کامپیوتر</small></span><span class="beta-tag">بتا</span></a>' +
      '<nav class="main-nav" id="mainNav" aria-label="منوی اصلی">' + navLink('index.html', 'خانه', 'home') + navLink('catalog.html', 'فروشگاه', 'catalog') +
      navLink('about.html', 'درباره ما', 'about') + navLink('about.html#contact', 'تماس با ما', 'contact') + '</nav>' +
      '<div class="header-actions">' +
      '<button class="icon-btn theme-toggle" id="themeBtn" type="button" aria-label="تغییر حالت روشن و تاریک">' + I.moon + I.sun + '</button>' +
      '<button class="icon-btn" id="loginBtn" type="button" aria-label="ورود یا ثبت‌نام"' + (hasPaid ? '' : ' hidden') + '>' + I.user + '</button>' +
      '<button class="icon-btn" id="cartBtn" type="button" aria-label="سبد خرید" aria-controls="cartDrawer"' + (hasPaid ? '' : ' hidden') + '>' + I.cart + '<span class="badge cart-badge" data-count="0">۰</span></button>' +
      '<button class="icon-btn menu-toggle" id="menuBtn" type="button" aria-label="باز کردن منو" aria-expanded="false" aria-controls="mainNav">' + I.menu + '</button>' +
      '</div></div></header>';
    var footer = '<footer class="site-footer"><div class="container"><div class="footer-grid">' +
      '<div><a class="logo" href="index.html"><span class="logo-mark" aria-hidden="true"><span class="logo-3d"><picture><source srcset="assets/brand/emblem-128.webp 1x, assets/brand/emblem-256.webp 2x" type="image/webp"><img src="assets/brand/emblem-128.png" srcset="assets/brand/emblem-128.png 1x, assets/brand/emblem-256.png 2x" width="44" height="44" alt="" decoding="async" draggable="false"></picture><span class="logo-shine"></span></span></span><span>پرشیاپلی</span></a><p>فارسی‌ساز برای بازی‌های کامپیوتر؛ زیرنویس و منوی فارسی با فونت خوانا و نصب ساده. این نسخه، نسخه‌ی آزمایشی (بتا) سایت است.</p></div>' +
      '<div><h4>دسترسی سریع</h4><ul><li><a href="index.html">خانه</a></li><li><a href="catalog.html">همه‌ی فارسی‌سازها</a></li><li><a href="catalog.html?free=1">فارسی‌سازهای رایگان</a></li></ul></div>' +
      '<div><h4>راهنما</h4><ul><li><a href="index.html#how">نحوه‌ی نصب</a></li><li><a href="index.html#faq">سوالات متداول</a></li><li><a href="about.html">درباره ما</a></li></ul></div>' +
      '<div id="footer-contact"><h4>ارتباط با ما</h4><ul><li>راه‌های ارتباطی به‌زودی اضافه می‌شوند.</li></ul></div>' +
      '</div><div class="footer-bottom"><span>© ۱۴۰۵ پرشیاپلی</span><span>نسخه‌ی بتا <bdi dir="ltr">v0.2</bdi></span></div></div></footer>';
    var drawer = '<div class="overlay" id="overlay"></div>' +
      '<aside class="drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-labelledby="drawerTitle" aria-hidden="true" inert>' +
      '<div class="drawer-head"><h2 id="drawerTitle">سبد خرید</h2><button class="icon-btn" id="drawerClose" type="button" aria-label="بستن سبد خرید">' + I.close + '</button></div>' +
      '<div class="drawer-body" id="drawerBody"></div>' +
      '<div class="drawer-foot" id="drawerFoot" hidden><div class="total-row sub"><span>جمع کل</span><span id="drawerSub"></span></div><div class="total-row sub"><span>تخفیف</span><span id="drawerOff"></span></div>' +
      '<div class="total-row"><span>مبلغ قابل پرداخت</span><span id="drawerTotal"></span></div><a class="btn btn-primary btn-block" href="checkout.html">ادامه‌ی خرید و تسویه</a></div></aside>';
    var modal = '<div class="modal" id="authModal" role="dialog" aria-modal="true" aria-labelledby="authTitle" aria-hidden="true" inert><div class="modal-card">' +
      '<div class="modal-head"><h2 id="authTitle">حساب کاربری</h2><button class="icon-btn" type="button" data-close-modal aria-label="بستن">' + I.close + '</button></div>' +
      '<div class="seg" role="tablist" data-active="login"><span class="ink" aria-hidden="true"></span><button type="button" role="tab" aria-selected="true" data-auth-tab="login">ورود</button><button type="button" role="tab" aria-selected="false" data-auth-tab="register">ثبت‌نام</button></div>' +
      '<div class="notice info" style="margin-bottom:14px">' + I.info + '<div><b>نسخه بتا:</b> ورود و ثبت‌نام فقط ظاهری است و هنوز به سرور وصل نیست. اطلاعاتی ذخیره یا ارسال نمی‌شود.</div></div>' +
      '<form class="form" id="authForm" novalidate>' +
      '<div class="form-row" data-only="register" hidden><label for="authName">نام و نام خانوادگی</label><input class="input" id="authName" name="name" autocomplete="name"><span class="err">نام را وارد کنید.</span></div>' +
      '<div class="form-row"><label for="authEmail">ایمیل</label><input class="input ltr-input" id="authEmail" name="email" type="email" autocomplete="email" placeholder="you@example.com"><span class="err">ایمیل معتبر وارد کنید.</span></div>' +
      '<div class="form-row"><label for="authPass">رمز عبور</label><input class="input ltr-input" id="authPass" name="password" type="password" autocomplete="current-password"><span class="err">رمز عبور باید حداقل ۶ کاراکتر باشد.</span></div>' +
      '<button class="btn btn-primary btn-block" type="submit" id="authSubmit">ورود</button></form></div></div>';
    var extra = '<div class="toasts" id="toasts" aria-live="polite"></div><button class="icon-btn to-top" id="toTop" type="button" aria-label="بازگشت به بالا">' + I.up + '</button>';

    var h = document.getElementById('header-slot'), f = document.getElementById('footer-slot');
    if (h) h.outerHTML = header;
    if (f) f.outerHTML = footer;
    document.body.insertAdjacentHTML('beforeend', drawer + modal + extra);
  }

  /* ---------- Theme ---------- */
  function setupTheme() {
    var btn = FP.$('#themeBtn'); if (!btn) return;
    btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', cur);
      try { localStorage.setItem('farsiplay_theme', cur); } catch (e) { }
      FP.toast(cur === 'light' ? 'حالت روشن فعال شد' : 'حالت تاریک فعال شد');
    });
  }

  /* ---------- Auth modal (UI only) ---------- */
  function setupAuth() {
    var modal = FP.$('#authModal'), mode = 'login';
    function open() {
      modal.classList.add('open'); modal.removeAttribute('inert'); modal.setAttribute('aria-hidden', 'false');
      FP.$('#overlay').classList.add('show'); document.body.style.overflow = 'hidden';
      lastFocus = document.activeElement; setTimeout(function () { FP.$('#authEmail').focus(); }, 60);
    }
    function close() {
      if (!modal.classList.contains('open')) return;
      modal.classList.remove('open'); modal.setAttribute('inert', ''); modal.setAttribute('aria-hidden', 'true');
      if (!FP.$('#cartDrawer').classList.contains('open')) { FP.$('#overlay').classList.remove('show'); document.body.style.overflow = ''; }
      lastFocus && lastFocus.focus && lastFocus.focus();
    }
    FP.closeAuth = close;
    FP.$('#loginBtn').addEventListener('click', open);
    FP.$$('[data-close-modal]', modal).forEach(function (b) { b.addEventListener('click', close); });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    FP.$$('[data-auth-tab]', modal).forEach(function (b) {
      b.addEventListener('click', function () {
        mode = b.getAttribute('data-auth-tab');
        FP.$('.seg', modal).setAttribute('data-active', mode);
        FP.$$('[data-auth-tab]', modal).forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        FP.$$('[data-only="register"]', modal).forEach(function (r) { r.hidden = mode !== 'register'; });
        FP.$('#authSubmit').textContent = mode === 'login' ? 'ورود' : 'ساخت حساب';
        FP.$('#authPass').setAttribute('autocomplete', mode === 'login' ? 'current-password' : 'new-password');
      });
    });
    FP.$('#authForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      function check(id, valid) { var row = FP.$(id).closest('.form-row'); if (row.hidden) return; row.classList.toggle('invalid', !valid); row.classList.toggle('valid', valid); if (!valid) ok = false; }
      check('#authName', FP.$('#authName').value.trim().length >= 3);
      check('#authEmail', FP.validEmail(FP.$('#authEmail').value));
      check('#authPass', FP.$('#authPass').value.length >= 6);
      if (!ok) { var bad = FP.$('.form-row.invalid .input', modal); bad && bad.focus(); return; }
      close(); FP.$('#authForm').reset(); FP.$$('.form-row', modal).forEach(function (r) { r.classList.remove('valid', 'invalid'); });
      FP.toast(mode === 'login' ? 'نسخه بتا: ورود شبیه‌سازی شد (بدون سرور)' : 'نسخه بتا: ثبت‌نام شبیه‌سازی شد (بدون سرور)', I.info);
    });
  }
  FP.validEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()); };

  /* ---------- Global events ---------- */
  function setupEvents() {
    var header = FP.$('#siteHeader'), toTop = FP.$('#toTop');
    var onScroll = function () { var y = window.scrollY; header && header.classList.toggle('scrolled', y > 10); toTop && toTop.classList.toggle('show', y > 700); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    toTop && toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

    var menuBtn = FP.$('#menuBtn'), nav = FP.$('#mainNav');
    menuBtn && menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
    });
    nav && nav.addEventListener('click', function (e) { if (e.target.closest('a')) { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); } });

    FP.$('#cartBtn').addEventListener('click', FP.openDrawer);
    FP.$('#drawerClose').addEventListener('click', FP.closeDrawer);
    FP.$('#overlay').addEventListener('click', function () { FP.closeDrawer(); FP.closeAuth && FP.closeAuth(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { FP.closeDrawer(); FP.closeAuth && FP.closeAuth(); } });

    FP.$('#drawerBody').addEventListener('click', function (e) {
      var item = e.target.closest('.cart-item'); if (!item) return;
      var id = item.getAttribute('data-id'), q = e.target.closest('[data-qty]');
      if (q) { var cur = FP.cart.items().filter(function (x) { return x.id === id; })[0]; if (cur) FP.cart.setQty(id, cur.qty + Number(q.getAttribute('data-qty'))); var again = FP.$('.cart-item[data-id="' + id + '"] [data-qty="' + q.getAttribute('data-qty') + '"]'); again && again.focus(); return; }
      if (e.target.closest('[data-remove]')) {
        item.classList.add('removing');
        setTimeout(function () { FP.cart.remove(id); FP.$('#drawerClose').focus(); }, reduceMotion ? 0 : 280);
      }
    });

    // add-to-cart buttons anywhere (delegated)
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-add]'); if (!b) return;
      e.preventDefault();
      var p = FP.byId(b.getAttribute('data-add')); if (!p || FP.isFree(p)) return;
      FP.cart.add(p.id, 1);
      FP.toast('«' + FP.esc(p.title_fa) + '» به سبد خرید اضافه شد');
      if (b.classList.contains('add-btn')) { b.classList.add('added'); b.innerHTML = I.check; setTimeout(function () { b.classList.remove('added'); b.innerHTML = I.plus; }, 1400); }
      if (b.hasAttribute('data-open-cart')) FP.openDrawer();
    });

    // ripple on buttons
    document.addEventListener('pointerdown', function (e) {
      if (reduceMotion) return;
      var b = e.target.closest('.btn, .add-btn'); if (!b || b.disabled) return;
      var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), sp = document.createElement('span');
      sp.className = 'ripple'; sp.style.width = sp.style.height = s + 'px';
      sp.style.left = (e.clientX - r.left - s / 2) + 'px'; sp.style.top = (e.clientY - r.top - s / 2) + 'px';
      b.appendChild(sp); setTimeout(function () { sp.remove(); }, 700);
    });
  }

  /* ---------- Reveal + tilt ---------- */
  var io = ('IntersectionObserver' in window && !reduceMotion) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  FP.enhance = function (root) {
    FP.$$('.reveal:not(.in)', root).forEach(function (el) { if (io) io.observe(el); else el.classList.add('in'); });
    if (reduceMotion || !finePointer) return;
    FP.$$('[data-tilt]:not([data-tilt-ready])', root).forEach(function (el) {
      el.setAttribute('data-tilt-ready', '');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  };

  /* ---------- Count-up ---------- */
  FP.countUp = function (el) {
    var target = Number(el.getAttribute('data-count-to')) || 0, suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = FP.num(target) + suffix; return; }
    var start = null, dur = 1600;
    function step(ts) { if (!start) start = ts; var t = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - t, 3); el.textContent = FP.num(target * e) + suffix; if (t < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  };

  /* ---------- Init ---------- */
  buildLayout();
  setupTheme();
  setupAuth();
  setupEvents();
  FP.updateCartUI();
  document.addEventListener('DOMContentLoaded', function () { FP.enhance(document); });
  if (document.readyState !== 'loading') FP.enhance(document);
})();

/* 3D logo tilt + spin */
function initLogo3D(){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('.logo').forEach(function(a){
    var t=a.querySelector('.logo-3d');if(!t)return;
    a.addEventListener('pointermove',function(e){
      if(e.pointerType!=='mouse'||t.classList.contains('spin'))return;
      var r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      x=Math.max(-.5,Math.min(.5,x));y=Math.max(-.5,Math.min(.5,y));
      t.style.setProperty('--ry',(x*24).toFixed(1)+'deg');t.style.setProperty('--rx',(-y*24).toFixed(1)+'deg');});
    a.addEventListener('pointerleave',function(){t.style.removeProperty('--rx');t.style.removeProperty('--ry');});
    a.addEventListener('pointerdown',function(){
      t.style.removeProperty('--rx');t.style.removeProperty('--ry');
      t.classList.remove('spin');void t.offsetWidth;t.classList.add('spin');});
    a.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;
      e.preventDefault();var h=a.href;setTimeout(function(){location.href=h},650);});
    t.addEventListener('animationend',function(){t.classList.remove('spin');});
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(initLogo3D,0)});else setTimeout(initLogo3D,0);
