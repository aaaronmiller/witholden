/* Withholden homepage interactions. No dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { /* storage unavailable: keep working without it */ }
    return null;
  }

  /* ---------- Theme toggle ---------- */
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('wh-theme', next);
    });
  });

  /* ---------- Nav backdrop on scroll ---------- */
  var nav = document.getElementById('nav');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active section indicator ---------- */
  var spyLinks = document.querySelectorAll('[data-spy]');
  if ('IntersectionObserver' in window && spyLinks.length) {
    var current = null;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) current = entry.target.id;
        else if (current === entry.target.id) current = null;
      });
      spyLinks.forEach(function (link) {
        var on = link.getAttribute('data-spy') === current;
        link.classList.toggle('is-active', on);
        if (on) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spyLinks.forEach(function (link) {
      var target = document.getElementById(link.getAttribute('data-spy'));
      if (target) spy.observe(target);
    });
  }

  /* ---------- Popovers: language menu and mobile menu ---------- */
  var langBtn = document.querySelector('.lang__btn');
  var langMenu = document.getElementById('lang-menu');
  var menuBtn = document.querySelector('.menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');

  function setOpen(btn, panel, open) {
    if (!btn || !panel) return;
    btn.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    if (btn === menuBtn) btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (langBtn) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(langBtn, langMenu, langBtn.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(menuBtn, mobileMenu, menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(menuBtn, mobileMenu, false); });
    });
  }
  document.addEventListener('click', function (e) {
    if (langMenu && !langMenu.contains(e.target)) setOpen(langBtn, langMenu, false);
    if (mobileMenu && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) setOpen(menuBtn, mobileMenu, false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (langBtn && langBtn.getAttribute('aria-expanded') === 'true') { setOpen(langBtn, langMenu, false); langBtn.focus(); }
    if (menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') { setOpen(menuBtn, mobileMenu, false); menuBtn.focus(); }
  });

  /* ---------- Language preference ----------
     Records the visitor's choice and marks it in every selector. Wiring each language to its
     translated page is left to the live site's existing locale mechanism. */
  var langNames = { en: 'English', pa: 'ਪੰਜਾਬੀ', bn: 'বাংলা', th: 'ไทย', es: 'Español' };
  function markLang(code) {
    if (!langNames[code]) code = 'en';
    document.querySelectorAll('[data-lang]').forEach(function (opt) {
      if (opt.getAttribute('data-lang') === code) opt.setAttribute('aria-current', 'true');
      else opt.removeAttribute('aria-current');
    });
    var label = document.querySelector('[data-lang-label]');
    if (label) { label.textContent = langNames[code]; label.setAttribute('lang', code); }
  }
  markLang(store('wh-lang') || 'en');
  document.querySelectorAll('[data-lang]').forEach(function (opt) {
    opt.addEventListener('click', function () {
      var code = opt.getAttribute('data-lang');
      store('wh-lang', code);
      markLang(code);
      setOpen(langBtn, langMenu, false);
    });
  });

  /* ---------- Scroll reveals ---------- */
  var revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-group], [data-lane], [data-ledger]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach(function (el) { revealer.observe(el); });
  }

  /* ---------- The meter: payouts arrive and their set-aside slice joins the account ---------- */
  var meter = document.getElementById('meter');
  if (meter && !reduceMotion && meter.animate) {
    var balanceEl = meter.querySelector('.meter__balance');
    var dollarsEl = meter.querySelector('[data-dollars]');
    var centsEl = meter.querySelector('[data-cents]');
    var pctEl = meter.querySelector('[data-pct]');
    var fill = meter.querySelector('[data-fill]');
    var rows = Array.prototype.slice.call(meter.querySelectorAll('.deposit')).reverse();
    var finalBalance = parseFloat(balanceEl.getAttribute('data-balance'));
    var finalPct = 72;
    var totalSaved = rows.reduce(function (sum, r) { return sum + parseFloat(r.getAttribute('data-saved')); }, 0);
    var balance = finalBalance - totalSaved;

    function paint(value) {
      var whole = Math.floor(value + 1e-6);
      var cents = Math.round((value - whole) * 100);
      dollarsEl.textContent = '$' + whole.toLocaleString('en-US');
      centsEl.textContent = '.' + String(cents).padStart(2, '0');
      var pct = finalPct * value / finalBalance;
      pctEl.textContent = String(Math.round(pct));
      fill.style.transform = 'scaleX(' + (pct / finalPct) + ')';
    }
    function tween(from, to, ms, done) {
      var start = performance.now();
      function frame(now) {
        var t = Math.min(1, (now - start) / ms);
        var k = 1 - Math.pow(1 - t, 3);
        paint(from + (to - from) * k);
        if (t < 1) requestAnimationFrame(frame); else if (done) done();
      }
      requestAnimationFrame(frame);
    }

    rows.forEach(function (r) { r.style.opacity = '0'; });
    paint(balance);

    function arrive(i) {
      if (i >= rows.length) { paint(finalBalance); return; }
      var row = rows[i];
      var saved = parseFloat(row.getAttribute('data-saved'));
      row.animate(
        [{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 420, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' }
      );
      row.style.opacity = '';
      var chip = document.createElement('span');
      chip.className = 'chip';
      chip.setAttribute('aria-hidden', 'true');
      chip.textContent = '+$' + saved;
      row.appendChild(chip);
      var from = chip.getBoundingClientRect();
      var to = balanceEl.getBoundingClientRect();
      var dx = to.left + to.width * 0.55 - from.left;
      var dy = to.top + to.height * 0.35 - from.top;
      var flight = chip.animate(
        [
          { transform: 'translate(0, -50%) scale(0.7)', opacity: 0 },
          { transform: 'translate(0, -50%) scale(1)', opacity: 1, offset: 0.22 },
          { transform: 'translate(' + dx + 'px, ' + (dy - 6) + 'px) scale(0.85)', opacity: 1, offset: 0.85 },
          { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0.6)', opacity: 0 }
        ],
        { duration: 1050, delay: 260, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' }
      );
      flight.onfinish = function () {
        chip.remove();
        var next = balance + saved;
        tween(balance, next, 420);
        balance = next;
        balanceEl.animate([{ textShadow: '0 0 0 transparent' }, { textShadow: '0 0 22px oklch(0.8 0.15 70 / 0.9)' }, { textShadow: '0 0 0 transparent' }], { duration: 600 });
        setTimeout(function () { arrive(i + 1); }, 260);
      };
    }
    setTimeout(function () { arrive(0); }, 1100);
  }

  /* ---------- Cookie notice ---------- */
  var cookie = document.getElementById('cookie');
  var prefs = document.getElementById('cookie-prefs');
  var analytics = document.getElementById('cookie-analytics');
  var manageBtn = cookie && cookie.querySelector('[data-cookie="manage"]');
  function openCookie() { cookie.classList.add('is-open'); }
  function closeCookie(choice) {
    store('wh-cookie', choice);
    cookie.classList.remove('is-open');
  }
  if (cookie) {
    var saved = store('wh-cookie');
    if (analytics) analytics.checked = saved === 'all';
    if (!saved) setTimeout(openCookie, 1600);
    cookie.querySelector('[data-cookie="reject"]').addEventListener('click', function () { closeCookie('necessary'); });
    cookie.querySelector('[data-cookie="accept"]').addEventListener('click', function () {
      var choice = prefs.hidden ? 'all' : (analytics.checked ? 'all' : 'necessary');
      closeCookie(choice);
    });
    manageBtn.addEventListener('click', function () {
      prefs.hidden = !prefs.hidden;
      manageBtn.setAttribute('aria-expanded', String(!prefs.hidden));
      cookie.querySelector('[data-cookie="accept"]').textContent = prefs.hidden ? 'Accept all' : 'Save choices';
    });
    document.querySelectorAll('[data-cookie-open]').forEach(function (b) {
      b.addEventListener('click', function () {
        openCookie();
        cookie.querySelector('button').focus();
      });
    });
  }
})();
