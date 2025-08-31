// script.js
document.querySelector(".menu-icon").addEventListener("click", function () {
  document.querySelector(".nav-links").classList.toggle("active");
});

// Homepage animations
if (document.querySelector(".hero")) {
  gsap.from(".navbar", { duration: 1, y: -50, opacity: 0, ease: "power3.out" });
  gsap.from(".hero-content h1", { duration: 1, x: -50, opacity: 0, delay: 0.3 });
  gsap.from(".hero-content p", { duration: 1, x: -50, opacity: 0, delay: 0.6 });
  gsap.from(".hero-image img", { duration: 1, x: 50, opacity: 0, delay: 0.5 });
}

// Admin page animations
if (document.querySelector(".form-section")) {
  gsap.from(".navbar", { duration: 1, y: -50, opacity: 0 });
  gsap.from(".form-section h1", { duration: 1, y: -30, opacity: 0, delay: 0.3 });
  gsap.from(".form-row input", { duration: 1, x: -30, opacity: 0, stagger: 0.15, delay: 0.6 });
  gsap.from(".submit-btn", { duration: 1, scale: 0.8, opacity: 0, ease: "elastic.out(1, 0.5)", delay: 1.5 });
}
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});
