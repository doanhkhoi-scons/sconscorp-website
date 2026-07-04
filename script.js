const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const drawer = document.getElementById("mobileDrawer");
const drawerClose = document.getElementById("drawerClose");
const backToTop = document.getElementById("backToTop");
const navLinks = document.querySelectorAll(".desktop-nav a");

function setHeaderState() {
  const scrolled = window.scrollY > 24;
  header.classList.toggle("is-scrolled", scrolled);
  backToTop.classList.toggle("is-visible", window.scrollY > 700);
}

function openDrawer() {
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("drawer-open");
}

function closeDrawer() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("drawer-open");
}

menuToggle.addEventListener("click", openDrawer);
drawerClose.addEventListener("click", closeDrawer);
drawer.addEventListener("click", (event) => {
  if (event.target === drawer || event.target.matches(".drawer-panel a")) {
    closeDrawer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

// Reveal sections only once to keep the editorial layout calm.
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const stats = document.querySelectorAll(".stats strong");
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;

  stats.forEach((stat) => {
    const target = Number(stat.dataset.count);
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      stat.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  });
}

const statsSection = document.querySelector(".stats");
const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      animateStats();
      statsObserver.disconnect();
    }
  },
  { threshold: 0.35 }
);

if (statsSection) {
  statsObserver.observe(statsSection);
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

document.querySelectorAll("main section[id], footer[id]").forEach((section) => {
  sectionObserver.observe(section);
});
