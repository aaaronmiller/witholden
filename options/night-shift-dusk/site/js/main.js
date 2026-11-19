/* Withholden homepage interactions. No dependencies. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
    return value;
  }

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('[data-theme-toggle]');
  function syncThemeLabel() {
    var t = doc.getAttribute('data-theme');
    if (themeBtn) themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  syncThemeLabel();
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      doc.setAttribute('data-theme', next);
      store('wh-theme', next);
      syncThemeLabel();
    });
  }

  /* ---------- Nav backdrop on scroll ---------- */
  var nav = document.querySelector('[data-nav]');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
      updateRoute();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('[data-burger]');
  var menu = document.querySelector('[data-mobile-menu]');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    nav.classList.toggle('is-scrolled', open || window.scrollY > 40);
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
  });

  /* ---------- Language selector ---------- */
  var LANGS = { en: 'English', pa: 'ਪੰਜਾਬੀ', bn: 'বাংলা', th: 'ไทย', es: 'Español' };
  var lang = document.querySelector('[data-lang]');
  var langBtn = lang.querySelector('.lang__btn');
  function setLangOpen(open) {
    lang.classList.toggle('is-open', open);
    langBtn.setAttribute('aria-expanded', String(open));
    if (open) { var sel = lang.querySelector('[aria-selected="true"]'); if (sel) sel.focus(); }
  }
  function chooseLang(code) {
    if (!LANGS[code]) return;
    store('wh-lang', code);
    document.querySelectorAll('[data-lang-option]').forEach(function (el) {
      var on = el.getAttribute('data-lang-option') === code;
      if (el.getAttribute('role') === 'option') el.setAttribute('aria-selected', String(on));
      else el.setAttribute('aria-pressed', String(on));
    });
    lang.querySelector('[data-lang-current]').textContent = LANGS[code];
    lang.querySelector('[data-lang-code]').textContent = code.toUpperCase();
    langBtn.setAttribute('aria-label', 'Language: ' + LANGS[code]);
    /* Integration point: the live site's locale switch goes here. */
    document.dispatchEvent(new CustomEvent('withholden:language', { detail: { lang: code } }));
  }
  langBtn.addEventListener('click', function (e) { e.stopPropagation(); setLangOpen(!lang.classList.contains('is-open')); });
  document.addEventListener('click', function (e) {
    var opt = e.target.closest('[data-lang-option]');
    if (opt) { chooseLang(opt.getAttribute('data-lang-option')); setLangOpen(false); return; }
    if (!lang.contains(e.target)) setLangOpen(false);
  });
  lang.addEventListener('keydown', function (e) {
    var opts = Array.prototype.slice.call(lang.querySelectorAll('[role="option"]'));
    var i = opts.indexOf(document.activeElement);
    if (e.key === 'Escape') { setLangOpen(false); langBtn.focus(); }
    else if (e.key === 'ArrowDown' && i > -1) { e.preventDefault(); opts[(i + 1) % opts.length].focus(); }
    else if (e.key === 'ArrowUp' && i > -1) { e.preventDefault(); opts[(i - 1 + opts.length) % opts.length].focus(); }
    else if ((e.key === 'Enter' || e.key === ' ') && i > -1) { e.preventDefault(); chooseLang(opts[i].getAttribute('data-lang-option')); setLangOpen(false); langBtn.focus(); }
  });
  var savedLang = store('wh-lang');
  if (savedLang && LANGS[savedLang]) chooseLang(savedLang);

  /* ---------- Active section indicator ---------- */
  var links = document.querySelectorAll('[data-section-link]');
  var sections = ['how-it-works', 'pricing', 'faq'].map(function (id) { return document.getElementById(id); });
  if ('IntersectionObserver' in window) {
    var visible = {};
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var current = null;
      sections.forEach(function (s) { if (visible[s.id]) current = current || s.id; });
      links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-section-link') === current); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { so.observe(s); });
  }

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-side, .reveal-blur, .reveal-clip, .payline');
  if ('IntersectionObserver' in window && !reduceMotion) {
    /* Clip-path reveals start fully clipped, which IntersectionObserver
       reports as not visible, so those are triggered by their parent. */
    var targets = new Map();
    revealEls.forEach(function (el) {
      var t = el.classList.contains('reveal-clip') ? el.parentElement : el;
      if (!targets.has(t)) targets.set(t, []);
      targets.get(t).push(el);
    });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        targets.get(en.target).forEach(function (el) {
          var idx = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
          el.style.transitionDelay = Math.min(idx, 6) * 70 + 'ms';
          el.classList.add('is-in');
        });
        ro.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (_, t) { ro.observe(t); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Route progress (How it works) ---------- */
  var route = document.querySelector('[data-route]');
  var routeFill = document.querySelector('[data-route-fill]');
  var stops = route ? route.querySelectorAll('.stop') : [];
  function updateRoute() {
    if (!route) return;
    var r = route.getBoundingClientRect();
    var mark = window.innerHeight * 0.62;
    var p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
    routeFill.parentElement.style.setProperty('--route', p.toFixed(3));
    stops.forEach(function (s) {
      var pin = s.querySelector('.stop__pin').getBoundingClientRect();
      s.classList.toggle('is-passed', pin.top + pin.height / 2 < mark);
    });
  }
  updateRoute();
  onScroll();

  /* ---------- Hero balance count-up ---------- */
  var counter = document.querySelector('[data-count]');
  if (counter && !reduceMotion) {
    var target = parseFloat(counter.getAttribute('data-count'));
    var fmt = function (v) { return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    var start = null;
    var dur = 1600;
    counter.textContent = fmt(0);
    setTimeout(function () {
      requestAnimationFrame(function step(ts) {
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - t, 4);
        counter.textContent = fmt(target * eased);
        if (t < 1) requestAnimationFrame(step);
      });
    }, 650);
  }

  /* ---------- Cookie notice ---------- */
  var cookie = document.querySelector('[data-cookie]');
  var panel = cookie.querySelector('[data-cookie-panel]');
  var manageBtn = cookie.querySelector('[data-cookie-toggle]');
  var analytics = cookie.querySelector('[data-cookie-analytics]');
  function closeCookie(choice) {
    store('wh-cookie', choice);
    /* Integration point: load or block optional analytics based on `choice`. */
    if (reduceMotion) { cookie.hidden = true; return; }
    cookie.classList.add('is-leaving');
    setTimeout(function () { cookie.hidden = true; cookie.classList.remove('is-leaving'); }, 220);
  }
  function openCookie(manage) {
    cookie.hidden = false;
    panel.hidden = !manage;
    manageBtn.textContent = manage ? 'Save choices' : 'Manage';
    analytics.checked = store('wh-cookie') === 'accept';
  }
  if (!store('wh-cookie')) cookie.hidden = false;
  cookie.querySelectorAll('[data-cookie-choice]').forEach(function (b) {
    b.addEventListener('click', function () { closeCookie(b.getAttribute('data-cookie-choice')); });
  });
  manageBtn.addEventListener('click', function () {
    if (panel.hidden) { openCookie(true); return; }
    closeCookie(analytics.checked ? 'accept' : 'reject');
  });
  document.querySelector('[data-cookie-open]').addEventListener('click', function () { openCookie(false); });
  document.querySelector('[data-cookie-manage]').addEventListener('click', function () { openCookie(true); });
})();
