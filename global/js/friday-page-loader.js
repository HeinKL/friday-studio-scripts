(function () {
  'use strict';

  // ── Config ─────────────────────────────────────────────────────────────────
  var TTL        = 1000 * 60 * 60 * 4; // 4 hours — adjust as needed
  var LOADER_KEY = 'friday_loader_ts';  // localStorage: tracks last visit time
  var SKIP_FLAG  = 'friday_skip_enter'; // sessionStorage: tells transition to skip enter

  // ── Should the loader play? ────────────────────────────────────────────────
  function shouldShowLoader() {
    var last = parseInt(localStorage.getItem(LOADER_KEY) || '0', 10);
    return Date.now() - last > TTL;
  }

  // ── Animation ──────────────────────────────────────────────────────────────
  function playLoader(loader, onDone) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.5,
      delay: 3,
      ease: 'power2.inOut',
      onComplete: onDone,
    });
  }

  function triggerContent() {
    var trigger = document.getElementById('content-trigger');
    if (!trigger) return;
    if (document.readyState === 'complete') {
      trigger.click();
    } else {
      window.addEventListener('load', function () { trigger.click(); }, { once: true });
    }
  }

  function hideLoader(loader) {
    document.body.style.overflow = '';
    gsap.set(loader, { display: 'none' });
    sessionStorage.removeItem(SKIP_FLAG);
    triggerContent();
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var loader = document.getElementById('page-loader');
    if (!loader) return;

    if (!shouldShowLoader()) {
      gsap.set(loader, { display: 'none' });
      triggerContent(); // loader skipped — start content immediately
      return;
    }

    // Record visit time and signal the transition to skip its enter this load
    localStorage.setItem(LOADER_KEY, Date.now().toString());
    sessionStorage.setItem(SKIP_FLAG, '1');

    // Show loader and play animation
    document.body.style.overflow = 'hidden';
    gsap.set(loader, { display: 'block' });
    playLoader(loader, function () {
      hideLoader(loader); // loader done — start content after
    });
  });
})();
