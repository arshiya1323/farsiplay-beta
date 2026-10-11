/* Product detail page */
(function () {
  'use strict';
  var FP = window.FP, I = FP.icon;
  var id = new URLSearchParams(location.search).get('id');
  var p = FP.byId(id) || null;
  var root = FP.$('#productRoot');

  if (!p) {
    root.innerHTML = '<div class="empty" style="margin:40px 0">' + I.search + '<h1 style="font-size:1.4rem">محصول پیدا نشد</h1><p>ممکن است لینک اشتباه باشد.</p><a class="btn btn-primary" href="catalog.html">بازگشت به فروشگاه</a></div>';
    FP.$('#crumbTitle').textContent = 'یافت نشد';
    FP.$('#relSection').hidden = true;
    return;
  }

  document.title = 'فارسی‌ساز ' + p.title_fa + ' | پرشیاپلی (بتا)';
  FP.$('#crumbTitle').textContent = p.title_fa;
  var fin = FP.finalPrice(p), free = FP.isFree(p), shots = p.screenshots || [];
  var tags = FP.genreTags(p).map(function (g) { return '<a class="chip" style="padding:4px 12px;font-size:.85rem" href="catalog.html?genre=' + encodeURIComponent(g) + '">' + FP.esc(g) + '</a>'; }).join('');
  var badges = (free ? '<span class="tag free">رایگان</span>' : '') + (p.is_new ? '<span class="tag new">جدید</span>' : '') + (p.is_bestseller ? '<span class="tag best">پرفروش</span>' : '');
  var warnIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>';

  var media = shots.length
    ? '<button class="media-btn" type="button" data-shot="0" aria-label="نمایش بزرگ تصویر">' + FP.cover(p, { eager: true }) + '<span class="zoom-hint" aria-hidden="true">' + I.search + '</span></button>'
    : FP.cover(p, { uid: 'main' });

  var warning = p.warning_fa ? '<div class="warn-box" role="alert">' + warnIcon + '<div><b>هشدار مهم</b><p>' + FP.autoLtr(p.warning_fa) + '</p></div></div>' : '';

  var priceBlock = free
    ? '<div class="price"><span class="now free-price">رایگان</span></div>'
    : '<div class="price">' + (p.discount_percent > 0 ? '<span class="old">' + FP.toman(p.price_toman) + '<span class="off-pill">' + FP.fa(p.discount_percent) + '٪</span></span>' : '') +
      '<span class="now">' + FP.num(fin) + '<small>تومان</small></span></div>';
  var action;
  if (!free) action = '<button class="btn btn-primary btn-lg" type="button" data-add="' + FP.esc(p.id) + '" data-open-cart>' + I.cart + 'افزودن به سبد خرید</button>';
  else if (p.download_url && /^(https:\/\/|assets\/|downloads\/)/.test(p.download_url)) action = '<a class="btn btn-primary btn-lg" href="' + FP.esc(p.download_url) + '" rel="noopener">' + I.download + 'دانلود رایگان</a>';
  else action = '<button class="btn btn-primary btn-lg" type="button" disabled aria-describedby="soonNote">' + I.download + 'به‌زودی</button>';
  var soon = free && !p.download_url ? '<p class="soon-note" id="soonNote">' + I.info + '<span>نسخه‌ی نهایی در حال آماده‌سازیه و به‌زودی لینک دانلود رایگان همین‌جا قرار می‌گیره.</span></p>' : '';

  var guide = Array.isArray(p.install_steps_fa) && p.install_steps_fa.length
    ? '<ol class="guide">' + p.install_steps_fa.map(function (st) { return '<li>' + FP.autoLtr(st) + '</li>'; }).join('') + '</ol>' +
      (p.game_version_fa ? '<div class="note">' + FP.autoLtr(p.game_version_fa) + '</div>' : '')
    : '<ol class="guide">' +
      '<li>فایل فارسی‌ساز را از بخش «دانلودهای من» دریافت و از حالت فشرده خارج کنید.</li>' +
      '<li>بازی و لانچر <bdi dir="ltr">' + FP.esc(p.platform) + '</bdi> را کامل ببندید.</li>' +
      '<li>فایل <code class="path">Setup.exe</code> را اجرا کنید و پوشه‌ی نصب بازی را انتخاب کنید؛ مثلاً <code class="path">C:\\Games\\' + FP.esc(p.title_en) + '</code></li>' +
      '<li>روی «نصب» بزنید. نصب‌کننده خودکار از فایل‌های اصلی نسخه‌ی پشتیبان می‌گیرد.</li>' +
      '<li>بازی را اجرا کنید؛ متن‌ها و منوها فارسی هستند. برای حذف، دوباره نصب‌کننده را اجرا و «بازگردانی» را انتخاب کنید.</li>' +
      '</ol><div class="note">فارسی‌ساز با نسخه‌ی <bdi dir="ltr">' + FP.esc(p.version) + '</bdi> هماهنگ است. اگر بازی‌تان نسخه‌ی دیگری دارد، پیش از خرید با پشتیبانی هماهنگ کنید.</div>';

  var credits = p.credits_fa ? '<section class="credits-box" aria-labelledby="creditsTitle"><h2 id="creditsTitle">' + I.heart + 'اعتبار و سپاس</h2><ul>' +
    String(p.credits_fa).split('؛').map(function (c) { return c.trim(); }).filter(Boolean).map(function (c) { return '<li>' + FP.autoLtr(c, p.credits_links) + '</li>'; }).join('') +
    '</ul><p class="credits-foot">حقوق ابزارهای جانبی متعلق به سازندگان خودشان است؛ برای نسخه‌ی رسمی هر ابزار به صفحه‌ی خودش مراجعه کنید.</p></section>' : '';

  var gallery = shots.length ? '<section class="gallery reveal" aria-labelledby="galTitle"><div class="section-head"><div><h2 id="galTitle"><span class="bar"></span>تصاویر از بازی</h2><p>اسکرین‌شات‌های واقعی از بازی با فارسی‌ساز</p></div></div><div class="gallery-grid">' +
    shots.map(function (u, i) { return '<button class="shot" type="button" data-shot="' + i + '" aria-label="' + FP.esc('نمایش تصویر ' + FP.fa(i + 1) + ' از ' + FP.fa(shots.length)) + '"><img src="' + FP.esc(u) + '" alt="' + FP.esc('اسکرین‌شات ' + FP.fa(i + 1) + ' از ' + p.title_fa) + '" loading="lazy" decoding="async" width="1280" height="720"></button>'; }).join('') +
    '</div></section>' : '';

  var descExtra = p.game_version_fa ? '<p style="color:var(--muted)">' + FP.autoLtr(p.game_version_fa) + '</p>'
    : '<p style="color:var(--muted)">این فارسی‌ساز برای نسخه‌ی <bdi dir="ltr">' + FP.esc(p.version) + '</bdi> بازی روی <bdi dir="ltr">' + FP.esc(p.platform) + '</bdi> آماده شده است.</p>';

  root.innerHTML =
    '<div class="product-layout" style="margin-top:14px">' +
    '<div class="product-media reveal">' + media + '</div>' +
    '<div class="product-info reveal" style="--d:.1s">' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap">' + badges + '</div>' +
    '<h1>فارسی‌ساز ' + FP.esc(p.title_fa) + '</h1>' +
    '<div class="en-title"><bdi dir="ltr">' + FP.esc(p.title_en) + '</bdi></div>' +
    '<div class="chips" style="margin-top:12px;gap:6px">' + tags + '</div>' +
    '<div class="meta-row">' +
    (p.rating ? '<div class="meta"><span>امتیاز کاربران</span><b class="rating">' + I.star + FP.fa(p.rating.toFixed(1)) + ' از ۵</b></div>' : '') +
    '<div class="meta"><span>پلتفرم</span><b><bdi dir="ltr">' + FP.esc(p.platform) + '</bdi></b></div>' +
    '<div class="meta"><span>' + (free ? 'نسخه‌ی فارسی‌ساز' : 'نسخه‌ی سازگار') + '</span><b><bdi dir="ltr">' + FP.esc(p.version) + '</bdi></b></div>' +
    '<div class="meta"><span>' + (free ? 'حجم فایل' : 'حجم بازی') + '</span><b>' + FP.size(p.size_mb) + '</b></div>' +
    '</div>' +
    (p.game_version_fa ? '<p class="game-ver">' + I.check + '<span>' + FP.autoLtr(p.game_version_fa) + '</span></p>' : '') +
    warning +
    '<div class="buy-box">' + priceBlock + '<div class="actions">' + action + '</div>' + soon + '</div>' +
    '<div class="tabs" id="tabs"><div class="tab-list" role="tablist" aria-label="اطلاعات محصول">' +
    '<button class="tab-btn" role="tab" id="t-desc" aria-controls="p-desc" aria-selected="true">توضیحات</button>' +
    '<button class="tab-btn" role="tab" id="t-feat" aria-controls="p-feat" aria-selected="false" tabindex="-1">ویژگی‌ها</button>' +
    '<button class="tab-btn" role="tab" id="t-guide" aria-controls="p-guide" aria-selected="false" tabindex="-1">راهنمای نصب</button>' +
    '<span class="tab-ink" aria-hidden="true"></span></div>' +
    '<div class="tab-panel" role="tabpanel" id="p-desc" aria-labelledby="t-desc"><p style="margin-top:0">' + FP.autoLtr(p.description_fa) + '</p>' + descExtra + '</div>' +
    '<div class="tab-panel" role="tabpanel" id="p-feat" aria-labelledby="t-feat" hidden><ul class="feature-list">' +
    p.features_fa.map(function (f) { return '<li>' + I.check + '<span>' + FP.autoLtr(f) + '</span></li>'; }).join('') + '</ul></div>' +
    '<div class="tab-panel" role="tabpanel" id="p-guide" aria-labelledby="t-guide" hidden>' + guide + '</div>' +
    '</div>' + credits + '</div></div>' + gallery;

  // lightbox
  if (shots.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox'; lb.id = 'lightbox'; lb.hidden = true;
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'نمایش تصویر');
    lb.innerHTML = '<button class="icon-btn lb-close" type="button" aria-label="بستن">' + I.close + '</button>' +
      '<button class="icon-btn lb-nav lb-prev" type="button" aria-label="تصویر قبلی">' + I.arrow + '</button>' +
      '<figure><img alt="" decoding="async"><figcaption aria-live="polite"></figcaption></figure>' +
      '<button class="icon-btn lb-nav lb-next" type="button" aria-label="تصویر بعدی">' + I.arrow + '</button>';
    document.body.appendChild(lb);
    var lbImg = FP.$('img', lb), lbCap = FP.$('figcaption', lb), cur = 0, opener = null;
    var show = function (i) {
      cur = (i + shots.length) % shots.length;
      lbImg.src = shots[cur]; lbImg.alt = 'اسکرین‌شات ' + FP.fa(cur + 1) + ' از ' + p.title_fa;
      lbCap.textContent = 'تصویر ' + FP.fa(cur + 1) + ' از ' + FP.fa(shots.length);
    };
    var open = function (i, btn) { opener = btn; show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; requestAnimationFrame(function () { lb.classList.add('open'); }); FP.$('.lb-close', lb).focus(); };
    var close = function () { if (lb.hidden) return; lb.classList.remove('open'); lb.hidden = true; document.body.style.overflow = ''; opener && opener.focus(); };
    // RTL: "next" is on the left and moves forward
    FP.$('.lb-next', lb).addEventListener('click', function () { show(cur + 1); });
    FP.$('.lb-prev', lb).addEventListener('click', function () { show(cur - 1); });
    FP.$('.lb-close', lb).addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'FIGURE') close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur + 1);
      else if (e.key === 'ArrowRight') show(cur - 1);
      else if (e.key === 'Tab') { var f = FP.$$('button', lb), a = document.activeElement; if (e.shiftKey && a === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && a === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } }
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(cur + (dx > 0 ? 1 : -1)); sx = null; });
    root.addEventListener('click', function (e) { var b = e.target.closest('[data-shot]'); if (b) open(Number(b.getAttribute('data-shot')), b); });
  }

  // tabs with sliding ink + keyboard support
  var tabs = FP.$$('.tab-btn', root), ink = FP.$('.tab-ink', root);
  function moveInk(btn) {
    var list = btn.parentNode.getBoundingClientRect(), r = btn.getBoundingClientRect();
    ink.style.width = r.width + 'px'; ink.style.left = (r.left - list.left + btn.parentNode.scrollLeft) + 'px';
  }
  function select(btn, focus) {
    tabs.forEach(function (t) {
      var on = t === btn; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      FP.$('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    moveInk(btn); if (focus) btn.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowLeft') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowRight') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0]; if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });
  requestAnimationFrame(function () { moveInk(tabs[0]); });
  window.addEventListener('resize', function () { moveInk(FP.$('.tab-btn[aria-selected="true"]', root)); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveInk(FP.$('.tab-btn[aria-selected="true"]', root)); });

  // related: share a genre tag, then fill with others
  var myTags = FP.genreTags(p);
  var rel = FP.products.filter(function (x) { return x !== p; }).map(function (x) {
    var score = FP.genreTags(x).filter(function (g) { return myTags.indexOf(g) >= 0; }).length;
    return { x: x, s: score + (x.rating || 0) / 10 };
  }).sort(function (a, b) { return b.s - a.s; }).slice(0, 4).map(function (o) { return o.x; });
  if (rel.length) FP.renderGrid(FP.$('#relGrid'), rel, { sk: 4 }); else FP.$('#relSection').hidden = true;
  FP.enhance(document);
})();
