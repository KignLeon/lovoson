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

  // --- Free Offer Modal (data-offer-trigger → smart booking modal) ---
  // Handled inside initEngagementSystem() below

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
// ENGAGEMENT POPUP SYSTEM (disabled — placeholder stub)
// ==========================================================================

function initEngagementSystem() {
  // Engagement popups (toast, booking modal, exit intent) removed.
  // Re-implement here if needed in the future.
}



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
  // Dark mode active → show SUN icon (click to switch to light)
  // Light mode active → show MOON icon (click to switch to dark)
  btn.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
  btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  btn.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  // Default is dark — toggling from dark goes light, from light goes dark
  const next = current === 'dark' ? 'light' : 'dark';

  html.classList.add('theme-transitioning');

  if (next === 'dark') {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('lovoson-theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
    localStorage.setItem('lovoson-theme', 'light');
  }

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
// COLOR PICKER (ACCENT THEMING)
// ==========================================================================

function initColorPicker() {
  const btn = document.getElementById('color-picker-btn');
  const popover = document.getElementById('color-picker-popover');
  if (!btn || !popover) return;

  const html = document.documentElement;
  const dots = popover.querySelectorAll('.color-dot');

  // Apply accent CSS vars from stored values
  function applyAccent(hue, sat, light) {
    html.style.setProperty('--accent-h', hue);
    html.style.setProperty('--accent-s', sat + '%');
    html.style.setProperty('--accent-l', light + '%');
  }

  // Restore saved accent on load
  const storedHue   = localStorage.getItem('lovoson-accent');
  const storedSat   = localStorage.getItem('lovoson-accent-s');
  const storedLight = localStorage.getItem('lovoson-accent-l');
  if (storedHue) {
    applyAccent(
      storedHue,
      storedSat  !== null ? storedSat  : '80',
      storedLight !== null ? storedLight : '55'
    );
    // Mark the matching dot as active
    dots.forEach(d => {
      d.classList.toggle('is-active', d.getAttribute('data-accent-h') === storedHue);
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
      const hue  = dot.getAttribute('data-accent-h');
      const mode = dot.getAttribute('data-accent-mode');

      let sat, light;
      if (mode === 'white') {
        // Near-white cloud accent — low saturation, very high lightness
        sat   = 8;
        light = 93;
      } else {
        // Standard vivid accent
        sat   = 80;
        light = 55;
      }

      applyAccent(hue, sat, light);

      // Persist all three
      localStorage.setItem('lovoson-accent',   hue);
      localStorage.setItem('lovoson-accent-s', String(sat));
      localStorage.setItem('lovoson-accent-l', String(light));

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

// ─── CTA ROTATOR ───────────────────────────────────────────
// Cycles through 3 CTA labels every 2 days, site-wide.
// Any element with [data-cta-label] gets its text swapped.
(function () {
  const CTAs = [
    'Free Strategy Call',
    'Free Store Audit',
    'Free Website Audit'
  ];
  const daysSinceEpoch = Math.floor(Date.now() / 86400000);
  const index = Math.floor(daysSinceEpoch / 2) % CTAs.length;
  const currentCTA = CTAs[index];
  document.querySelectorAll('[data-cta-label]').forEach(function (el) {
    // Preserve any icon inside the element
    const icon = el.querySelector('i, svg');
    if (icon) {
      el.textContent = '';
      el.appendChild(icon);
      el.appendChild(document.createTextNode(' ' + currentCTA));
    } else {
      el.textContent = currentCTA;
    }
  });
})();