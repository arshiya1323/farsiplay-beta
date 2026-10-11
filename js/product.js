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

  document.title = 'فارسی‌ساز ' + p.title_fa + ' | فارسی‌پلی (بتا)';
  FP.$('#crumbTitle').textContent = p.title_fa;
  var fin = FP.finalPrice(p);
  var tags = FP.genreTags(p).map(function (g) { return '<a class="chip" style="padding:4px 12px;font-size:.85rem" href="catalog.html?genre=' + encodeURIComponent(g) + '">' + FP.esc(g) + '</a>'; }).join('');
  var badges = (p.is_new ? '<span class="tag new">جدید</span>' : '') + (p.is_bestseller ? '<span class="tag best">پرفروش</span>' : '');

  root.innerHTML =
    '<div class="product-layout" style="margin-top:14px">' +
    '<div class="product-media reveal">' + FP.cover(p, { uid: 'main' }) + '</div>' +
    '<div class="product-info reveal" style="--d:.1s">' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap">' + badges + '</div>' +
    '<h1>فارسی‌ساز ' + FP.esc(p.title_fa) + '</h1>' +
    '<div class="en-title"><bdi dir="ltr">' + FP.esc(p.title_en) + '</bdi></div>' +
    '<div class="chips" style="margin-top:12px;gap:6px">' + tags + '</div>' +
    '<div class="meta-row">' +
    '<div class="meta"><span>امتیاز کاربران</span><b class="rating">' + I.star + FP.fa(p.rating.toFixed(1)) + ' از ۵</b></div>' +
    '<div class="meta"><span>پلتفرم</span><b><bdi dir="ltr">' + FP.esc(p.platform) + '</bdi></b></div>' +
    '<div class="meta"><span>نسخه‌ی سازگار</span><b><bdi dir="ltr">' + FP.esc(p.version) + '</bdi></b></div>' +
    '<div class="meta"><span>حجم بازی</span><b>' + FP.size(p.size_mb) + '</b></div>' +
    '</div>' +
    '<div class="buy-box"><div class="price">' +
    (p.discount_percent > 0 ? '<span class="old">' + FP.toman(p.price_toman) + '<span class="off-pill">' + FP.fa(p.discount_percent) + '٪</span></span>' : '') +
    '<span class="now">' + FP.num(fin) + '<small>تومان</small></span></div>' +
    '<div class="actions"><button class="btn btn-primary btn-lg" type="button" data-add="' + FP.esc(p.id) + '" data-open-cart>' + I.cart + 'افزودن به سبد خرید</button></div></div>' +
    '<div class="tabs" id="tabs"><div class="tab-list" role="tablist" aria-label="اطلاعات محصول">' +
    '<button class="tab-btn" role="tab" id="t-desc" aria-controls="p-desc" aria-selected="true">توضیحات</button>' +
    '<button class="tab-btn" role="tab" id="t-feat" aria-controls="p-feat" aria-selected="false" tabindex="-1">ویژگی‌ها</button>' +
    '<button class="tab-btn" role="tab" id="t-guide" aria-controls="p-guide" aria-selected="false" tabindex="-1">راهنمای نصب</button>' +
    '<span class="tab-ink" aria-hidden="true"></span></div>' +
    '<div class="tab-panel" role="tabpanel" id="p-desc" aria-labelledby="t-desc"><p style="margin-top:0">' + FP.esc(p.description_fa) + '</p>' +
    '<p style="color:var(--muted)">این فارسی‌ساز برای نسخه‌ی <bdi dir="ltr">' + FP.esc(p.version) + '</bdi> بازی روی <bdi dir="ltr">' + FP.esc(p.platform) + '</bdi> آماده شده است.</p></div>' +
    '<div class="tab-panel" role="tabpanel" id="p-feat" aria-labelledby="t-feat" hidden><ul class="feature-list">' +
    p.features_fa.map(function (f) { return '<li>' + I.check + '<span>' + FP.esc(f) + '</span></li>'; }).join('') + '</ul></div>' +
    '<div class="tab-panel" role="tabpanel" id="p-guide" aria-labelledby="t-guide" hidden><ol class="guide">' +
    '<li>فایل فارسی‌ساز را از بخش «دانلودهای من» دریافت و از حالت فشرده خارج کنید.</li>' +
    '<li>بازی و لانچر <bdi dir="ltr">' + FP.esc(p.platform) + '</bdi> را کامل ببندید.</li>' +
    '<li>فایل <code class="path">Setup.exe</code> را اجرا کنید و پوشه‌ی نصب بازی را انتخاب کنید؛ مثلاً <code class="path">C:\\Games\\' + FP.esc(p.title_en) + '</code></li>' +
    '<li>روی «نصب» بزنید. نصب‌کننده خودکار از فایل‌های اصلی نسخه‌ی پشتیبان می‌گیرد.</li>' +
    '<li>بازی را اجرا کنید؛ متن‌ها و منوها فارسی هستند. برای حذف، دوباره نصب‌کننده را اجرا و «بازگردانی» را انتخاب کنید.</li>' +
    '</ol><div class="note">فارسی‌ساز با نسخه‌ی <bdi dir="ltr">' + FP.esc(p.version) + '</bdi> هماهنگ است. اگر بازی‌تان نسخه‌ی دیگری دارد، پیش از خرید با پشتیبانی هماهنگ کنید.</div></div>' +
    '</div></div></div>';

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
    return { x: x, s: score + x.rating / 10 };
  }).sort(function (a, b) { return b.s - a.s; }).slice(0, 4).map(function (o) { return o.x; });
  FP.renderGrid(FP.$('#relGrid'), rel, { sk: 4 });
  FP.enhance(document);
})();
