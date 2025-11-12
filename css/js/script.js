// basic UI behaviors: year fill, nav toggle, header hide on scroll, simple form success modal
document.addEventListener("DOMContentLoaded", () => {
  // --- Year Auto-fill ---
  document.querySelectorAll("#year,#year2,#year3").forEach(el => el.textContent = new Date().getFullYear());

  // --- Nav Toggle ---
  const navToggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  navToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
    const icon = navToggle.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
  });

  // --- Hide Header on Scroll ---
  let lastScroll = 0;
  const header = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    const st = window.scrollY;
    if (st > lastScroll && st > 120) header.classList.add("header-hidden");
    else header.classList.remove("header-hidden");
    lastScroll = st <= 0 ? 0 : st;
  });

  // --- Placeholder Form Logic (for Enroll) ---
  const enrollForm = document.getElementById("enrollForm");
  if (enrollForm) {
    enrollForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks! Your submission has been received — we’ll contact you soon.");
      enrollForm.reset();
    });
  }
});