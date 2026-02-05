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

    // Close mobile nav on outside click
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

  // --- Header Scroll Effect (Optimized with RAF) ---
  const header = document.getElementById("main-header");
  let lastScroll = 0;
  let ticking = false;

  // Prevent header flash on load - set initial state
  if (header && window.scrollY > 20) {
    header.classList.add("scrolled");
  }

  const updateHeader = () => {
    const st = window.scrollY;

    // Add/remove scrolled class for shrink effect
    if (st > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Optional: Hide header on scroll down, show on scroll up
    if (st > lastScroll && st > 120) {
      header.classList.add("header-hidden");
    } else {
      header.classList.remove("header-hidden");
    }

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

  // --- Placeholder Form Logic (for Enroll if present) ---
  const enrollForm = document.getElementById("enrollForm");
  if (enrollForm) {
    enrollForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks! Your submission has been received — we'll contact you soon.");
      enrollForm.reset();
    });
  }

  // --- Entry Animations (Intersection Observer) ---
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
});