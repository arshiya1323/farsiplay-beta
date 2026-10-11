/* Home page */
(function () {
  'use strict';
  var FP = window.FP, P = FP.products, I = FP.icon;

  // hero floating covers
  var heroPicks = P.filter(function (p) { return p.is_bestseller; }).slice(0, 3);
  if (heroPicks.length < 3) heroPicks = P.slice(0, 3);
  var hv = FP.$('#heroVisual');
  hv.innerHTML = heroPicks.map(function (p, i) { return '<div class="hero-card">' + FP.cover(p, { tall: true, uid: 'h' + i }) + '</div>'; }).join('') +
    '<div class="hero-chip c1"><span class="ic">' + I.bolt + '</span>نصب در کمتر از یک دقیقه</div>' +
    '<div class="hero-chip c2"><span class="ic">' + I.shield + '</span>بدون آسیب به فایل بازی</div>';

  // hero card parallax on mouse
  if (!FP.reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    var cards = FP.$$('.hero-card', hv);
    document.querySelector('.hero').addEventListener('pointermove', function (e) {
      var x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      cards.forEach(function (c, i) { var k = (i + 1) * 8; c.style.translate = (x * k) + 'px ' + (y * k) + 'px'; });
    });
  }

  // stats
  FP.$('#statProducts').setAttribute('data-count-to', P.length);
  var statsDone = false, statsEl = FP.$('.stats-grid');
  function runStats() { if (statsDone) return; statsDone = true; FP.$$('[data-count-to]').forEach(FP.countUp); }
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { runStats(); so.disconnect(); } }, { threshold: 0.3 });
    so.observe(statsEl);
  } else runStats();

  // product sections
  var best = P.filter(function (p) { return p.is_bestseller; }).sort(function (a, b) { return b.rating - a.rating; }).slice(0, 4);
  var news = P.filter(function (p) { return p.is_new; }).sort(function (a, b) { return (FP.isFree(b) - FP.isFree(a)) || (b._order - a._order); }).slice(0, 4);
  if (news.length < 4) news = news.concat(P.slice().reverse().filter(function (p) { return news.indexOf(p) < 0; })).slice(0, 4);
  var deals = P.filter(function (p) { return p.discount_percent > 0; }).sort(function (a, b) { return b.discount_percent - a.discount_percent; }).slice(0, 4);
  FP.renderGrid(FP.$('#bestGrid'), best, { sk: 4 });
  FP.renderGrid(FP.$('#newGrid'), news, { sk: 4, delay: 550 });
  FP.renderGrid(FP.$('#dealGrid'), deals, { sk: 4, delay: 650 });

  // free strip
  var frees = P.filter(FP.isFree), fs = FP.$('#freeStrip');
  if (fs && frees.length) {
    FP.$('#freeList').innerHTML = frees.slice(0, 3).map(function (p, i) {
      return '<a class="free-item reveal" style="--d:' + i * 0.08 + 's;--glow:' + FP.accent(p) + '" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
        '<span class="fi-thumb">' + FP.cover(p, { uid: 'f' + i }) + '</span>' +
        '<span class="fi-body"><span class="fi-title">' + FP.esc(p.title_fa) + ' <span class="tag free">رایگان</span></span>' +
        '<span class="fi-sub">' + FP.en(p.title_en) + '</span>' +
        '<span class="fi-cta">' + I.download + (p.download_url ? 'دانلود رایگان' : 'دانلود رایگان، به‌زودی') + '</span></span></a>';
    }).join('');
    fs.hidden = false;
  }

  // genre tiles
  var colors = ['#7c5cff', '#22d3ee', '#f472b6', '#34d399', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa'];
  FP.$('#genreTiles').innerHTML = FP.genres().map(function (g, i) {
    return '<a class="genre-tile reveal" style="--c:' + colors[i % colors.length] + ';--d:' + (i % 6) * 0.05 + 's" href="catalog.html?genre=' + encodeURIComponent(g.name) + '">' +
      FP.esc(g.name) + '<span>' + FP.fa(g.count) + ' فارسی‌ساز</span></a>';
  }).join('');

  // steps
  var steps = [
    { ic: I.cart, t: 'خرید', d: 'فارسی‌ساز بازی‌ات را پیدا کن، به سبد اضافه کن و پرداخت را انجام بده.' },
    { ic: I.download, t: 'دانلود', d: 'لینک دانلود مستقیم و پرسرعت بلافاصله در حساب کاربری‌ات قرار می‌گیرد.' },
    { ic: I.gear, t: 'نصب', d: 'نصب‌کننده را اجرا کن، پوشه‌ی بازی را انتخاب کن و از بازی فارسی لذت ببر.' }
  ];
  FP.$('#steps').innerHTML = steps.map(function (s, i) {
    return '<div class="step reveal" style="--d:' + i * 0.12 + 's"><span class="n" aria-hidden="true">' + FP.fa(i + 1) + '</span><div class="ic">' + s.ic + '</div><h3>' + s.t + '</h3><p>' + s.d + '</p></div>';
  }).join('');

  // FAQ
  var faqs = [
    ['فارسی‌ساز با کدام نسخه‌ی بازی سازگار است؟', 'نسخه‌ی سازگار هر فارسی‌ساز در صفحه‌ی همان محصول نوشته شده است. معمولاً با آخرین نسخه‌ی <bdi dir="ltr">Steam</bdi> و نسخه‌های رایج کامپیوتر هماهنگ است.'],
    ['آیا نصب فارسی‌ساز به فایل‌های بازی آسیب می‌زند؟', 'خیر. نصب‌کننده قبل از هر تغییری از فایل‌های اصلی نسخه‌ی پشتیبان می‌گیرد و هر زمان بخواهی می‌توانی بازی را به حالت انگلیسی برگردانی.'],
    ['بعد از خرید، فایل را چطور دریافت می‌کنم؟', 'بلافاصله پس از پرداخت، لینک دانلود در حساب کاربری و ایمیلت قرار می‌گیرد. (در نسخه‌ی بتا پرداخت هنوز فعال نیست.)'],
    ['اگر بازی آپدیت شد، فارسی‌ساز هم آپدیت می‌شود؟', 'بله. به‌روزرسانی‌های فارسی‌ساز برای خریداران رایگان است و از طریق همان لینک قابل دریافت است.'],
    ['آیا امکان بازگشت وجه وجود دارد؟', 'اگر فارسی‌ساز روی سیستم شما کار نکند و پشتیبانی نتواند مشکل را حل کند، مبلغ پرداختی بازگردانده می‌شود.']
  ];
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
