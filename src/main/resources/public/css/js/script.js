// Lovoson Media - Enhanced UI Behaviors
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  // --- Year Auto-fill ---
  document.querySelectorAll("#year,#year2,#year3").forEach(el => el.textContent = new Date().getFullYear());

  // --- Nav Toggle (Global Handler) ---
  const navToggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileNav.classList.toggle("active");
      const icon = navToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
      }
    });

    document.addEventListener("click", (e) => {
      if (mobileNav.classList.contains("active") &&
        !mobileNav.contains(e.target) &&
        !navToggle.contains(e.target)) {
        mobileNav.classList.remove("active");
        const icon = navToggle.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");
        }
      }
    });
  }

  // --- Header Scroll Effect ---
  const header = document.getElementById("main-header");
  let lastScroll = 0;
  let ticking = false;

  // NOTE: 'scrolled' class intentionally NOT toggled — navbar stays full-size always

  const updateHeader = () => {
    const st = window.scrollY;
    // Auto-hide on scroll down, reveal on scroll up
    if (st > lastScroll && st > 120) header.classList.add("header-hidden");
    else header.classList.remove("header-hidden");

    lastScroll = st <= 0 ? 0 : st;
    ticking = false;
  };

  if (header) {
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // --- Placeholder Form Logic ---
  const enrollForm = document.getElementById("enrollForm");
  if (enrollForm) {
    enrollForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks! Your submission has been received — we'll contact you soon.");
      enrollForm.reset();
    });
  }

  // --- Scroll Reveal System ---
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Legacy animate-on-scroll ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));
  }

  // --- Cinematic Page Reveal ---
  initPageReveal();

  // --- Free Offer Modal ---
  initOfferModal();

  // --- Shader Lines Effect (Three.js) ---
  const shaderContainers = document.querySelectorAll('.shader-bg');
  if (shaderContainers.length > 0) {
    initShaderEffect(shaderContainers);
  }

  // --- Modal System ---
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalBackdrop = document.querySelector('.shader-modal-backdrop');
  const modal = document.querySelector('.shader-modal');
  const modalClose = document.querySelector('.shader-modal-close');

  if (modalTriggers.length > 0 && modal && modalBackdrop) {
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modalBackdrop.classList.add('active');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modalBackdrop.classList.remove('active');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // --- Theme Toggle (Visible Button) ---
  initThemeToggle();

  // --- Color Picker (Accent Theming) ---
  initColorPicker();

  // --- Stat Block Moving Dot ---
  initStatDots();

  // --- Card Stack (Clients) ---
  initCardStack();

  // --- Aurora Scroll Fade ---
  initAuroraFade();

  // --- Icon Cloud (TagCanvas) ---
  initIconCloud();

  // --- Engagement Popup System ---
  initEngagementSystem();

  // Mark theme as loaded (anti-FOUC release)
  document.documentElement.classList.add('theme-loaded');
});

// ==========================================================================
// ENGAGEMENT POPUP SYSTEM
// ==========================================================================

function initEngagementSystem() {
  const toast       = document.getElementById('lv-toast');
  const offerModal  = document.getElementById('lv-offer-modal');
  const offerBox    = document.getElementById('lv-offer-box');
  const offerBd     = document.getElementById('lv-offer-backdrop');
  if (!toast || !offerModal) return;

  const now = Date.now();
  const getStored    = k => parseInt(localStorage.getItem(k) || '0');
  const setStored    = (k, v) => localStorage.setItem(k, String(v));
  const hoursSince   = k => (now - getStored(k)) / 3600000;
  const canShow      = (k, h) => hoursSince(k) > h;

  let toastQueue = [];
  let toastBusy  = false;
  let progressTimer = null;

  // ---------- TOAST RENDERER ----------
  function showToast(cfg) {
    if (toastBusy) { toastQueue.push(cfg); return; }
    toastBusy = true;

    document.getElementById('lv-toast-icon').textContent  = cfg.icon;
    document.getElementById('lv-toast-title').textContent = cfg.title;
    document.getElementById('lv-toast-body').textContent  = cfg.body;
    const btn = document.getElementById('lv-toast-cta');
    btn.textContent = cfg.cta;
    btn.onclick = () => { cfg.action(); dismissToast(); };

    const bar = document.getElementById('lv-toast-bar');
    bar.style.transition = 'none';
    bar.style.transform  = 'scaleX(1)';

    toast.classList.add('active');

    // animate progress bar
    requestAnimationFrame(() => {
      bar.style.transition = `transform ${cfg.duration || 12000}ms linear`;
      bar.style.transform  = 'scaleX(0)';
    });

    progressTimer = setTimeout(dismissToast, cfg.duration || 12000);
  }

  function dismissToast() {
    clearTimeout(progressTimer);
    toast.classList.remove('active');
    toastBusy = false;
    setTimeout(() => {
      if (toastQueue.length) showToast(toastQueue.shift());
    }, 700);
  }

  document.getElementById('lv-toast-close').addEventListener('click', dismissToast);

  // ---------- FULL MODAL RENDERER ----------
  function showOfferModal(cfg) {
    offerBox.innerHTML = cfg.html;
    offerModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    offerBox.querySelector('.lv-offer-close')?.addEventListener('click', closeOfferModal);
    offerBox.querySelector('.lv-offer-dismiss')?.addEventListener('click', closeOfferModal);
  }

  function closeOfferModal() {
    offerModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  offerBd.addEventListener('click', closeOfferModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOfferModal(); });

  // ---------- OFFER DEFINITIONS ----------
  const OFFERS = [
    // 1. Corner toast — Free Site Audit — 7 seconds after load
    {
      trigger: 'delay',
      value:   7000,
      key:     'lv:audit-toast',
      cooldown: 48,
      type:    'toast',
      icon:    '🔍',
      title:   'Get a Free Site Audit',
      body:    "We'll find exactly where your site is losing leads — free, 24-hour turnaround.",
      cta:     'Claim My Free Audit →',
      duration: 14000,
      action() {
        dismissToast();
        showOfferModal(OFFERS.find(o => o.key === 'lv:audit-modal'));
      }
    },
    // Full modal content for audit (not a timed trigger itself)
    {
      key:  'lv:audit-modal',
      type: 'modal-def',
      html: `
        <button class="lv-offer-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
        <span class="lv-offer-icon">🔍</span>
        <h2 class="lv-offer-title">Free Site Audit</h2>
        <p class="lv-offer-sub">We'll review your website and show you exactly where leads are escaping — zero cost, zero commitment.</p>
        <ul class="lv-offer-checklist">
          <li><i class="fa-solid fa-check-circle"></i> Speed &amp; mobile performance check</li>
          <li><i class="fa-solid fa-check-circle"></i> Lead conversion bottleneck analysis</li>
          <li><i class="fa-solid fa-check-circle"></i> Google visibility assessment</li>
          <li><i class="fa-solid fa-check-circle"></i> AI follow-up gap report</li>
        </ul>
        <input class="lv-offer-input" type="url" id="audit-url" placeholder="Your website URL (e.g. yoursite.com)" />
        <input class="lv-offer-input" type="email" id="audit-email" placeholder="Your email address" />
        <button class="lv-offer-btn-primary" onclick="lvSubmitAudit()">Send Me My Free Audit →</button>
        <button class="lv-offer-dismiss">No thanks, I'll keep losing leads.</button>`
    },
    // 2. Corner toast — Follow on Instagram — 55% scroll
    {
      trigger: 'scroll',
      value:   55,
      key:     'lv:social-toast',
      cooldown: 72,
      type:    'toast',
      icon:    '📱',
      title:   'Follow @lovosonmedia',
      body:    'Watch us build brands, run campaigns, and fill calendars in real time.',
      cta:     'Follow on Instagram →',
      duration: 11000,
      action() {
        window.open('https://www.instagram.com/lovosonmedia', '_blank');
        dismissToast();
      }
    },
    // 3. Full modal — Free Website Build — 3 minutes on site
    {
      trigger: 'delay',
      value:   180000,
      key:     'lv:build-modal',
      cooldown: 72,
      type:    'modal',
      html: `
        <button class="lv-offer-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
        <span class="lv-offer-icon">💻</span>
        <h2 class="lv-offer-title">Claim a Free Website Build</h2>
        <p class="lv-offer-sub">We're taking on <strong>3 service businesses</strong> this month for a completely free high-converting website build. See if you qualify.</p>
        <ul class="lv-offer-checklist">
          <li><i class="fa-solid fa-check-circle"></i> Professional, conversion-optimized design</li>
          <li><i class="fa-solid fa-check-circle"></i> Mobile-ready and fast-loading</li>
          <li><i class="fa-solid fa-check-circle"></i> Built-in AI lead follow-up integration</li>
          <li><i class="fa-solid fa-check-circle"></i> No cost — just results</li>
        </ul>
        <input class="lv-offer-input" type="text"  id="build-biz"   placeholder="Business name" />
        <input class="lv-offer-input" type="text"  id="build-niche" placeholder="What type of business?" />
        <input class="lv-offer-input" type="email" id="build-email" placeholder="Your email" />
        <button class="lv-offer-btn-primary" onclick="lvSubmitBuild()">Check My Availability →</button>
        <button class="lv-offer-dismiss">I already have a great website.</button>`
    },
    // 4. Corner toast — Book a Call — 88% scroll (near bottom)
    {
      trigger: 'scroll',
      value:   88,
      key:     'lv:call-toast',
      cooldown: 24,
      type:    'toast',
      icon:    '📞',
      title:   'Ready to Fill Your Calendar?',
      body:    '15 minutes. No pitch. We pull up your business live and show you what\'s costing you leads.',
      cta:     'Book a Free Strategy Call →',
      duration: 15000,
      action() {
        dismissToast();
        document.getElementById('offer-backdrop')?.classList.add('active');
        document.getElementById('offer-modal')?.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  ];

  // ---------- FIRE ENGINE ----------
  const scrollFired = new Set();

  OFFERS.forEach(offer => {
    if (offer.type === 'modal-def') return; // content-only, not a trigger

    if (offer.trigger === 'delay') {
      setTimeout(() => {
        if (!canShow(offer.key, offer.cooldown)) return;
        setStored(offer.key, now);
        if (offer.type === 'toast') showToast(offer);
        else if (offer.type === 'modal') showOfferModal(offer);
      }, offer.value);
    }

    if (offer.trigger === 'scroll') {
      // handled below
    }
  });

  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight)) * 100;
    OFFERS.forEach(offer => {
      if (offer.trigger !== 'scroll') return;
      if (scrollFired.has(offer.key)) return;
      if (pct < offer.value) return;
      scrollFired.add(offer.key);
      setTimeout(() => {
        if (!canShow(offer.key, offer.cooldown)) return;
        setStored(offer.key, now);
        if (offer.type === 'toast') showToast(offer);
        else if (offer.type === 'modal') showOfferModal(offer);
      }, 800);
    });
  }, { passive: true });
}

// ---------- FORM SUBMITTERS ----------
window.lvSubmitAudit = function() {
  const url   = document.getElementById('audit-url')?.value.trim();
  const email = document.getElementById('audit-email')?.value.trim();
  if (!url || !email) { alert('Please fill in both fields.'); return; }
  document.querySelector('#lv-offer-box').innerHTML = `
    <div style="text-align:center;padding:2rem 1rem;">
      <span style="font-size:2.5rem;">✅</span>
      <h2 class="lv-offer-title" style="margin-top:1rem;">You're on the list!</h2>
      <p class="lv-offer-sub">We'll have your site audit ready within 24 hours at <strong>${email}</strong>.</p>
    </div>`;
  setTimeout(() => {
    document.getElementById('lv-offer-modal')?.classList.remove('active');
    document.body.style.overflow = '';
  }, 3000);
};

window.lvSubmitBuild = function() {
  const biz   = document.getElementById('build-biz')?.value.trim();
  const email = document.getElementById('build-email')?.value.trim();
  if (!biz || !email) { alert('Please fill in all fields.'); return; }
  document.querySelector('#lv-offer-box').innerHTML = `
    <div style="text-align:center;padding:2rem 1rem;">
      <span style="font-size:2.5rem;">🎉</span>
      <h2 class="lv-offer-title" style="margin-top:1rem;">Application Received!</h2>
      <p class="lv-offer-sub">We'll review <strong>${biz}</strong>'s eligibility and get back to you at <strong>${email}</strong> within 24 hours.</p>
    </div>`;
  setTimeout(() => {
    document.getElementById('lv-offer-modal')?.classList.remove('active');
    document.body.style.overflow = '';
  }, 3000);
};



// ==========================================================================
// THEME TOGGLE SYSTEM
// ==========================================================================

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;

  // Sync button icon to current theme on load
  _syncToggleIcon(btn);

  btn.addEventListener('click', () => {
    toggleTheme();
    _syncToggleIcon(btn);
  });
}

function _syncToggleIcon(btn) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  // Moon = currently dark (click to go light), Sun = currently light (click to go dark)
  btn.innerHTML = isDark
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';
  btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  btn.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';

  html.classList.add('theme-transitioning');

  if (next === 'dark') {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
  }

  localStorage.setItem('lovoson-theme', next);

  setTimeout(() => {
    html.classList.remove('theme-transitioning');
  }, 500);
}


// ==========================================================================
// AURORA SCROLL FADE
// ==========================================================================

function initAuroraFade() {
  const aurora = document.querySelector('.aurora-bg');
  if (!aurora) return;

  const heroSection = aurora.closest('section') || aurora.parentElement;
  if (!heroSection) return;

  const handleScroll = () => {
    const heroHeight = heroSection.offsetHeight;
    const threshold = heroHeight * 0.6;
    if (window.scrollY > threshold) {
      aurora.classList.add('faded');
    } else {
      aurora.classList.remove('faded');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ==========================================================================
// SHADER LINES EFFECT (Three.js)
// ==========================================================================

function initShaderEffect(containers) {
  if (window.THREE) {
    containers.forEach(c => createShader(c));
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js';
  script.onload = () => {
    if (window.THREE) containers.forEach(c => createShader(c));
  };
  document.head.appendChild(script);
}

function createShader(container) {
  const THREE = window.THREE;
  if (!THREE) return;

  const camera = new THREE.Camera();
  camera.position.z = 1;

  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneBufferGeometry(2, 2);

  const uniforms = {
    time: { type: 'f', value: 1.0 },
    resolution: { type: 'v2', value: new THREE.Vector2() }
  };

  const vertexShader = `void main() { gl_Position = vec4(position, 1.0); }`;
  const fragmentShader = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    float random(in float x) { return fract(sin(x) * 1e4); }
    void main(void) {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
      vec2 fMosaicScal = vec2(4.0, 2.0);
      vec2 vScreenSize = vec2(256.0, 256.0);
      uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
      uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);
      float t = time * 0.06 + random(uv.x) * 0.4;
      float lineWidth = 0.0008;
      vec3 color = vec3(0.0);
      for(int j = 0; j < 3; j++){
        for(int i = 0; i < 5; i++){
          color[j] += lineWidth * float(i*i) / abs(fract(t - 0.01*float(j) + float(i)*0.01) * 1.0 - length(uv));
        }
      }
      gl_FragColor = vec4(color[2], color[1], color[0], 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const onResize = () => {
    const rect = container.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    uniforms.resolution.value.x = renderer.domElement.width;
    uniforms.resolution.value.y = renderer.domElement.height;
  };

  onResize();
  window.addEventListener('resize', onResize, { passive: true });

  const animate = () => {
    requestAnimationFrame(animate);
    uniforms.time.value += 0.05;
    renderer.render(scene, camera);
  };
  animate();
}

// ==========================================================================
// ICON CLOUD (TagCanvas)
// ==========================================================================

function initIconCloud() {
  const cloudContainer = document.getElementById('icon-cloud-container');
  if (!cloudContainer) return;

  const iconList = document.getElementById('icon-cloud-tags');
  if (!iconList) return;

  function showFallback() {
    cloudContainer.style.display = 'none';
    const fallback = document.getElementById('icon-cloud-fallback');
    if (fallback) fallback.style.display = 'flex';
  }

  // Load TagCanvas
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/TagCanvas@2.10.0/TagCanvas.min.js';
  script.onload = () => {
    if (typeof TagCanvas === 'undefined') return showFallback();

    try {
      TagCanvas.Start('icon-cloud-canvas', 'icon-cloud-tags', {
        textColour: '#6b7280',
        textFont: 'Inter, system-ui, sans-serif',
        textHeight: 16,
        outlineColour: 'transparent',
        outlineMethod: 'none',
        reverse: true,
        depth: 0.8,
        wheelZoom: false,
        activeCursor: 'default',
        initial: [0.1, -0.1],
        maxSpeed: 0.04,
        minSpeed: 0.02,
        shape: 'sphere',
        noSelect: true,
        noMouse: false,
        pinchZoom: false,
        freezeActive: true,
        shuffleTags: true,
        shadow: '#c0c8d4',
        shadowBlur: 3,
        fadeIn: 800,
        weight: true,
        weightMode: 'size',
        weightSize: 1.2,
        weightSizeMin: 10,
        weightSizeMax: 24,
      });
    } catch (e) {
      showFallback();
    }
  };
  script.onerror = showFallback;
  document.body.appendChild(script);
}

// ==========================================================================
// CINEMATIC PAGE REVEAL
// ==========================================================================

function initPageReveal() {
  // Hero reveal immediately on DOMContentLoaded
  const heroTargets = document.querySelectorAll('.page-reveal-hero');
  heroTargets.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, i * 80);
  });

  // Staggered reveal for other content
  const targets = document.querySelectorAll('.page-reveal-target');
  targets.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, 80 + i * 80);
  });
}

// ==========================================================================
// FREE OFFER MODAL
// ==========================================================================

function initOfferModal() {
  const backdrop = document.getElementById('offer-backdrop');
  const modal = document.getElementById('offer-modal');
  const closeBtn = document.getElementById('offer-modal-close');

  if (!backdrop || !modal) return;

  const triggers = document.querySelectorAll('[data-offer-trigger]');

  const openModal = () => {
    backdrop.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    backdrop.classList.remove('active');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggers.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

// ==========================================================================
// COLOR PICKER (ACCENT THEMING)
// ==========================================================================

function initColorPicker() {
  const btn = document.getElementById('color-picker-btn');
  const popover = document.getElementById('color-picker-popover');
  if (!btn || !popover) return;

  const dots = popover.querySelectorAll('.color-dot');

  // Restore active dot from localStorage
  const stored = localStorage.getItem('lovoson-accent');
  if (stored) {
    dots.forEach(d => {
      d.classList.toggle('is-active', d.getAttribute('data-accent-h') === stored);
    });
  }

  // Toggle popover
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    popover.classList.toggle('is-open');
  });

  // Handle dot click
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const hue = dot.getAttribute('data-accent-h');

      // Update CSS custom property
      document.documentElement.style.setProperty('--accent-h', hue);

      // Persist
      localStorage.setItem('lovoson-accent', hue);

      // Update active state
      dots.forEach(d => d.classList.remove('is-active'));
      dot.classList.add('is-active');

      // Close popover
      popover.classList.remove('is-open');
    });
  });

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !popover.contains(e.target)) {
      popover.classList.remove('is-open');
    }
  });
}

// ==========================================================================
// STAT BLOCK MOVING DOT (IntersectionObserver)
// ==========================================================================

function initStatDots() {
  const blocks = document.querySelectorAll('.stat-block');
  if (!blocks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.3 });

  blocks.forEach(block => observer.observe(block));
}

// ==========================================================================
// CARD STACK (Client Portfolio)
// ==========================================================================

function initCardStack() {
  const stage = document.getElementById('card-stack');
  const dotsWrap = document.getElementById('card-stack-dots');
  const extLink = document.getElementById('stack-external-link');
  if (!stage) return;

  const cards = Array.from(stage.querySelectorAll('.stack-card'));
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.stack-dot')) : [];
  const len = cards.length;
  if (!len) return;

  let active = 0;
  const SPREAD_DEG = 48;
  const MAX_OFFSET = 3;
  const CARD_SPACING = 120;

  function layout() {
    const stepDeg = MAX_OFFSET > 0 ? SPREAD_DEG / MAX_OFFSET : 0;

    cards.forEach((card, i) => {
      const off = i - active;
      const abs = Math.abs(off);
      const visible = abs <= MAX_OFFSET;

      if (!visible) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.transform = 'translateX(0) rotateZ(0deg) scale(0.8)';
        card.classList.remove('is-active');
        return;
      }

      const rotateZ = off * stepDeg;
      const x = off * CARD_SPACING;
      const y = abs * 10;
      const isActive = off === 0;
      const scale = isActive ? 1.03 : 0.92;
      const z = 100 - abs;

      card.style.opacity = '1';
      card.style.pointerEvents = isActive ? 'auto' : 'auto';
      card.style.zIndex = z;
      card.style.transform = `translateX(${x}px) translateY(${y}px) rotateZ(${rotateZ}deg) scale(${scale})`;
      card.classList.toggle('is-active', isActive);
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === active);
    });

    // Update external link
    if (extLink && cards[active]) {
      extLink.href = cards[active].getAttribute('data-href') || '#';
    }
  }

  function goTo(index) {
    active = ((index % len) + len) % len;
    layout();
  }

  // Click on card to select
  cards.forEach((card, i) => {
    card.addEventListener('click', () => goTo(i));
  });

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-go'), 10);
      if (!isNaN(idx)) goTo(idx);
    });
  });

  // Keyboard
  if (stage) {
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(active - 1);
      if (e.key === 'ArrowRight') goTo(active + 1);
    });
  }

  // Initial layout
  layout();
}