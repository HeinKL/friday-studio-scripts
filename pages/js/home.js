  // 1. Fade in feature-work text elements first
  gsap.from('.feature-work-txt-wrapper .feature-work', {
    scrollTrigger: {
      trigger: '.feature-work-txt-wrapper',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 100,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.15, // slight offset between the two text elements
  });

  // 2. Fade in work-list-cards one by one after scrolling into view
  gsap.utils.toArray('.work-list-card').forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      //opacity: 0,
      y: 100,
      duration: 0.65,
      ease: 'power2.out',
    });
  });


gsap.registerPlugin(ScrambleTextPlugin);

const items = Array.from(document.querySelectorAll('[data-scramble-to]'));

items.forEach(el => {
  const original = el.textContent.trim();
  const hoverText = el.dataset.scrambleTo;
  let tween;

  function onEnter() {
    tween && tween.kill();
    tween = gsap.to(el, {
      duration: 0.6,
      scrambleText: { text: hoverText, chars: 'FRIDAY', speed: 0.5 }
    });
    items.forEach(other => {
      if (other !== el) {
        gsap.to(other, { filter: 'blur(4px)', opacity: 0.35, duration: 0.3 });
      }
    });
  }

  function onLeave() {
    tween && tween.kill();
    tween = gsap.to(el, {
      duration: 0.6,
      scrambleText: { text: original, chars: 'upperAndLowerCase', speed: 0.5}
    });
    items.forEach(other => {
      if (other !== el) {
        gsap.to(other, { filter: 'blur(0px)', opacity: 1, duration: 0.3 });
      }
    });
  }

  el.addEventListener('mouseenter', onEnter);
  el.addEventListener('mouseleave', onLeave);

  el.addEventListener('touchstart', (e) => {
    e.preventDefault(); // prevents duplicate mouse events on touch devices
    onEnter();
  }, { passive: false });

  el.addEventListener('touchend', (e) => {
    e.preventDefault();
    onLeave();
  }, { passive: false });
});

  //matter.js
  (function () {
  'use strict';

  // ── Character path data (FRIDAY logo) ──────────────────────────────────────
  const CHARS = [
    { id: 'F',
      d: 'M107.71 110.809H48.8154V179.609H0V0H118.517V36.5306H48.8154V74.157H107.71V110.809Z',
      vbX: 0, vbY: 0, vbW: 118.517, vbH: 179.609 },
    { id: 'R',
      d: 'M132.416 179.818H181.474V125.753H194.442L226.733 180.426H277.249L238.171 116.199C257.233 104.988 268.54 84.9901 268.54 62.0679C268.54 26.755 241.704 0.209489 201.024 0.209489H132.416V179.818ZM181.474 36.74H196.046C208.067 36.74 219.239 43.8026 219.239 62.0679C219.239 80.3332 208.067 89.3441 196.046 89.3441H181.474V36.74Z',
      vbX: 132.416, vbY: 0, vbW: 144.833, vbH: 180.426 },
    { id: 'I',
      d: 'M289.562 179.609V0.000432102H337.892V179.609H289.562Z',
      vbX: 289.562, vbY: 0, vbW: 48.33, vbH: 179.609 },
    { id: 'D',
      d: 'M356.871 179.609V0.000475313H423.416C471.746 0.000475313 505.382 38.114 505.382 89.3786C505.382 140.643 471.746 179.609 423.416 179.609H356.871ZM416.859 36.531H405.93V143.079H416.859C437.623 143.079 455.595 122.621 455.595 89.3786C455.595 56.1358 437.623 36.531 416.859 36.531Z',
      vbX: 356.871, vbY: 0, vbW: 148.511, vbH: 179.609 },
    { id: 'A',
      d: 'M504.246 179.609L545.897 0H623.735L665.143 179.609H614.992L607.341 141.86H562.047L554.397 179.609H504.246ZM569.576 104.964H599.934L584.877 29.9551L569.576 104.964Z',
      vbX: 504.246, vbY: 0, vbW: 160.897, vbH: 179.609 },
    { id: 'Y',
      d: 'M798.345 0L745.159 118.115V179.609H696.343V118.115L643.521 0H695.372L720.872 69.2863L746.373 0H798.345Z',
      vbX: 643.521, vbY: 0, vbW: 154.824, vbH: 179.609 },
  ];

  const CHARS_TOTAL_VBW = CHARS.reduce((s, c) => s + c.vbW, 0); // 835.912

  // ── Drop delay — waits for loader on first/stale visit, instant otherwise ──
  const TTL          = 1000 * 60 * 60 * 4; // must match friday-page-loader.js
  const last         = parseInt(localStorage.getItem('friday_loader_ts') || '0', 10);
  const DROP_INITIAL = Date.now() - last > TTL ? 3000 : 0;

  // Inline SVG → data URL so Matter.js can use it as a sprite texture
  function makeSVGUrl(def, dW, dH) {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"'
      + ' width="'   + Math.ceil(dW) + '"'
      + ' height="'  + Math.ceil(dH) + '"'
      + ' viewBox="' + def.vbX + ' ' + def.vbY + ' ' + def.vbW + ' ' + def.vbH + '">'
      + '<path d="'  + def.d + '" fill="#D61A20"/></svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  // ── Responsive config (recomputed each build) ─────────────────────────────
  function getConfig(SW) {
    const r  = SW / 1440;
    const sf = Math.max(Math.sqrt(r), 0.45);
    return {
      charScale:        (SW * (SW < 768 ? 1.15 : 0.885)) / CHARS_TOTAL_VBW,
      particleAmount:   Math.max(6, Math.round(42 * sf)),
      particleScaleMin: 0.06 * sf,
      particleScaleMax: 0.21 * sf,
      explosionForce:   62,
      gravity:          1.8,
      restitution:      0.45,
      frictionAir:      0.008,
    };
  }

  // ── Scene container ───────────────────────────────────────────────────────
  let scene = document.getElementById('friday-scene');
  if (!scene) {
    scene = document.createElement('div');
    scene.id = 'friday-scene';
    Object.assign(scene.style, {
      position: 'relative', width: '100%', height: '100vh', overflow: 'hidden',
    });
    document.body.prepend(scene);
  }
  scene.style.position = 'relative';

  // ── Confetti canvas — fixed, full viewport, above everything ─────────────
  let confettiCanvas = document.getElementById('friday-confetti-canvas');
  if (!confettiCanvas) {
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'friday-confetti-canvas';
    Object.assign(confettiCanvas.style, {
      position: 'fixed', top: '0', left: '0',
      pointerEvents: 'none', zIndex: '9999',
    });
    document.body.appendChild(confettiCanvas);
  }
  const ctx = confettiCanvas.getContext('2d');

  function resizeConfettiCanvas() {
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeConfettiCanvas();

  // ── Confetti shape & particles ────────────────────────────────────────────
  const MKJ_PATH = new Path2D(
    'M295.665 4.36055C252.497 -6.82327 203.613 4.45352 158.616 27.3771C113.542 50.3401 71.715 85.3074 42.3727 122.589C13.2077 159.645 -4.4094 200.024 0.959623 233.641C3.68019 250.675 12.2822 265.726 27.7751 277.341C40.079 286.565 56.5751 293.512 77.6461 297.748C68.8438 304.276 61.7958 313.06 55.6735 322.059C0.473507 403.197 -5.78498 518.365 22.7077 609.558L127.874 533.695C112.991 497.296 102.306 458.47 96.8112 419.546C93.375 395.204 92.4649 370.856 96.4313 350.232C100.199 330.644 108.24 314.963 122.143 305.466C152.245 319.198 186.688 322.235 217.271 316.583C248.664 310.781 294.587 294.795 291.496 256.841C291.223 253.493 290.747 249.924 288.89 246.895C286.867 243.593 283.716 241.679 279.8 240.42C276.014 239.203 270.985 238.43 264.479 237.747C247.912 236.008 220.437 238.524 193.241 242.206C165.858 245.913 138.146 250.895 120.785 254.328C95.8704 259.256 75.8694 260.454 60.4499 258.918C44.975 257.377 34.5327 253.131 28.2262 247.589C22.1066 242.212 19.4946 235.293 20.1793 227.117C20.8824 218.725 25.1075 208.789 33.2643 198.107C66.0117 155.218 157.855 105.975 294.411 105.975H299.411V5.33125L295.665 4.36055ZM274.007 272.606C230.728 265.77 174.734 264.137 136.43 289.231C180.06 302.202 233.843 293.585 274.007 272.606Z'
  );

  const CONFETTI_COLORS = ['#BE1AD6', '#D6391A'];
  let particles = [];

  class Particle {
    constructor(x, y, cx, cy, cfg) {
      this.x = x; this.y = y;
      const angle = Math.atan2(y - cy, x - cx) + (Math.random() - 0.5) * 0.8;
      const speed = (Math.random() * 0.6 + 0.4) * cfg.explosionForce;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.scale = cfg.particleScaleMin +
        Math.random() * (cfg.particleScaleMax - cfg.particleScaleMin);
      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.life  = 1.5;
      this.decay = Math.random() * 0.012 + 0.008;
      this.rotation      = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 15;
    }
    update() {
      this.vx *= 0.88; this.vy *= 0.88; this.vy += 0.4;
      this.x += this.vx; this.y += this.vy;
      this.life -= this.decay;
      this.rotation += this.rotationSpeed;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle   = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.scale(this.scale, this.scale);
      ctx.translate(-150, -305);
      ctx.fill(MKJ_PATH);
      ctx.restore();
    }
  }

  (function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateConfetti);
  })();

  // ── Physics — Matter.js Render + MouseConstraint (animation.js pattern) ───
  const { Engine, Render, Runner, Bodies, Body, Composite,
          Events, Mouse, MouseConstraint, Query } = Matter;

  let engine, mRender, runner, CONFIG;
  let charBodies  = [];
  let resetTimers = [];
  let ceilingTimer;
  let mouseRelayCleanup = null;
  let touchRelayCleanup = null;

  function buildScene() {
    const SW = scene.clientWidth  || window.innerWidth;
    const SH = scene.clientHeight || window.innerHeight;
    CONFIG = getConfig(SW);
    const sc = CONFIG.charScale;

    // ── Cleanup previous scene ───────────────────────────────────────────────
    clearTimeout(ceilingTimer);
    resetTimers.forEach(clearTimeout);
    resetTimers = [];
    if (mouseRelayCleanup) { mouseRelayCleanup(); mouseRelayCleanup = null; }
    if (touchRelayCleanup) { touchRelayCleanup(); touchRelayCleanup = null; }
    if (runner)  Runner.stop(runner);
    if (mRender) Render.stop(mRender);
    if (mRender && mRender.canvas && mRender.canvas.parentNode) {
      mRender.canvas.parentNode.removeChild(mRender.canvas);
    }
    if (engine) Engine.clear(engine);
    charBodies = [];

    // ── Engine + renderer ────────────────────────────────────────────────────
    engine  = Engine.create({ gravity: { y: CONFIG.gravity } });
    mRender = Render.create({
      element: scene,
      engine:  engine,
      options: {
        width:              SW,
        height:             SH,
        background:         'transparent',
        wireframes:         false,
        showAngleIndicator: false,
      }
    });

    Object.assign(mRender.canvas.style, {
      position:      'absolute',
      top:           '0',
      left:          '0',
      background:    'transparent',
      pointerEvents: 'none', // canvas is visual-only; scene div receives all events
    });

    // Clear to transparent each frame (Matter.js default fills a bg color)
    Events.on(mRender, 'beforeRender', () => {
      mRender.context.clearRect(0, 0, SW, SH);
    });

    // ── Letter bodies with SVG sprite textures ───────────────────────────────
    const totalW = CHARS.reduce((s, c) => s + c.vbW * sc, 0);
    let xCursor  = (SW - totalW) / 2;

    CHARS.forEach((def, i) => {
      const dW = def.vbW * sc;
      const dH = def.vbH * sc;
      const body = Bodies.rectangle(
        xCursor + dW / 2,
        -dH * 1.2,
        dW, dH,
        {
          isStatic:    true,   // held until stagger timer releases it
          restitution: CONFIG.restitution,
          friction:    0.18,
          frictionAir: CONFIG.frictionAir,
          density:     0.003,
          render: {
            sprite: {
              texture: makeSVGUrl(def, dW, dH),
              xScale:  1,
              yScale:  1,
            }
          }
        }
      );
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
      Composite.add(engine.world, body);
      charBodies.push(body);
      resetTimers.push(null);
      xCursor += dW;
    });

    // Stagger-release: drop each letter one by one after initial delay
    const DROP_STAGGER = 250;  // ms between each letter
    charBodies.forEach((body, i) => {
      resetTimers.push(setTimeout(() => {
        Body.setStatic(body, false);
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);
      }, DROP_INITIAL + i * DROP_STAGGER));
    });

    // ── Boundaries ───────────────────────────────────────────────────────────
    // T is large so fast-dragged letters can't tunnel through at any speed
    const T     = 400;
    const invis = { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 };
    Composite.add(engine.world, [
      Bodies.rectangle(SW / 2,  SH + T / 2, SW * 3, T,    { isStatic: true, render: invis }),
      Bodies.rectangle(-T / 2,  SH / 2,     T,      SH*5, { isStatic: true, render: invis }),
      Bodies.rectangle(SW+T/2,  SH / 2,     T,      SH*5, { isStatic: true, render: invis }),
    ]);

    // Safety net: if a body somehow escapes (extreme drag speed), teleport it back
    Events.on(engine, 'afterUpdate', () => {
      charBodies.forEach(body => {
        const { x, y } = body.position;
        if (x < -80 || x > SW + 80 || y > SH + 150 || y < -SH * 3) {
          Body.setPosition(body, { x: SW * 0.2 + Math.random() * SW * 0.6, y: SH * 0.6 });
          Body.setVelocity(body, { x: 0, y: 0 });
          Body.setAngularVelocity(body, 0);
        }
      });
    });

    // Ceiling added after ALL letters have been released + time to fall into scene
    ceilingTimer = setTimeout(() => {
      Composite.add(engine.world,
        Bodies.rectangle(SW / 2, -T / 2, SW * 3, T, { isStatic: true, render: invis })
      );
    }, DROP_INITIAL + CHARS.length * DROP_STAGGER + 2000);

    // ── MouseConstraint ───────────────────────────────────────────────────────
    // Canvas is pointer-events:none (visual only). We use the canvas as the
    // coordinate reference for Mouse but relay all events manually from scene/document.
    const mouse = Mouse.create(mRender.canvas);
    const mc    = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(engine.world, mc);

    // Desktop: mousedown on scene starts drag; move/up on document keeps drag
    // going even if pointer leaves the scene while dragging.
    const _md = (e) => mc.mouse.mousedown(e);
    const _mm = (e) => mc.mouse.mousemove(e);
    const _mu = (e) => mc.mouse.mouseup(e);
    scene.addEventListener('mousedown', _md);
    document.addEventListener('mousemove', _mm);
    document.addEventListener('mouseup',   _mu);
    mouseRelayCleanup = () => {
      scene.removeEventListener('mousedown', _md);
      document.removeEventListener('mousemove', _mm);
      document.removeEventListener('mouseup',   _mu);
    };

    // Touch: only capture when touch starts on a letter body; otherwise scroll freely
    let isTouchDrag = false;
    const _ts = (e) => {
      const rect = mRender.canvas.getBoundingClientRect();
      const t    = e.touches[0];
      isTouchDrag = Query.point(charBodies, {
        x: t.clientX - rect.left,
        y: t.clientY - rect.top,
      }).length > 0;
      if (isTouchDrag) { e.preventDefault(); mc.mouse.mousedown(e); }
    };
    const _tm = (e) => { if (!isTouchDrag) return; e.preventDefault(); mc.mouse.mousemove(e); };
    const _te = (e) => { if (isTouchDrag) { mc.mouse.mouseup(e); isTouchDrag = false; } };
    scene.addEventListener('touchstart', _ts, { passive: false });
    scene.addEventListener('touchmove',  _tm, { passive: false });
    scene.addEventListener('touchend',   _te);
    touchRelayCleanup = () => {
      scene.removeEventListener('touchstart', _ts);
      scene.removeEventListener('touchmove',  _tm);
      scene.removeEventListener('touchend',   _te);
    };

    // ── Tap detection → burst ────────────────────────────────────────────────
    let downPos = null;
    Events.on(mc, 'mousedown', () => {
      downPos = { x: mc.mouse.position.x, y: mc.mouse.position.y };
    });
    Events.on(mc, 'mouseup', () => {
      if (!downPos) return;
      const dx = mc.mouse.position.x - downPos.x;
      const dy = mc.mouse.position.y - downPos.y;
      if (Math.sqrt(dx * dx + dy * dy) < 8) {
        triggerBurst(mc.mouse.position.x, mc.mouse.position.y);
      }
      downPos = null;
    });

    // ── Start ────────────────────────────────────────────────────────────────
    Render.run(mRender);
    runner = Runner.create();
    Runner.run(runner, engine);
  }

  // ── Burst on tap ──────────────────────────────────────────────────────────
  function triggerBurst(sceneX, sceneY) {
    const sr  = scene.getBoundingClientRect();
    const vpX = sceneX + sr.left;
    const vpY = sceneY + sr.top;

    const hits = Query.point(charBodies, { x: sceneX, y: sceneY });
    hits.forEach(body => {
      if (body.render.opacity === 0) return;

      const idx = charBodies.indexOf(body);
      body.render.opacity = 0;

      const bW = body.bounds.max.x - body.bounds.min.x;
      const bH = body.bounds.max.y - body.bounds.min.y;
      for (let i = 0; i < CONFIG.particleAmount; i++) {
        particles.push(new Particle(
          sr.left + body.position.x + (Math.random() - 0.5) * bW,
          sr.top  + body.position.y + (Math.random() - 0.5) * bH,
          vpX, vpY, CONFIG
        ));
      }

      clearTimeout(resetTimers[idx]);
      resetTimers[idx] = setTimeout(() => {
        body.render.opacity = 1;
      }, 1500);
    });
  }

  // ── Resize: debounced rebuild — width changes only ───────────────────────
  // Mobile browsers fire resize when the address bar shows/hides (height-only).
  // Rebuilding on those would restart the animation mid-scroll, so we ignore them.
  let resizeTimer;
  let lastBuildWidth = 0;
  window.addEventListener('resize', () => {
    resizeConfettiCanvas();
    if (window.innerWidth === lastBuildWidth) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      lastBuildWidth = window.innerWidth;
      buildScene();
    }, 200);
  });

  lastBuildWidth = window.innerWidth;
  buildScene();
})();