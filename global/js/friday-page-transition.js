(function () {
  'use strict';

  // ── Config ─────────────────────────────────────────────────────────────────
  var DURATION = 0.5;
  var EASE     = 'power2.inOut';

  // ── Overlay ────────────────────────────────────────────────────────────────
  // Styled in <head> CSS so it covers the page before JS runs (prevents flash).
  var overlay = document.getElementById('page-transition');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'page-transition';
    document.body.appendChild(overlay);
  }

  var NAV_FLAG = 'friday_internal_nav';

  function isHomePage() {
    var p = window.location.pathname;
    return p === '/' || p === '/index' || p === '/index.html';
  }

  var SKIP_FLAG = 'friday_skip_enter';

  function shouldSkipEnter() {
    // Skip if loader is active this load
    if (sessionStorage.getItem(SKIP_FLAG)) return true;
    // Skip if fresh visit to home page (no internal nav flag)
    return isHomePage() && !sessionStorage.getItem(NAV_FLAG);
  }

  // ── Enter: overlay slides up off screen ────────────────────────────────────
  function playEnter() {
    if (shouldSkipEnter()) {
      gsap.set(overlay, { yPercent: -100, pointerEvents: 'none' });
      return;
    }
    sessionStorage.removeItem(NAV_FLAG);
    gsap.fromTo(overlay,
      { yPercent: 0 },
      { yPercent: -100, duration: DURATION, ease: EASE, pointerEvents: 'none' }
    );
  }

  // ── Leave: overlay slides up from below to cover screen, then navigates ────
  function playLeave(destination, instant) {
    sessionStorage.setItem(NAV_FLAG, '1');
    if (instant) {
      // Instantly cover screen so menu close animation is hidden underneath
      gsap.set(overlay, { yPercent: 0 });
      setTimeout(function () {
        window.location.href = destination;
      }, 100);
      return;
    }
    gsap.fromTo(overlay,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: DURATION,
        ease:     EASE,
        onComplete: function () {
          window.location.href = destination;
        }
      }
    );
  }

  // ── Page load ──────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', playEnter);

  // ── Back / Forward button (bfcache restore) ────────────────────────────────
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) playEnter();
  });

  // ── Link clicks ────────────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#')) return;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank') return;
    if (link.hostname !== window.location.hostname) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    playLeave(link.href, link.hasAttribute('data-nav-link'));
  });
})();
