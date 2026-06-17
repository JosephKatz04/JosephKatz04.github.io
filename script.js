// EDIT JAVASCRIPT: This file controls the mobile menu and small interactive polish.
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

// Mobile hamburger menu. You can remove this block if you do not want a collapsible menu.
navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

// Close the mobile menu after a section link is clicked.
navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation menu");
  });
});

// Highlight the section currently visible on screen. Add or remove sections in index.html as needed.
const sectionIds = ["about", "experience", "projects", "skills", "education", "outputs", "achievements", "contact"];
const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
const navItems = new Map([...document.querySelectorAll(".nav-links a")].map((a) => [a.getAttribute("href"), a]));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const link = navItems.get(`#${entry.target.id}`);
    if (entry.isIntersecting && link) {
      navItems.forEach((item) => item.removeAttribute("aria-current"));
      link.setAttribute("aria-current", "true");
    }
  });
}, { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 });

sections.forEach((section) => observer.observe(section));
