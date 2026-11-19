/* Withholden homepage behaviour: theme, nav, language, reveals, the savings meter, cookies. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
    return null;
  }

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('[data-theme-toggle]');
  function syncThemeLabel() {
    var t = doc.getAttribute('data-theme');
    if (themeBtn) themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      doc.setAttribute('data-theme', next);
      store('wh-theme', next);
      syncThemeLabel();
    });
  }
  syncThemeLabel();

  /* ---------- Nav backdrop once the page leaves the top (no scroll listener) ---------- */
  var nav = document.getElementById('nav');
  var sentinel = document.querySelector('.top-sentinel');
  if ('IntersectionObserver' in window && sentinel) {
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }).observe(sentinel);
  } else {
    nav.classList.add('is-scrolled');
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('[data-burger]');
  var menu = document.querySelector('[data-mobile-menu]');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    nav.classList.toggle('menu-open', open);
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 900 && !menu.hidden) setMenu(false); });
  }

  /* ---------- Active section indicator ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link[data-section]'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var sectionIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          var on = a.getAttribute('data-section') === id;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['problem', 'how-it-works', 'see-it', 'pricing', 'faq'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionIo.observe(el);
    });
    var hero = document.querySelector('.hero');
    if (hero) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) navLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
      }, { threshold: 0.4 }).observe(hero);
    }
  }

  /* ---------- Language selector ----------
     The live site serves translations; this static build records the choice and
     marks it in every selector. Wire the redirect or locale loader here. */
  var LANGS = { en: 'English', pa: 'ਪੰਜਾਬੀ', bn: 'বাংলা', th: 'ไทย', es: 'Español' };
  var langRoot = document.querySelector('[data-lang-root]');
  var langBtn = document.querySelector('[data-lang-btn]');
  var langList = document.querySelector('[data-lang-list]');
  var langCurrent = document.querySelector('[data-lang-current]');

  function applyLang(code) {
    if (!LANGS[code]) return;
    langCurrent.textContent = LANGS[code];
    langCurrent.setAttribute('lang', code);
    document.querySelectorAll('[data-lang-list] [data-lang]').forEach(function (li) {
      li.setAttribute('aria-selected', String(li.getAttribute('data-lang') === code));
    });
    document.querySelectorAll('button[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === code));
    });
    store('wh-lang', code);
  }
  function setLangOpen(open) {
    langRoot.classList.toggle('is-open', open);
    langBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      var sel = langList.querySelector('[aria-selected="true"]') || langList.querySelector('li');
      sel.focus();
    }
  }
  if (langRoot) {
    langBtn.addEventListener('click', function () { setLangOpen(!langRoot.classList.contains('is-open')); });
    langList.addEventListener('click', function (e) {
      var li = e.target.closest('[data-lang]');
      if (!li) return;
      applyLang(li.getAttribute('data-lang'));
      setLangOpen(false);
      langBtn.focus();
    });
    langList.addEventListener('keydown', function (e) {
      var items = Array.prototype.slice.call(langList.querySelectorAll('li'));
      var i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (items[i]) items[i].click(); }
      else if (e.key === 'Escape' || e.key === 'Tab') { setLangOpen(false); if (e.key === 'Escape') langBtn.focus(); }
    });
    document.addEventListener('click', function (e) { if (!langRoot.contains(e.target)) setLangOpen(false); });
  }
  document.querySelectorAll('button[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });
  var savedLang = store('wh-lang');
  if (savedLang && LANGS[savedLang]) applyLang(savedLang);

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-blur, .reveal-wipe');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var wipeIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.__wipeKids.forEach(function (el, i) {
          el.style.transitionDelay = i * 140 + 'ms';
          el.classList.add('is-visible');
        });
        wipeIo.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    var revealIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var sibs = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [];
        var idx = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = Math.min(idx, 6) * 70 + 'ms';
        el.classList.add('is-visible');
        revealIo.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) {
      /* A clip-path wipe hides the element's own box, which some engines treat as zero
         intersection, so wipes watch a proxy: their parent. */
      if (el.classList.contains('reveal-wipe')) {
        var parent = el.parentElement;
        if (!parent.__wipeKids) { parent.__wipeKids = []; wipeIo.observe(parent); }
        parent.__wipeKids.push(el);
      } else {
        revealIo.observe(el);
      }
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  function onceVisible(el, cls, threshold) {
    if (!el) return;
    if (!('IntersectionObserver' in window) || reduceMotion) { el.classList.add(cls); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { el.classList.add(cls); io.disconnect(); }
    }, { threshold: threshold });
    io.observe(el);
  }
  onceVisible(document.querySelector('[data-route]'), 'is-drawn', 0.3);
  onceVisible(document.querySelector('[data-gauge]'), 'is-on', 0.4);

  /* Pin the docked phone once its entrance ends, so later relayouts never replay it. */
  var phoneEl = document.querySelector('.phone');
  if (phoneEl) phoneEl.addEventListener('animationend', function (e) { if (e.target === phoneEl) phoneEl.classList.add('is-docked'); });

  /* ---------- Savings meter: sample payouts arrive, the balance ticks up ---------- */
  var meter = document.querySelector('[data-meter]');
  if (meter) {
    var balanceEl = meter.querySelector('[data-balance]');
    var centsEl = meter.querySelector('[data-cents]');
    var finalValue = parseFloat(balanceEl.getAttribute('data-final'));
    var deps = Array.prototype.slice.call(meter.querySelectorAll('[data-dep]'));
    var savedTotal = deps.reduce(function (s, d) { return s + parseFloat(d.getAttribute('data-saved')); }, 0);

    function render(v) {
      var whole = Math.floor(v + 1e-6);
      var cents = Math.round((v - whole) * 100);
      balanceEl.textContent = whole.toLocaleString('en-US');
      centsEl.textContent = '.' + String(cents).padStart(2, '0');
    }
    function tween(from, to, ms, done) {
      var start = null;
      function frame(t) {
        if (start === null) start = t;
        var k = Math.min(1, (t - start) / ms);
        var e = 1 - Math.pow(1 - k, 3);
        render(from + (to - from) * e);
        if (k < 1) requestAnimationFrame(frame); else if (done) done();
      }
      requestAnimationFrame(frame);
    }

    if (reduceMotion) {
      render(finalValue);
      deps.forEach(function (d) { d.classList.add('is-in'); });
    } else {
      meter.classList.add('meter-pending');
      var value = finalValue - savedTotal;
      render(value);
      var i = 0;
      var step = function () {
        if (i >= deps.length) { meter.classList.remove('meter-pending'); render(finalValue); return; }
        var d = deps[i];
        var add = parseFloat(d.getAttribute('data-saved'));
        d.classList.add('is-in');
        tween(value, value + add, 650, function () {
          value += add;
          i += 1;
          setTimeout(step, 260);
        });
      };
      setTimeout(step, 1100);
    }
  }

  /* ---------- Cookie consent ---------- */
  var cookie = document.querySelector('[data-cookie]');
  var manageBox = document.querySelector('[data-cookie-manage]');
  var manageBtn = document.querySelector('[data-cookie-manage-btn]');
  var analyticsBox = document.querySelector('[data-cookie-analytics]');
  function closeCookie(choice) {
    store('wh-consent', choice);
    cookie.hidden = true;
  }
  function openCookie(manage) {
    cookie.hidden = false;
    cookie.style.animationDelay = '0ms';
    var saved = store('wh-consent');
    analyticsBox.checked = saved === 'accept' || saved === 'analytics';
    setManage(!!manage);
  }
  function setManage(on) {
    manageBox.hidden = !on;
    manageBtn.textContent = on ? 'Save choices' : 'Manage';
    manageBtn.setAttribute('data-mode', on ? 'save' : 'manage');
  }
  if (cookie) {
    if (!store('wh-consent')) cookie.hidden = false;
    cookie.addEventListener('click', function (e) {
      var choice = e.target.closest('[data-cookie-choice]');
      if (choice) { closeCookie(choice.getAttribute('data-cookie-choice')); return; }
      if (e.target.closest('[data-cookie-manage-btn]')) {
        if (manageBtn.getAttribute('data-mode') === 'save') closeCookie(analyticsBox.checked ? 'analytics' : 'reject');
        else setManage(true);
      }
    });
    document.querySelectorAll('[data-cookie-open]').forEach(function (b) {
      b.addEventListener('click', function () { openCookie(b.getAttribute('data-cookie-open') === 'manage'); });
    });
  }
})();
