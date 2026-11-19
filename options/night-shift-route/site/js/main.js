/* Withholden homepage interactions. No dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
    return null;
  }

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('.theme-toggle');
  function syncThemeLabel() {
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#151b2b' : '#f4f6fa');
  }
  if (themeBtn) {
    syncThemeLabel();
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('wh-theme', next);
      syncThemeLabel();
    });
  }

  /* ---------- Nav backdrop on scroll ---------- */
  var nav = document.getElementById('nav');
  // Backdrop appears once the 40px top sentinel leaves the viewport (no scroll listener).
  var atTop = true;
  function onScroll() { nav.classList.toggle('is-scrolled', !atTop); }
  var sentinel = document.getElementById('top-sentinel');
  if ('IntersectionObserver' in window && sentinel) {
    new IntersectionObserver(function (entries) {
      atTop = entries[0].isIntersecting;
      if (!menu || !menu.classList.contains('is-open')) onScroll();
    }).observe(sentinel);
  }

  /* ---------- Active section indicator ---------- */
  var spyLinks = document.querySelectorAll('[data-spy]');
  var spyIds = ['how-it-works', 'pricing', 'faq'];
  if ('IntersectionObserver' in window) {
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var current = null;
      spyIds.forEach(function (id) { if (visible[id] && !current) current = id; });
      spyLinks.forEach(function (a) {
        var on = a.getAttribute('data-spy') === current;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    spyIds.forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
    if (open) nav.classList.add('is-scrolled'); else onScroll();
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }

  /* ---------- Language selector ---------- */
  // Records the visitor's choice and mirrors it in every selector on the page.
  // Wire 'wh-lang' to the site's existing i18n routing when implementing.
  var langBtn = document.getElementById('lang-btn');
  var langMenu = document.getElementById('lang-menu');
  var langLabel = document.querySelector('[data-lang-current]');
  function setLangMenu(open) {
    langBtn.setAttribute('aria-expanded', String(open));
    langMenu.classList.toggle('is-open', open);
    if (open) { var sel = langMenu.querySelector('[aria-checked="true"]'); if (sel) sel.focus(); }
  }
  function chooseLang(code) {
    var label = null;
    document.querySelectorAll('.lang-option[data-lang]').forEach(function (opt) {
      var on = opt.getAttribute('data-lang') === code;
      opt.setAttribute('aria-checked', String(on));
      if (on && !label) label = opt.textContent.trim();
    });
    if (label && langLabel) langLabel.textContent = label;
    store('wh-lang', code);
  }
  var savedLang = store('wh-lang');
  if (savedLang) chooseLang(savedLang);
  if (langBtn && langMenu) {
    langBtn.addEventListener('click', function (e) { e.stopPropagation(); setLangMenu(langBtn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('click', function (e) { if (!langMenu.contains(e.target)) setLangMenu(false); });
    langMenu.addEventListener('keydown', function (e) {
      var items = Array.prototype.slice.call(langMenu.querySelectorAll('.lang-option'));
      var i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      if (e.key === 'Escape') { setLangMenu(false); langBtn.focus(); }
    });
  }
  document.querySelectorAll('.lang-option[data-lang]').forEach(function (opt) {
    opt.addEventListener('click', function () {
      chooseLang(opt.getAttribute('data-lang'));
      if (langMenu && langMenu.contains(opt)) { setLangMenu(false); langBtn.focus(); }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- Scroll reveals ---------- */
  var reveals = document.querySelectorAll('.reveal, .route, .fork');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Balance count-up (sample figure, once) ---------- */
  var bal = document.querySelector('[data-count]');
  if (bal && !reduceMotion && window.requestAnimationFrame) {
    var target = parseFloat(bal.getAttribute('data-count'));
    var start = null, delay = 700, dur = 1400;
    var fmt = function (v) {
      var whole = Math.floor(v), cents = Math.round((v - whole) * 100);
      if (cents === 100) { whole += 1; cents = 0; }
      return '$' + whole.toLocaleString('en-US') + '<small>.' + String(cents).padStart(2, '0') + '</small>';
    };
    bal.innerHTML = fmt(0);
    var step = function (t) {
      if (start === null) start = t;
      var p = Math.min(Math.max((t - start - delay) / dur, 0), 1);
      var eased = 1 - Math.pow(1 - p, 4);
      bal.innerHTML = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step); else bal.innerHTML = fmt(target);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Cookie notice ---------- */
  var cookie = document.getElementById('cookie');
  var manage = document.getElementById('cookie-manage');
  var manageBtn = cookie && cookie.querySelector('[data-cookie="manage"]');
  var analytics = document.getElementById('pref-analytics');
  function openCookie(showManage) {
    cookie.classList.add('is-open');
    cookie.setAttribute('aria-hidden', 'false');
    if (showManage) { manage.hidden = false; manageBtn.setAttribute('aria-expanded', 'true'); manageBtn.textContent = 'Save choices'; }
  }
  function closeCookie(choice) {
    store('wh-consent', choice);
    cookie.classList.remove('is-open');
    cookie.setAttribute('aria-hidden', 'true');
  }
  if (cookie) {
    var consent = store('wh-consent');
    if (analytics) analytics.checked = consent === 'all';
    if (!consent) setTimeout(function () { openCookie(false); }, 1600);
    cookie.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') closeCookie('all');
      if (act === 'reject') closeCookie('necessary');
      if (act === 'manage') {
        if (manage.hidden) { openCookie(true); }
        else { closeCookie(analytics && analytics.checked ? 'all' : 'necessary'); }
      }
    });
    document.querySelectorAll('[data-cookie-open]').forEach(function (b) {
      b.addEventListener('click', function () { openCookie(true); });
    });
  }
})();
