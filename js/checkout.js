/* Checkout page (beta, no real payment) */
(function () {
  'use strict';
  var FP = window.FP, I = FP.icon;
  var summary = FP.$('#summary'), form = FP.$('#checkoutForm'), done = false;

  function renderSummary() {
    if (done) return;
    var items = FP.cart.items();
    if (!items.length) {
      summary.innerHTML = '<div class="cart-empty" style="padding:20px 0">' + I.cart + '<p>سبد خرید خالی است.</p><a class="btn btn-primary btn-sm" href="catalog.html">رفتن به فروشگاه</a></div>';
      FP.$('#payBtn').disabled = true; return;
    }
    FP.$('#payBtn').disabled = false;
    var raw = FP.cart.rawTotal(), tot = FP.cart.total();
    summary.innerHTML = '<div class="summary-list">' + items.map(function (x) {
      var p = FP.byId(x.id);
      return '<div class="summary-item"><div><div class="t">' + FP.esc(p.title_fa) + '</div><div class="q">' + FP.en(p.title_en) + ' · ' + FP.fa(x.qty) + ' عدد</div></div><b>' + FP.toman(FP.finalPrice(p) * x.qty) + '</b></div>';
    }).join('') + '</div>' +
      '<div class="total-row sub"><span>جمع کل</span><span>' + FP.toman(raw) + '</span></div>' +
      '<div class="total-row sub"><span>تخفیف</span><span style="color:var(--success)">' + FP.toman(raw - tot) + '</span></div>' +
      '<div class="total-row" style="margin-top:8px;padding-top:12px;border-top:1px solid var(--border)"><span>مبلغ قابل پرداخت</span><span>' + FP.toman(tot) + '</span></div>' +
      '<button class="btn btn-ghost btn-sm btn-block" type="button" id="editCart" style="margin-top:14px">ویرایش سبد خرید</button>';
    FP.$('#editCart').addEventListener('click', FP.openDrawer);
  }
  document.addEventListener('cart:change', renderSummary);
  renderSummary();

  var rules = {
    cName: function (v) { return v.trim().length >= 3; },
    cEmail: FP.validEmail,
    cPhone: function (v) { return /^(\+98|0098|0)?9\d{9}$/.test(FP.toEnDigits(v).replace(/[\s-]/g, '')); }
  };
  function validate(id) {
    var el = FP.$('#' + id), row = el.closest('.form-row'), ok = rules[id](el.value);
    row.classList.toggle('invalid', !ok); row.classList.toggle('valid', ok); el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }
  Object.keys(rules).forEach(function (id) {
    var el = FP.$('#' + id);
    el.addEventListener('blur', function () { if (el.value) validate(id); });
    el.addEventListener('input', function () { if (el.closest('.form-row').classList.contains('invalid')) validate(id); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = Object.keys(rules).filter(function (id) { return !validate(id); });
    if (bad.length) { FP.$('#' + bad[0]).focus(); return; }
    if (!FP.cart.count()) return;
    var btn = FP.$('#payBtn'); btn.disabled = true; btn.textContent = 'در حال ثبت…';
    setTimeout(function () {
      var code = 'FP-' + Date.now().toString(36).toUpperCase().slice(-6);
      var total = FP.cart.total(), name = FP.$('#cName').value.trim(), email = FP.$('#cEmail').value.trim();
      done = true;
      FP.$('#checkoutRoot').innerHTML = '<div class="panel success" role="status" tabindex="-1" id="successBox">' +
        '<div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></div>' +
        '<h2>سفارش آزمایشی ثبت شد!</h2><p>' + FP.esc(name) + ' عزیز، ممنون از اینکه نسخه‌ی بتا را امتحان کردی.</p>' +
        '<div class="order-code">' + code + '</div>' +
        '<p style="color:var(--muted)">مبلغ سفارش: ' + FP.toman(total) + ' — در نسخه‌ی نهایی، لینک دانلود به <bdi dir="ltr">' + FP.esc(email) + '</bdi> ارسال می‌شود.</p>' +
        '<div class="notice" style="text-align:start;max-width:560px;margin:18px auto">' + I.info + '<div><b>نسخه بتا: پرداخت هنوز فعال نیست.</b> هیچ پرداختی انجام نشد و اطلاعات شما جایی ارسال نشد.</div></div>' +
        '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="catalog.html">ادامه‌ی خرید</a><a class="btn" href="index.html">صفحه‌ی اصلی</a></div></div>';
      FP.cart.clear();
      FP.$('#successBox').focus();
      window.scrollTo({ top: 0, behavior: FP.reduceMotion ? 'auto' : 'smooth' });
    }, 900);
  });
})();
