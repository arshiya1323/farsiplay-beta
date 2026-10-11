/* About + contact */
(function () {
  'use strict';
  var FP = window.FP, I = FP.icon;
  var vals = [[I.chat, 'زیرنویس و منوی فارسی', 'دیالوگ‌ها، مأموریت‌ها و منوها با فونت خوانا و راست‌چین.'], [I.shield, 'نصب امن', 'فایل‌های اصلی بازی دست نمی‌خورند و حذف کامل با یک دکمه انجام می‌شود.'],
    [I.download, 'رایگان', 'فارسی‌سازهای فعلی رایگان‌اند.'], [I.info, 'شفافیت', 'روش ترجمه، نسخه‌ی تست‌شده و سازنده‌ی ابزارها در صفحه‌ی هر محصول ذکر می‌شود.']];
  FP.$('#values').innerHTML = vals.map(function (v, i) { return '<div class="value reveal" style="--d:' + i * 0.08 + 's"><div class="ic">' + v[0] + '</div><h3>' + v[1] + '</h3><p>' + v[2] + '</p></div>'; }).join('');
  FP.enhance(document);
})();
