(() => {
  const pitchText =
    "Food Pharmacy is a Health and Nutrition company that shows people how to move away from lifestyle diseases such as CANCER, DIABETES, HIGH BLOOD PRESSURE, HIGH CHOLESTEROL, STROKE, OBESITY, and the like. Free home presentation! BOOK US NOW!!! We do this through our revolutionary way of cooking which we believe is 10 years ahead of its time. Also maximizing the nutrients in your food and eliminating food pollution that allows you and your family to look better, feel better and live healthier. At Food Pharmacy, we believe that the food we eat is our medicine and thus we make a conscious effort to ensure that they are highly nutritious and very safe to consume. FOOD PHARMACY...Let your food be your medicine!!!";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safeMotion() {
    const m = window.motion;
    if (!m || typeof m.animate !== "function") return null;
    return m;
  }

  function setupNav() {
    const toggle = $("#navToggle");
    const links = $("#navLinks");
    if (!toggle || !links) return;

    const close = () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    $$("a", links).forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    document.addEventListener("click", (e) => {
      if (!links.classList.contains("open")) return;
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (!links.contains(t) && !toggle.contains(t)) close();
    });
  }

  function setActiveNavLink() {
    const links = $("#navLinks");
    if (!links) return;

    const current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const normalized = current === "" ? "index.html" : current;

    $$("a", links).forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (!href || href.startsWith("#")) return;

      const target = href.split("#")[0];
      const isMatch = target === normalized;
      a.classList.toggle("is-active", isMatch);
    });
  }

  function setupCopyPitch() {
    const btn = $("#copyPitch");
    if (!btn) return;

    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pitchText);
        const old = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = old;
        }, 1400);
      } catch {
        const old = btn.textContent;
        btn.textContent = "Copy failed";
        setTimeout(() => {
          btn.textContent = old;
        }, 1400);
      }
    });
  }

  function setupBookingForm() {
    const form = $("#bookingForm");
    const emailBtn = $("#emailUs");
    if (!form) return;

    const makeMailto = (data) => {
      const subject = "Food Pharmacy Ghana — Booking Request";
      const lines = [
        "New request:",
        `Name: ${data.name}`,
        `Phone/WhatsApp: ${data.phone}`,
        `Location: ${data.location}`,
        `Interest: ${data.interest}`,
        data.message ? `Message: ${data.message}` : "Message:",
        "",
        "---",
        "Food Pharmacy Ghana",
        "Tema Community 19 (Daffodil Street)",
      ];

      const body = lines.join("\n");
      const to = "info@foodpharmacyghana.com";
      return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const getFormData = () => {
      const fd = new FormData(form);
      return {
        name: String(fd.get("name") || "").trim(),
        phone: String(fd.get("phone") || "").trim(),
        location: String(fd.get("location") || "").trim(),
        interest: String(fd.get("interest") || "").trim(),
        message: String(fd.get("message") || "").trim(),
      };
    };

    const updateEmailLink = () => {
      if (!emailBtn) return;
      const d = getFormData();
      emailBtn.href = makeMailto(d);
    };

    ["input", "change"].forEach((evt) => form.addEventListener(evt, updateEmailLink));
    updateEmailLink();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = getFormData();
      window.location.href = makeMailto(d);
    });
  }

  function setupParallaxCard() {
    if (prefersReduced) return;

    const canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
    if (!canHover) return;

    const targets = [
      ...$$(".card"),
      ...$$(".panel"),
      ...$$(".quote"),
      ...$$(".list-item"),
      ...$$("#heroCard"),
    ].filter(Boolean);

    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

    targets.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      el.classList.add("tilt-card");

      let raf = 0;
      const onMove = (e) => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - (r.left + r.width / 2)) / r.width;
          const py = (e.clientY - (r.top + r.height / 2)) / r.height;

          const maxX = el.id === "heroCard" ? 6 : 4;
          const maxY = el.id === "heroCard" ? 10 : 7;

          const rx = clamp(py, -1, 1) * -maxX;
          const ry = clamp(px, -1, 1) * maxY;
          const lift = el.id === "heroCard" ? -2 : -4;

          el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${lift}px)`;
        });
      };

      const reset = () => {
        el.style.transform = "";
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", reset);
    });
  }

  function setupReveal() {
    const motion = safeMotion();
    const items = $$(".reveal");
    if (!items.length) return;

    if (prefersReduced) {
      items.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
        el.classList.add("is-visible");
      });
      return;
    }

    const getVariant = (el) => {
      const override = el.getAttribute("data-reveal");
      const v = (override || "").toLowerCase();

      if (v === "left") {
        return { from: "translateX(-18px) translateY(8px)", to: "translateX(0px) translateY(0px)" };
      }
      if (v === "right") {
        return { from: "translateX(18px) translateY(8px)", to: "translateX(0px) translateY(0px)" };
      }
      if (v === "scale") {
        return { from: "translateY(14px) scale(0.98)", to: "translateY(0px) scale(1)" };
      }

      if (el.classList.contains("card") || el.classList.contains("panel") || el.classList.contains("quote")) {
        return { from: "translateY(18px) scale(0.985)", to: "translateY(0px) scale(1)" };
      }
      if (el.classList.contains("list-item") || el.classList.contains("stat")) {
        return { from: "translateX(-14px) translateY(10px)", to: "translateX(0px) translateY(0px)" };
      }
      return { from: "translateY(16px)", to: "translateY(0px)" };
    };

    const getStaggerDelay = (el) => {
      const parent = el.parentElement;
      if (!parent) return 0;

      const shouldStagger =
        parent.classList.contains("grid-3") ||
        parent.classList.contains("grid-2") ||
        parent.classList.contains("stats") ||
        parent.classList.contains("list") ||
        parent.classList.contains("contact") ||
        parent.classList.contains("footer-links") ||
        parent.classList.contains("booking");

      if (!shouldStagger) return 0;

      const siblings = $$(".reveal", parent);
      const index = Math.max(0, siblings.indexOf(el));
      return Math.min(0.42, index * 0.08);
    };

    if (!motion) {
      items.forEach((el) => {
        const variant = getVariant(el);
        el.style.transform = variant.from;
        el.style.filter = "none";
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          io.unobserve(el);

          const delayAttr = Number(el.getAttribute("data-delay") || "0");
          const delay = Math.max(0, delayAttr) + getStaggerDelay(el);
          const variant = getVariant(el);

          if (motion) {
            const anim = motion.animate(
              el,
              {
                opacity: [0, 1],
                transform: [variant.from, variant.to],
              },
              {
                duration: 0.65,
                easing: [0.16, 1, 0.3, 1],
                delay,
              }
            );

            anim.finished.then(() => {
              el.classList.add("is-visible");
              el.style.opacity = "1";
              el.style.transform = "none";
              el.style.filter = "none";
            });
          } else {
            el.style.setProperty("--d", `${delay}s`);
            el.style.opacity = "1";
            el.style.transform = variant.from;
            el.style.filter = "none";
            requestAnimationFrame(() => {
              el.classList.add("is-visible");
            });
          }
        });
      },
      { threshold: 0.08, rootMargin: "80px 0px -10% 0px" }
    );

    items.forEach((el) => io.observe(el));
  }

  function playSplash() {
    const motion = safeMotion();
    const splash = $("#splash");
    if (!splash) return;

    const exit = () => {
      if (prefersReduced || !motion) {
        splash.style.display = "none";
        return;
      }

      const inner = $(".splash-inner", splash);
      const ring = $(".splash-ring", splash);

      motion.animate(
        ring,
        { transform: ["scale(1)", "scale(1.04)"] },
        { duration: 0.35, easing: [0.16, 1, 0.3, 1] }
      );
      if (inner) {
        motion.animate(
          inner,
          { opacity: [1, 0], transform: ["translateY(0px)", "translateY(-12px)"] },
          { duration: 0.55, easing: [0.16, 1, 0.3, 1], delay: 0.05 }
        );
      }

      motion.animate(
        splash,
        { opacity: [1, 0] },
        {
          duration: 0.6,
          easing: "ease-out",
          delay: 0.1,
        }
      ).finished.then(() => {
        splash.style.display = "none";
      });
    };

    if (document.readyState === "complete") {
      setTimeout(exit, 900);
    } else {
      window.addEventListener("load", () => setTimeout(exit, 900), { once: true });
    }
  }

  function animateBackground() {
    if (prefersReduced) return;
    const motion = safeMotion();
    if (!motion) return;

    const b1 = $(".bg-blob.b1");
    const b2 = $(".bg-blob.b2");
    const b3 = $(".bg-blob.b3");

    const drift = (el, x, y, d) => {
      if (!el) return;
      motion.animate(
        el,
        { transform: ["translate3d(0,0,0)", `translate3d(${x}px, ${y}px, 0)`] },
        { duration: d, direction: "alternate", repeat: Infinity, easing: "ease-in-out" }
      );
    };

    drift(b1, 70, 50, 9.5);
    drift(b2, -80, 60, 11.5);
    drift(b3, 60, -70, 12.5);
  }

  function setYear() {
    const year = $("#year");
    if (!year) return;
    year.textContent = String(new Date().getFullYear());
  }

  function start() {
    setupNav();
    setActiveNavLink();
    setupCopyPitch();
    setupBookingForm();
    setupParallaxCard();
    animateBackground();
    playSplash();
    setupReveal();
    setYear();
  }

  start();
})();
