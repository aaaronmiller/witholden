/* Withholden homepage interactions. No dependencies. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('[data-theme-toggle]');
  function syncThemeLabel() {
    var dark = doc.getAttribute('data-theme') === 'dark';
    if (themeBtn) themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  syncThemeLabel();
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      doc.setAttribute('data-theme', next);
      store.set('wh-theme', next);
      syncThemeLabel();
    });
  }

  /* ---------- Nav backdrop on scroll (sentinel, no scroll handler) ---------- */
  var head = document.getElementById('site-head');
  if (head && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      head.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    });
    // Observe a 1px marker pinned to the document top, not to the fixed header.
    var marker = document.createElement('div');
    marker.setAttribute('aria-hidden', 'true');
    marker.style.cssText = 'position:absolute;top:48px;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.prepend(marker);
    sio.observe(marker);
  }

  /* ---------- Active section indicator ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link[data-section]'));
  var ind = document.querySelector('.nav__ind');
  function moveIndicator(link) {
    if (!ind) return;
    if (!link) { ind.classList.remove('is-on'); return; }
    var parentBox = link.parentElement.parentElement.getBoundingClientRect();
    var box = link.getBoundingClientRect();
    ind.style.width = Math.max(0, box.width - 24) + 'px';
    ind.style.transform = 'translateX(' + (box.left - parentBox.left + 12) + 'px)';
    ind.classList.add('is-on');
  }
  if (links.length && 'IntersectionObserver' in window) {
    var visible = {};
    var sections = links.map(function (l) { return document.getElementById(l.getAttribute('data-section')); }).filter(Boolean);
    var aio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var current = null;
      sections.forEach(function (s) { if (visible[s.id] && !current) current = s.id; });
      links.forEach(function (l) {
        var on = l.getAttribute('data-section') === current;
        if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
      moveIndicator(links.filter(function (l) { return l.getAttribute('data-section') === current; })[0]);
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { aio.observe(s); });
    window.addEventListener('resize', function () {
      moveIndicator(document.querySelector('.nav__link[aria-current="true"]'));
    }, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobile-menu');
  var lastFocus = null;
  function openMenu() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    menu.classList.remove('is-closing');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    head.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var first = menu.querySelector('a, button');
    if (first) first.focus();
  }
  function closeMenu(returnFocus) {
    if (menu.hidden) return;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    head.classList.remove('is-open');
    document.body.style.overflow = '';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { menu.hidden = true; }
    else {
      menu.classList.add('is-closing');
      setTimeout(function () { menu.hidden = true; menu.classList.remove('is-closing'); }, 190);
    }
    if (returnFocus !== false && burger) burger.focus();
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      if (burger.getAttribute('aria-expanded') === 'true') closeMenu(); else openMenu();
    });
    menu.addEventListener('click', function (e) {
      if (e.target === menu) closeMenu();
      if (e.target.closest('a')) closeMenu(false);
    });
  }

  /* ---------- Language selector ---------- */
  var langBtn = document.querySelector('.lang__btn');
  var langPop = document.getElementById('lang-pop');
  var NAMES = { en: 'English', pa: 'Punjabi', bn: 'Bengali', th: 'Thai', es: 'Spanish' };
  function setLang(code) {
    document.querySelectorAll('.lang__opt').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === code ? 'true' : 'false');
    });
    var cur = document.querySelector('.lang__cur');
    if (cur) cur.textContent = code.toUpperCase();
    if (langBtn) langBtn.setAttribute('aria-label', 'Language: ' + (NAMES[code] || code));
    store.set('wh-lang', code);
    // Translation wiring belongs to the production app (locale routing or cookie).
  }
  var savedLang = store.get('wh-lang');
  if (savedLang && NAMES[savedLang]) setLang(savedLang);
  document.addEventListener('click', function (e) {
    var opt = e.target.closest('.lang__opt');
    if (opt) { setLang(opt.getAttribute('data-lang')); if (langPop && langPop.contains(opt)) closeLang(true); }
  });
  function openLang() { langPop.hidden = false; langBtn.setAttribute('aria-expanded', 'true'); var sel = langPop.querySelector('[aria-pressed="true"]'); if (sel) sel.focus(); }
  function closeLang(focusBtn) { if (langPop.hidden) return; langPop.hidden = true; langBtn.setAttribute('aria-expanded', 'false'); if (focusBtn) langBtn.focus(); }
  if (langBtn && langPop) {
    langBtn.addEventListener('click', function () { if (langPop.hidden) openLang(); else closeLang(); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.lang')) closeLang(); });
  }

  /* ---------- Escape closes whatever is open ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (menu && !menu.hidden) closeMenu();
    if (langPop && !langPop.hidden) closeLang(true);
  });

  /* ---------- Scroll reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { rio.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- The split (sample payout demo) ---------- */
  var rate = document.getElementById('rate');
  if (rate) {
    var PAYOUT = 612.40;
    var out = document.getElementById('rate-out');
    var keepEl = document.querySelector('[data-keep]');
    var taxEl = document.querySelector('[data-tax]');
    var keepBar = document.querySelector('.split__keep');
    var taxBar = document.querySelector('.split__tax');
    var fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    function update() {
      var pct = Number(rate.value);
      var tax = Math.round(PAYOUT * pct) / 100;
      var keep = Math.round((PAYOUT - tax) * 100) / 100;
      out.textContent = pct + '%';
      taxEl.textContent = fmt.format(tax);
      keepEl.textContent = fmt.format(keep);
      taxBar.style.flexGrow = String(pct);
      keepBar.style.flexGrow = String(100 - pct);
      var fill = ((pct - Number(rate.min)) / (Number(rate.max) - Number(rate.min))) * 100;
      rate.style.setProperty('--fill', fill + '%');
      rate.setAttribute('aria-valuetext', pct + ' percent: ' + fmt.format(tax) + ' to tax savings, ' + fmt.format(keep) + ' yours to spend');
    }
    rate.addEventListener('input', update);
    update();
  }

  /* ---------- Cookie consent ---------- */
  var cookie = document.getElementById('cookie');
  var manageBox = document.getElementById('cookie-manage');
  var analytics = document.getElementById('cookie-analytics');
  function showCookie() {
    if (!cookie || !cookie.hidden) return;
    cookie.hidden = false;
    cookie.classList.add('is-entering');
    requestAnimationFrame(function () { requestAnimationFrame(function () { cookie.classList.remove('is-entering'); }); });
  }
  function saveConsent(value) {
    store.set('wh-consent', value);
    cookie.hidden = true;
    if (manageBox) manageBox.hidden = true;
  }
  if (cookie) {
    var consent = store.get('wh-consent');
    if (!consent) {
      // Appears once the visitor scrolls past the hero, so the first screen stays clear.
      var firstSection = document.getElementById('problem');
      if (firstSection && 'IntersectionObserver' in window) {
        var cio = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { showCookie(); cio.disconnect(); }
        });
        cio.observe(firstSection);
      } else { showCookie(); }
    }
    cookie.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') saveConsent('all');
      else if (act === 'reject') saveConsent('necessary');
      else if (act === 'manage') {
        if (manageBox.hidden) {
          manageBox.hidden = false;
          b.setAttribute('aria-expanded', 'true');
          b.textContent = 'Save choices';
        } else {
          saveConsent(analytics && analytics.checked ? 'all' : 'necessary');
          b.setAttribute('aria-expanded', 'false');
          b.textContent = 'Manage';
        }
      }
    });
    document.querySelectorAll('[data-cookie-open]').forEach(function (b) {
      b.addEventListener('click', function () { cookie.hidden = true; showCookie(); var f = cookie.querySelector('button'); if (f) f.focus(); });
    });
    document.querySelectorAll('[data-cookie-optout]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (analytics) analytics.checked = false;
        cookie.hidden = true; showCookie();
        if (manageBox) { manageBox.hidden = false; }
        var m = cookie.querySelector('[data-cookie="manage"]');
        if (m) { m.setAttribute('aria-expanded', 'true'); m.textContent = 'Save choices'; m.focus(); }
      });
    });
  }
})();
