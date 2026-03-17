document.addEventListener("DOMContentLoaded", () => {

  // ===== NAV SCROLL =====
  const nav = document.getElementById("nav");
  const backToTop = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      nav.classList.add("scrolled");
      backToTop.classList.add("show");
    } else {
      nav.classList.remove("scrolled");
      backToTop.classList.remove("show");
    }
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ===== MOBILE MENU =====
  const burger = document.getElementById("nav-burger");
  const menu = document.getElementById("nav-menu");

  if (burger && menu) {
    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("open");
    });

    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => menu.classList.remove("open"));
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !burger.contains(e.target)) {
        menu.classList.remove("open");
      }
    });
  }

  // ===== ACTIVE NAV LINK =====
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const updateActiveLink = () => {
    let current = "";

    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;

      if (window.scrollY >= top && window.scrollY < top + height) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();

  // ===== INTERSECTION OBSERVER =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        if (entry.target.classList.contains("skill-bar-fill")) {
          entry.target.classList.add("animated");
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal, .timeline-item").forEach(el => observer.observe(el));
  document.querySelectorAll(".skill-bar-fill").forEach(bar => observer.observe(bar));

  document.querySelectorAll(".section-tag, .section-title, .sobre-text, .stat, .projeto-card, .skill-group, .contato-inner > *").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${i * 0.05}s`;
    observer.observe(el);
  });

  // ===== SLIDER PROJETOS =====
  const track = document.getElementById("projetosTrack");
  const slides = document.querySelectorAll(".projeto-slide");
  const prevBtn = document.getElementById("prevProjeto");
  const nextBtn = document.getElementById("nextProjeto");

  if (track && slides.length && prevBtn && nextBtn) {
    let currentIndex = 0;

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === slides.length - 1;
    };

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateSlider();
      }
    });

    updateSlider();
  }

});