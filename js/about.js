/* About + contact */
(function () {
  'use strict';
  var FP = window.FP, I = FP.icon;
  var vals = [[I.chat, 'ترجمه‌ی روان', 'ترجمه‌ی طبیعی و متناسب با لحن هر شخصیت، نه ترجمه‌ی ماشینی.'], [I.shield, 'نصب امن', 'پشتیبان‌گیری خودکار و امکان بازگشت به حالت اصلی.'],
    [I.bolt, 'آپدیت رایگان', 'با هر آپدیت بازی، فارسی‌ساز هم به‌روز می‌شود.'], [I.heart, 'پشتیبانی واقعی', 'اگر مشکلی پیش آمد، کنارت هستیم تا حل شود.']];
  FP.$('#values').innerHTML = vals.map(function (v, i) { return '<div class="value reveal" style="--d:' + i * 0.08 + 's"><div class="ic">' + v[0] + '</div><h3>' + v[1] + '</h3><p>' + v[2] + '</p></div>'; }).join('');
  var contacts = [[I.mail, 'ایمیل', '<bdi dir="ltr">support@example.com</bdi>'], [I.send, 'تلگرام', '<bdi dir="ltr">@farsiplay_support</bdi>'], [I.phone, 'تلفن', '<bdi dir="ltr">۰۲۱-۰۰۰۰۰۰۰۰</bdi>'], [I.chat, 'ساعات پاسخ‌گویی', 'شنبه تا پنجشنبه، ۱۰ تا ۱۸']];
  FP.$('#contactList').innerHTML = contacts.map(function (c) { return '<li><span class="ic">' + c[0] + '</span><div><span>' + c[1] + '</span><b>' + c[2] + '</b></div></li>'; }).join('') +
    '<li style="color:var(--muted);font-size:.85rem">اطلاعات تماس بالا نمونه‌اند و در نسخه‌ی نهایی جایگزین می‌شوند.</li>';
  FP.$('#contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    [['#mName', function (v) { return v.trim().length >= 2; }], ['#mEmail', FP.validEmail], ['#mMsg', function (v) { return v.trim().length >= 5; }]].forEach(function (r) {
      var el = FP.$(r[0]), good = r[1](el.value), row = el.closest('.form-row');
      row.classList.toggle('invalid', !good); row.classList.toggle('valid', good); if (!good && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    this.reset(); FP.$$('#contactForm .form-row').forEach(function (r) { r.classList.remove('valid'); });
    FP.toast('نسخه بتا: پیام شما شبیه‌سازی شد و ارسال نشد', I.info);
  });
  FP.enhance(document);
})();
