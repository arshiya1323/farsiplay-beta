/* Home page */
(function () {
  'use strict';
  var FP = window.FP, P = FP.products, I = FP.icon;

  // hero: real in-game screenshots of the featured (free) product
  var feat = P.filter(FP.isFree)[0] || P[0];
  var hv = FP.$('#heroVisual'), shots = feat && feat.screenshots && feat.screenshots.length ? feat.screenshots.slice(0, 3) : [];
  if (feat) {
    FP.$('#heroLead').innerHTML = 'فارسی‌ساز <b>رایگان</b> بخش داستانی ' + FP.en(/GTA|Grand Theft/i.test(feat.title_en || '') ? 'GTA V Enhanced' : feat.title_en) + ' آماده شد: زیرنویس، مأموریت‌ها و منوها به فارسی، با فونت خوانا و نصاب ساده.';
    FP.$('#heroCta').innerHTML = '<a class="btn btn-primary btn-lg" href="product.html?id=' + encodeURIComponent(feat.id) + '">فارسی‌ساز ' + FP.en(/GTA|Grand Theft/i.test(feat.title_en || '') ? 'GTA V' : feat.title_en) + ' <span aria-hidden="true">←</span></a>' +
      '<a class="btn btn-ghost btn-lg" href="#how">چطور نصب کنم؟</a>';
  }
  hv.innerHTML = shots.map(function (u, i) {
    return '<div class="hero-card"><img src="' + FP.esc(u) + '" alt="" width="1280" height="720" decoding="async"></div>';
  }).join('') +
    '<div class="hero-chip c1"><span class="ic">' + I.bolt + '</span>نصب با یک کلیک</div>' +
    '<div class="hero-chip c2"><span class="ic">' + I.shield + '</span>فقط حالت داستانی</div>';
  if (!shots.length) hv.hidden = true;

  // 3D emblem: static high-res render first, live WebGL (lazy) on top when possible
  var em = document.createElement('div');
  em.className = 'hero-emblem';
  em.innerHTML = '<canvas></canvas><img src="assets/brand/emblem3d-hero.webp" width="320" height="320" alt="" decoding="async" draggable="false">';
  hv.appendChild(em); hv.hidden = false;
  (function () {
    if (location.protocol === 'file:') return; // textures can't load into WebGL from file://
    var c = document.createElement('canvas');
    if (!(c.getContext('webgl2') || c.getContext('webgl'))) return;
    var started = false;
    function boot() {
      if (started) return; started = true;
      var s = document.createElement('script');
      s.src = 'js/vendor/persia-emblem.min.js'; s.async = true;
      s.onload = function () {
        try { window.PersiaEmblem.create(em.querySelector('canvas'), { interactEl: em, reduced: FP.reduceMotion }); }
        catch (e) { /* keep static image */ }
      };
      document.head.appendChild(s);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); boot(); } }, { rootMargin: '200px' });
      io.observe(em);
    } else boot();
  })();

  // hero card parallax on mouse
  if (!FP.reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    var cards = FP.$$('.hero-card', hv);
    document.querySelector('.hero').addEventListener('pointermove', function (e) {
      var x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      cards.forEach(function (c, i) { var k = (i + 1) * 6; c.style.translate = (x * k) + 'px ' + (y * k) + 'px'; });
    });
  }

  // at-a-glance: only numbers computed from data + true non-numeric claims
  FP.$('#statProducts').setAttribute('data-count-to', P.length);
  var nFree = P.filter(FP.isFree).length;
  if (nFree && nFree === P.length) { FP.$('#statFree').textContent = 'رایگان'; FP.$('#statFreeLbl').textContent = P.length > 1 ? 'همه‌ی فارسی‌سازها' : 'فارسی‌ساز فعلی'; }
  else { FP.$('#statFree').setAttribute('data-count-to', nFree); }
  FP.$('#statIc1').innerHTML = I.bolt; FP.$('#statIc2').innerHTML = I.shield;
  var statsDone = false, statsEl = FP.$('.stats-grid');
  function runStats() { if (statsDone) return; statsDone = true; FP.$$('[data-count-to]').forEach(FP.countUp); }
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { runStats(); so.disconnect(); } }, { threshold: 0.3 });
    so.observe(statsEl);
  } else runStats();

  // featured free products (real data only)
  var frees = P.filter(FP.isFree);
  FP.$('#featureList').innerHTML = frees.length ? frees.map(function (p, i) {
    var url = 'product.html?id=' + encodeURIComponent(p.id);
    var feats = (p.features_fa || []).slice(0, 3).map(function (f) { return '<li>' + I.check + '<span>' + FP.autoLtr(f) + '</span></li>'; }).join('');
    return '<article class="feature-card reveal" style="--d:' + i * 0.08 + 's;--glow:' + FP.accent(p) + '">' +
      '<a class="fc-media" href="' + url + '" tabindex="-1" aria-hidden="true">' + FP.cover(p, { uid: 'fc' + i }) + '<span class="tag free">رایگان</span></a>' +
      '<div class="fc-body"><h3><a href="' + url + '">فارسی‌ساز ' + FP.esc(p.title_fa) + '</a></h3><div class="fc-sub">' + FP.en(p.title_en) + (p.version ? ' · نسخه‌ی ' + FP.en(p.version) : '') + '</div>' +
      '<ul class="fc-feats">' + feats + '</ul>' +
      (p.warning_fa ? '<p class="fc-warn">' + I.info + '<span>' + FP.autoLtr(p.warning_fa) + '</span></p>' : '') +
      '<div class="fc-actions"><a class="btn btn-primary" href="' + url + '">' + I.download + (p.download_url ? 'دانلود رایگان' : 'جزئیات و دانلود (به‌زودی)') + '</a></div></div></article>';
  }).join('') : '<p class="empty">به‌زودی…</p>';

  // steps
  var steps = [
    { ic: I.search, t: 'انتخاب', d: 'فارسی‌ساز بازی‌ات را پیدا کن و در صفحه‌اش نسخه‌ی سازگار و هشدارها را بخوان.' },
    { ic: I.download, t: 'دانلود', d: 'فایل نصاب را از صفحه‌ی همان فارسی‌ساز دانلود کن.' },
    { ic: I.gear, t: 'نصب', d: 'نصاب را اجرا کن، پوشه‌ی بازی را تأیید کن و دکمه‌ی نصب را بزن.' }
  ];
  FP.$('#steps').innerHTML = steps.map(function (s, i) {
    return '<div class="step reveal" style="--d:' + i * 0.12 + 's"><span class="n" aria-hidden="true">' + FP.fa(i + 1) + '</span><div class="ic">' + s.ic + '</div><h3>' + s.t + '</h3><p>' + s.d + '</p></div>';
  }).join('');

  // FAQ
  var faqs = [
    ['فارسی‌ساز با کدام نسخه‌ی بازی سازگار است؟', 'نسخه‌ای که فارسی‌ساز روی آن تست شده، در صفحه‌ی همان محصول نوشته شده است.'],
    ['آیا نصب فارسی‌ساز به فایل‌های بازی آسیب می‌زند؟', 'خیر. فارسی‌ساز <bdi dir="ltr">GTA V</bdi> از طریق پوشه‌ی <bdi dir="ltr">mods</bdi> نصب می‌شود و فایل‌های اصلی بازی دست نمی‌خورند. حذف کامل هم با یک دکمه در همان نصاب انجام می‌شود.'],
    ['می‌توانم با فارسی‌ساز آنلاین بازی کنم؟', 'نه. فارسی‌ساز فقط برای حالت داستانی است. با آن وارد <bdi dir="ltr">GTA Online</bdi> نشوید، چون ممکن است حسابتان بن شود.'],
    ['ترجمه چطور انجام شده؟', 'ترجمه با کمک هوش مصنوعی انجام و به‌صورت خودکار بازبینی شده است، پس ممکن است جاهایی اشتباه داشته باشد. خط‌هایی که با آپدیت‌های بازی عوض شده‌اند انگلیسی می‌مانند.'],
    ['فارسی‌ساز رایگان است؟', 'بله. فارسی‌ساز <bdi dir="ltr">GTA V</bdi> کاملاً رایگان است.']
  ];
  if (P.some(function (p) { return FP.isFree(p) && !p.download_url; })) faqs.push(['چرا دکمه‌ی دانلود هنوز فعال نیست؟', 'نسخه‌ی نهایی فارسی‌ساز در حال آماده‌سازی است و به‌محض انتشار، دکمه‌ی دانلود فعال می‌شود.']);
  FP.$('#faqList').innerHTML = faqs.map(function (f, i) {
    return '<div class="faq-item reveal" style="--d:' + i * 0.06 + 's"><button class="faq-q" type="button" aria-expanded="false" aria-controls="faq' + i + '" id="faqq' + i + '">' + f[0] +
      '<span class="pm" aria-hidden="true">' + I.plus + '</span></button><div class="faq-a" id="faq' + i + '" role="region" aria-labelledby="faqq' + i + '"><div><p>' + f[1] + '</p></div></div></div>';
  }).join('');
  FP.$$('.faq-q').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.parentNode, open = !item.classList.contains('open');
      FP.$$('.faq-item.open').forEach(function (o) { if (o !== item) { o.classList.remove('open'); FP.$('.faq-q', o).setAttribute('aria-expanded', 'false'); } });
      item.classList.toggle('open', open); b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  FP.$$('.faq .pm svg').forEach(function (s) { s.style.width = '16px'; s.style.height = '16px'; });

  FP.enhance(document);

  // particles in hero
  var cv = FP.$('#particles');
  if (cv && cv.getContext && !FP.reduceMotion) {
    var ctx = cv.getContext('2d'), dots = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), running = true;
    function size() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, W * H / 16000)); dots = [];
      for (var i = 0; i < n; i++) dots.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.8 + 0.6 });
    }
    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var light = document.documentElement.getAttribute('data-theme') === 'light';
      var col = light ? '104,69,245' : '167,139,250';
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i]; d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1; if (d.y < 0 || d.y > H) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fillStyle = 'rgba(' + col + ',.7)'; ctx.fill();
        for (var j = i + 1; j < dots.length; j++) {
          var e = dots[j], dx = d.x - e.x, dy = d.y - e.y, dist = dx * dx + dy * dy;
          if (dist < 12000) { ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(e.x, e.y); ctx.strokeStyle = 'rgba(' + col + ',' + (0.18 * (1 - dist / 12000)).toFixed(3) + ')'; ctx.lineWidth = 1; ctx.stroke(); }
        }
      }
      requestAnimationFrame(tick);
    }
    size(); tick();
    window.addEventListener('resize', size);
    var ho = new IntersectionObserver(function (en) { var vis = en[0].isIntersecting; if (vis && !running) { running = true; tick(); } else if (!vis) running = false; });
    ho.observe(cv);
  }
})();
