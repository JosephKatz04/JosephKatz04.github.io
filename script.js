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

// Mark the current page in the shared navigation.
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) link.setAttribute("aria-current", "page");
});

// Keep every page directly addressable, with a visible sequence and touch navigation.
const pages = [...document.querySelectorAll(".nav-links a")];
const pageIndex = pages.findIndex((link) => link.getAttribute("href") === currentPage);
if (pageIndex >= 0) {
  const pager = document.createElement("nav");
  pager.className = "page-navigation";
  pager.setAttribute("aria-label", "Browse portfolio pages");
  const previous = pages[pageIndex - 1];
  const next = pages[pageIndex + 1];
  const makePageLink = (source, direction) => {
    if (!source) return document.createElement("span");
    const link = document.createElement("a");
    link.href = source.href;
    link.className = `page-${direction}`;
    link.rel = direction === "next" ? "next" : "prev";
    link.textContent = direction === "next" ? `${source.textContent} →` : `← ${source.textContent}`;
    return link;
  };
  const position = document.createElement("span");
  position.className = "page-position";
  position.textContent = `${String(pageIndex + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`;
  const hint = document.createElement("span");
  hint.className = "swipe-hint";
  hint.textContent = "Swipe to explore";
  position.append(hint);
  pager.append(makePageLink(previous, "previous"), position, makePageLink(next, "next"));
  document.querySelector("main")?.append(pager);

  // Only intentional horizontal gestures navigate; vertical scrolling stays native.
  let gesture = null;
  const content = document.querySelector("main");
  content?.addEventListener("touchstart", (event) => {
    gesture = null;
    if (event.touches.length !== 1 || event.target.closest("a, button, input, textarea, select")) return;
    const touch = event.touches[0];
    if (touch.clientX < 35 || touch.clientX > window.innerWidth - 35) return;
    gesture = { x: touch.clientX, y: touch.clientY, time: performance.now() };
  }, { passive: true });
  content?.addEventListener("touchend", (event) => {
    if (!gesture || !event.changedTouches.length || event.touches.length) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - gesture.x;
    const dy = touch.clientY - gesture.y;
    const elapsed = performance.now() - gesture.time;
    gesture = null;
    if (Math.abs(dx) < 100 || Math.abs(dx) < Math.abs(dy) * 2.5 || elapsed > 700 || window.getSelection()?.toString()) return;
    const destination = dx < 0 ? next : previous;
    if (destination) window.location.assign(destination.href);
  }, { passive: true });
  content?.addEventListener("touchcancel", () => { gesture = null; }, { passive: true });
}

// Reveal content once, as it enters view. Reduced-motion users see it immediately.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const reveals = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("is-pending");
      reveals.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".home-about, .timeline-item, .project-card, .skills-grid article, .education-list article, .achievement-list article, .contact-card").forEach((element) => {
    element.classList.add("reveal", "is-pending");
    reveals.observe(element);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks?.classList.contains("is-open")) {
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation menu");
    navToggle?.focus();
  }
});
