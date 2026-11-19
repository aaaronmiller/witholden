/* Withholden homepage behaviour: theme, nav, menu, language, reveals, cookie choices. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
    return null;
  }

  /* ---------- theme toggle (light first, OS setting respected until the visitor chooses) */
  var toggle = document.querySelector('[data-theme-toggle]');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  function isDark() {
    var t = doc.getAttribute('data-theme');
    return t ? t === 'dark' : darkQuery.matches;
  }
  function syncToggle() {
    if (toggle) toggle.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      doc.setAttribute('data-theme', next);
      store('withholden-theme', next);
      syncToggle();
    });
  }
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', syncToggle);
  syncToggle();

  /* ---------- nav backdrop once the page leaves the top (observer, no scroll listener) */
  var header = document.querySelector('[data-header]');
  var atTop = true;
  function onScroll() { header.classList.toggle('is-scrolled', !atTop); }
  new IntersectionObserver(function (entries) {
    atTop = entries[0].isIntersecting;
    if (!document.querySelector('[data-menu].is-open')) onScroll();
  }).observe(document.querySelector('[data-scroll-sentinel]'));

  /* ---------- mobile menu: toggle, Escape, outside click, link click */
  var menuBtn = document.querySelector('[data-menu-btn]');
  var menu = document.querySelector('[data-menu]');
  function setMenu(open, returnFocus) {
    menu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      header.classList.add('is-scrolled');
      var first = menu.querySelector('a, button');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 30);
    } else {
      onScroll();
      if (returnFocus) menuBtn.focus();
    }
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true', false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false, true); }
  });
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('is-open') && !menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false, false);
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false, false); }); });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', function (m) { if (m.matches) setMenu(false, false); });

  /* ---------- language: one choice, mirrored in every visible selector.
     The live site switches copy client-side; wire `withholden:language` to that loader. */
  var langButtons = document.querySelectorAll('[data-lang]');
  function setLang(code, announce) {
    langButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === code)); });
    store('withholden-lang', code);
    if (announce) document.dispatchEvent(new CustomEvent('withholden:language', { detail: { lang: code } }));
  }
  langButtons.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
  });
  var savedLang = store('withholden-lang');
  if (savedLang && document.querySelector('[data-lang="' + savedLang + '"]')) setLang(savedLang, false);

  /* ---------- active section indicator: the section crossing a line 35% down the viewport */
  var spyLinks = document.querySelectorAll('[data-spy]');
  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var link = document.querySelector('[data-spy="' + en.target.id + '"]');
      if (!link) return;
      if (en.isIntersecting) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-35% 0px -64% 0px', threshold: 0 });
  spyLinks.forEach(function (l) { var t = document.getElementById(l.getAttribute('data-spy')); if (t) spyObserver.observe(t); });

  /* ---------- hero entrance: copy settles, then the sample ledger is written row by row */
  var heroCopy = document.querySelector('[data-hero-copy]');
  var sheet = document.querySelector('[data-sheet]');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroCopy.classList.add('is-in');
      sheet.classList.add('is-written');
      countUp(sheet.querySelector('[data-count]'));
    });
  });

  function countUp(el) {
    if (!el || reduceMotion) return;
    var target = parseFloat(el.getAttribute('data-count'));
    var start = null; var dur = 1500; var delay = 300;
    function fmt(v) {
      var whole = Math.floor(v); var cents = Math.round((v - whole) * 100);
      if (cents === 100) { whole += 1; cents = 0; }
      return '$' + whole.toLocaleString('en-US') + '<span class="cents">.' + String(cents).padStart(2, '0') + '</span>';
    }
    var finalHTML = el.innerHTML;
    function frame(ts) {
      if (start === null) start = ts + delay;
      var t = Math.min(Math.max((ts - start) / dur, 0), 1);
      var eased = 1 - Math.pow(1 - t, 4);
      el.innerHTML = fmt(target * eased);
      if (t < 1) requestAnimationFrame(frame); else el.innerHTML = finalHTML;
    }
    requestAnimationFrame(frame);
  }

  /* ---------- scroll reveals (each section uses its own motion: fade-blur, wipe, draw) */
  /* A clip-path wipe hides its own box from IntersectionObserver, so wipes are
     triggered by their parent list instead of by themselves. */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal, [data-steps], [data-split]'));
  document.querySelectorAll('.wipe').forEach(function (w) {
    var p = w.parentElement;
    if (revealables.indexOf(p) === -1) { p.setAttribute('data-wipe-group', ''); revealables.push(p); }
  });
  function reveal(el) {
    el.classList.add('is-in');
    if (el.hasAttribute('data-wipe-group')) el.querySelectorAll('.wipe').forEach(function (w) { w.classList.add('is-in'); });
  }
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(reveal);
  }
  if (reduceMotion) {
    document.querySelectorAll('.split-svg animateMotion').forEach(function (a) { a.parentNode.remove(); });
  }

  /* ---------- cookie choices (same words and choices as the live banner) */
  var cookie = document.querySelector('[data-cookie]');
  var prefs = cookie.querySelector('[data-cookie-prefs]');
  var manageBtn = cookie.querySelector('[data-cookie-manage]');
  var analyticsBox = cookie.querySelector('[data-cookie-analytics]');
  function openCookie(showPrefs) {
    cookie.hidden = false;
    cookie.classList.remove('is-leaving');
    var saved = store('withholden-cookies');
    analyticsBox.checked = saved === 'accept';
    if (showPrefs) { prefs.hidden = false; manageBtn.setAttribute('aria-expanded', 'true'); manageBtn.textContent = 'Save choices'; }
  }
  function closeCookie(choice) {
    store('withholden-cookies', choice);
    document.dispatchEvent(new CustomEvent('withholden:cookies', { detail: { analytics: choice === 'accept' } }));
    cookie.classList.add('is-leaving');
    setTimeout(function () { cookie.hidden = true; prefs.hidden = true; manageBtn.textContent = 'Manage'; manageBtn.setAttribute('aria-expanded', 'false'); }, 200);
  }
  cookie.querySelectorAll('[data-cookie-choice]').forEach(function (b) {
    b.addEventListener('click', function () { closeCookie(b.getAttribute('data-cookie-choice')); });
  });
  manageBtn.addEventListener('click', function () {
    if (prefs.hidden) { openCookie(true); analyticsBox.focus(); }
    else closeCookie(analyticsBox.checked ? 'accept' : 'reject');
  });
  document.querySelector('[data-cookie-open]').addEventListener('click', function () { openCookie(true); });
  document.querySelector('[data-cookie-optout]').addEventListener('click', function () {
    openCookie(true); analyticsBox.checked = false; analyticsBox.focus();
  });
  if (!store('withholden-cookies')) openCookie(false);
})();
