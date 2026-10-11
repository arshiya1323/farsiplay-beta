/* Catalog page: search, genre filter, sort */
(function () {
  'use strict';
  var FP = window.FP, P = FP.products;
  var qs = new URLSearchParams(location.search);
  var state = { q: qs.get('q') || '', genre: qs.get('genre') || '', sort: qs.get('sort') || 'new', free: qs.get('free') === '1' };
  if (['new', 'best', 'cheap', 'expensive'].indexOf(state.sort) < 0) state.sort = 'new';

  var qEl = FP.$('#q'), sortEl = FP.$('#sort'), chipsEl = FP.$('#genreChips'), grid = FP.$('#catalogGrid');
  // price/popularity sorting only makes sense with paid products
  if (!FP.hasPaid) { FP.$('#sortWrap').hidden = true; state.sort = 'new'; FP.$('.toolbar').classList.add('no-sort'); }
  qEl.value = state.q; sortEl.value = state.sort;

  function norm(s) {
    return FP.toEnDigits(String(s || '')).toLowerCase()
      .replace(/[\u200c\u200f\u200e]/g, '').replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[ًٌٍَُِّْ]/g, '')
      .replace(/[^0-9a-z\u0600-\u06ff]+/g, ' ').trim();
  }
  P.forEach(function (p) { p._search = norm([p.title_fa, p.title_en, p.genre_fa, p.id, p.platform].join(' ')); p._search2 = p._search.replace(/\s+/g, ''); });

  var genres = FP.genres();
  var freeCount = P.filter(FP.isFree).length;
  function chips() {
    chipsEl.innerHTML = (freeCount ? '<button class="chip chip-free" type="button" data-free aria-pressed="' + state.free + '">' + FP.icon.download + 'رایگان‌ها <span class="count">' + FP.fa(freeCount) + '</span></button><span class="chip-sep" aria-hidden="true"></span>' : '') +
      '<button class="chip" type="button" data-genre="" aria-pressed="' + (!state.genre) + '">همه <span class="count">' + FP.fa(P.length) + '</span></button>' +
      genres.map(function (g) { return '<button class="chip" type="button" data-genre="' + FP.esc(g.name) + '" aria-pressed="' + (state.genre === g.name) + '">' + FP.esc(g.name) + ' <span class="count">' + FP.fa(g.count) + '</span></button>'; }).join('');
  }
  chipsEl.addEventListener('click', function (e) {
    if (e.target.closest('[data-free]')) { state.free = !state.free; chips(); apply(true); return; }
    var c = e.target.closest('[data-genre]'); if (!c) return;
    state.genre = c.getAttribute('data-genre'); chips(); apply(true);
  });

  function filtered() {
    var terms = norm(state.q).split(' ').filter(Boolean);
    var list = P.filter(function (p) {
      if (state.free && !FP.isFree(p)) return false;
      if (state.genre && FP.genreTags(p).indexOf(state.genre) < 0) return false;
      return terms.every(function (t) { return p._search.indexOf(t) >= 0 || p._search2.indexOf(t) >= 0; });
    });
    var s = state.sort;
    list.sort(function (a, b) {
      if (s === 'cheap') return FP.finalPrice(a) - FP.finalPrice(b);
      if (s === 'expensive') return FP.finalPrice(b) - FP.finalPrice(a);
      if (s === 'best') return (b.is_bestseller - a.is_bestseller) || ((b.rating || 0) - (a.rating || 0));
      return (b.is_new - a.is_new) || (b._order - a._order);
    });
    return list;
  }

  function syncUrl() {
    var u = new URLSearchParams();
    if (state.q) u.set('q', state.q); if (state.genre) u.set('genre', state.genre); if (state.sort !== 'new') u.set('sort', state.sort); if (state.free) u.set('free', '1');
    var str = u.toString();
    try { history.replaceState(null, '', location.pathname + (str ? '?' + str : '')); } catch (e) { }
  }

  function apply(animate) {
    var list = filtered();
    FP.$('#resultCount').innerHTML = FP.fa(list.length) + ' فارسی‌ساز ' + (state.free ? 'رایگان ' : '') + 'پیدا شد' + (state.genre ? ' در سبک «' + FP.esc(state.genre) + '»' : '') + (state.q ? ' برای «<bdi>' + FP.esc(state.q) + '</bdi>»' : '');
    FP.$('#resetBtn').hidden = !(state.q || state.genre || state.free || state.sort !== 'new');
    var empty = '<div class="empty" style="grid-column:1/-1">' + FP.icon.search + '<p>چیزی پیدا نشد. عبارت دیگری را امتحان کن یا فیلترها را پاک کن.</p></div>';
    FP.renderGrid(grid, list, { sk: Math.max(4, Math.min(list.length, 8)), delay: animate ? 260 : 500, empty: empty });
    syncUrl();
  }

  var t;
  qEl.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { state.q = qEl.value.trim(); apply(true); }, 220); });
  sortEl.addEventListener('change', function () { state.sort = sortEl.value; apply(true); });
  FP.$('#resetBtn').addEventListener('click', function () { state = { q: '', genre: '', sort: 'new', free: false }; qEl.value = ''; sortEl.value = 'new'; chips(); apply(true); qEl.focus(); });

  chips(); apply(false);
})();
