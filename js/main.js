/* ============================================================
   NEXUS DIAGNOSTICS — Master JavaScript
   Rebuild by Lyfework | 2026
   ============================================================ */

(function () {
  "use strict";

  /* --- Scroll Progress Bar --- */
  const scrollProgress = document.querySelector(".scroll-progress");
  if (scrollProgress) {
    window.addEventListener(
      "scroll",
      () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        scrollProgress.style.width = pct + "%";
      },
      { passive: true },
    );
  }

  /* --- Sticky Header Scroll State --- */
  const header = document.querySelector(".site-header");
  if (header) {
    let lastScroll = 0;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 24);
      lastScroll = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- Mobile Menu Toggle --- */
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      mobileNav.classList.toggle("open");
      document.body.style.overflow = mobileNav.classList.contains("open")
        ? "hidden"
        : "";
    });
    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        mobileNav.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* --- Scroll Reveal (Intersection Observer) --- */
  const revealEls = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale, .blur-reveal",
  );
  if (revealEls.length) {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      revealEls.forEach((el) => el.classList.add("visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );
      revealEls.forEach((el) => observer.observe(el));
    }
  }

  /* --- Character-by-character reveal --- */
  document.querySelectorAll(".char-reveal").forEach((el) => {
    const text = el.textContent;
    el.innerHTML = "";
    text.split("").forEach((c, i) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = c === " " ? "\u00A0" : c;
      span.style.transitionDelay = i * 30 + "ms";
      el.appendChild(span);
    });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
  });

  /* --- CountUp Animation --- */
  document.querySelectorAll("[data-countup]").forEach((el) => {
    const target = parseFloat(el.getAttribute("data-countup"));
    const suffix = el.getAttribute("data-suffix") || "";
    const prefix = el.getAttribute("data-prefix") || "";
    const decimals = target % 1 !== 0 ? 1 : 0;
    const duration = 2000;
    let started = false;

    const animate = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        el.textContent = prefix + current.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
  });

  /* --- Accordion --- */
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      const body = item.querySelector(".accordion-body");
      const content = body.querySelector(".accordion-content");
      const isActive = item.classList.contains("active");

      // Close all siblings
      const parent = item.parentElement;
      parent.querySelectorAll(".accordion-item.active").forEach((active) => {
        if (active !== item) {
          active.classList.remove("active");
          active.querySelector(".accordion-body").style.maxHeight = "0";
        }
      });

      // Toggle this one
      item.classList.toggle("active", !isActive);
      body.style.maxHeight = isActive ? "0" : content.scrollHeight + "px";
    });
  });

  /* --- Tabs --- */
  document.querySelectorAll("[data-tab-group]").forEach((group) => {
    const btns = group.querySelectorAll(".tab-btn");
    const panels = group.querySelectorAll(".tab-panel");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab");
        btns.forEach((b) => b.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const panel = group.querySelector("#" + target);
        if (panel) panel.classList.add("active");
      });
    });
  });

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--header-height",
            ),
          ) || 72;
        window.scrollTo({
          top: target.offsetTop - offset - 16,
          behavior: "smooth",
        });
      }
    });
  });

  /* --- Magnetic Button Effect --- */
  document.querySelectorAll(".btn-magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0)";
    });
  });

  /* --- Card Glare Effect --- */
  document.querySelectorAll(".card-glare").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--glare-x", x + "px");
      card.style.setProperty("--glare-y", y + "px");
      if (card.querySelector("::before")) {
        card.style.setProperty("--mouse-x", x + "px");
        card.style.setProperty("--mouse-y", y + "px");
      }
    });
  });

  /* --- Form Focus Animation --- */
  document
    .querySelectorAll(".form-input, .form-textarea, .form-select")
    .forEach((input) => {
      const group = input.closest(".form-group");
      if (!group) return;
      input.addEventListener("focus", () => group.classList.add("focused"));
      input.addEventListener("blur", () => group.classList.remove("focused"));
    });

  /* --- Set active nav link based on current page --- */
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".header-nav a, .mobile-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPath = href.split("/").pop();
    if (
      linkPath === currentPath ||
      (currentPath === "index.html" &&
        (linkPath === "index.html" || linkPath === "/"))
    ) {
      link.classList.add("active");
    }
  });

  /* --- Parallax subtle effect for hero backgrounds --- */
  const heroEl = document.querySelector(".hero");
  if (
    heroEl &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const bgEl = heroEl.querySelector(".hero-bg-image");
    if (bgEl) {
      window.addEventListener(
        "scroll",
        () => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            bgEl.style.transform = `translateY(${y * 0.15}px)`;
          }
        },
        { passive: true },
      );
    }
  }

  /* --- Copyright Year --- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* --- Back to Top Button --- */
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => {
        backToTop.classList.toggle("visible", window.scrollY > 400);
      },
      { passive: true },
    );
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* --- Accordion aria-expanded toggle --- */
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      const isActive = item.classList.contains("active");
      const parent = item.parentElement;
      parent.querySelectorAll(".accordion-trigger").forEach((t) => {
        t.setAttribute("aria-expanded", "false");
      });
      if (!isActive) {
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* --- Card Tilt Effect (service cards) --- */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-6px) perspective(600px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* --- Smooth Phone Number Formatting --- */
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener("input", () => {
      let val = input.value.replace(/\D/g, "");
      if (val.length > 10) val = val.slice(0, 10);
      if (val.length >= 7) {
        input.value =
          "(" + val.slice(0, 3) + ") " + val.slice(3, 6) + "-" + val.slice(6);
      } else if (val.length >= 4) {
        input.value = "(" + val.slice(0, 3) + ") " + val.slice(3);
      } else if (val.length > 0) {
        input.value = "(" + val;
      }
    });
  });

  /* --- Draw-on-Scroll Timeline --- */
  const timelineDraw = document.querySelector(".timeline-draw");
  if (
    timelineDraw &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const timelineLine =
      timelineDraw.querySelector(":scope::before") || timelineDraw;
    const timelineItems = timelineDraw.querySelectorAll(".timeline-item");
    const updateTimeline = () => {
      const rect = timelineDraw.getBoundingClientRect();
      const viewH = window.innerHeight;
      const totalH = timelineDraw.scrollHeight;
      const scrollInto = Math.max(0, viewH * 0.6 - rect.top);
      const pct = Math.min(100, Math.max(0, (scrollInto / totalH) * 100));
      timelineDraw.style.setProperty("--timeline-progress", pct + "%");
      timelineItems.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < viewH * 0.65) {
          item.classList.add("is-active");
        }
      });
    };
    window.addEventListener("scroll", updateTimeline, { passive: true });
    updateTimeline();
  }

  /* --- Stagger Reveal with Dynamic Delays --- */
  document.querySelectorAll(".stagger").forEach((container) => {
    const children = container.querySelectorAll(".reveal");
    children.forEach((child, i) => {
      child.style.transitionDelay = i * 100 + "ms";
    });
  });

  /* --- Parallax Sections (subtle) --- */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const parallaxEls = document.querySelectorAll(".section-image img");
    if (parallaxEls.length) {
      window.addEventListener(
        "scroll",
        () => {
          parallaxEls.forEach((img) => {
            const rect = img.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              const progress =
                (window.innerHeight - rect.top) /
                (window.innerHeight + rect.height);
              img.style.transform =
                "translateY(" + (progress - 0.5) * 20 + "px) scale(1.05)";
            }
          });
        },
        { passive: true },
      );
    }
  }

  /* --- Form submit handling (demo) --- */
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = "Submitting...";
      btn.disabled = true;
      setTimeout(() => {
        form.style.display = "none";
        const success = document.createElement("div");
        success.className = "form-success visible";
        const heading = document.createElement("h3");
        heading.className = "h3";
        heading.textContent = "Submission Received";
        const msg = document.createElement("p");
        msg.className = "body-lg text-muted";
        msg.textContent = "Thank you. Our team will be in touch shortly.";
        success.appendChild(heading);
        success.appendChild(msg);
        form.parentNode.insertBefore(success, form.nextSibling);
      }, 800);
    });
  });
})();
