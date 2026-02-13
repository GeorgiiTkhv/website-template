/* =========================
   script.js (CLEAN)
   Requires: content.js loaded BEFORE this file
   Includes: UI render + carousel + scroll animations + form submit -> /api/quote
   ========================= */

(function () {
  const DATA = window.SITE_DATA;
  if (!DATA) {
    console.error("SITE_DATA not found. Make sure content.js is loaded before script.js");
    return;
  }

  // ---------- helpers ----------
  const $ = (id) => document.getElementById(id);

  const setText = (id, value) => {
    const el = $(id);
    if (el && value !== undefined && value !== null) el.textContent = value;
  };

  const setHTML = (id, value) => {
    const el = $(id);
    if (el && value !== undefined && value !== null) el.innerHTML = value;
  };

  // Small UI helper (status line under a form)
  function setFormStatus(formEl, message, ok = true) {
    if (!formEl) return;

    let el = formEl.querySelector(".form-status");
    if (!el) {
      el = document.createElement("div");
      el.className = "form-status";
      el.style.marginTop = "10px";
      el.style.fontSize = "12px";
      el.style.fontWeight = "700";
      el.style.opacity = "0.95";
      formEl.appendChild(el);
    }

    el.textContent = message;

    // Default style assumes darker section background
    el.style.color = ok ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.85)";

    // If your form is inside a light card, make errors red and ok text dark
    if (formEl.classList.contains("quote-box")) {
      el.style.color = ok ? "rgba(11,19,36,.75)" : "rgba(160,0,0,.9)";
    }
  }

  async function postQuote(payload) {
    const url = "/api/quote";
    // console.log("POST", url, payload);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.ok === false) {
      const msg = json.error || `Request failed (${res.status})`;
      throw new Error(msg);
    }
    return json;
  }

  // ---------- year ----------
  const yearEl = $("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- page title ----------
  if (DATA.page?.title) document.title = DATA.page.title;

  // ---------- header / brand ----------
  setText("brandName", DATA.brand?.name ?? "");

  const headerPhone = $("headerPhone");
  if (headerPhone) {
    headerPhone.textContent = DATA.brand?.callCta?.label ?? "Call Now";
    headerPhone.href = DATA.brand?.callCta?.href ?? `tel:${DATA.brand?.phone ?? ""}`;
  }

  const headerCTA = $("headerCTA");
  if (headerCTA) {
    headerCTA.textContent = DATA.brand?.primaryCta?.label ?? "Get Quote";
    headerCTA.href = DATA.brand?.primaryCta?.href ?? "#contact";
  }

  // ---------- nav ----------
  function renderNav() {
    const nav = $("mainNav");
    const mobile = $("mobileNav");
    const items = Array.isArray(DATA.nav) ? DATA.nav : [];

    if (nav) {
      nav.innerHTML = items.map((i) => `<a href="${i.href}">${i.label}</a>`).join("");
      nav.setAttribute("aria-label", "Primary navigation");
      nav.classList.add("nav-links");
    }

    if (mobile) {
      mobile.innerHTML = `
        ${items.map((i) => `<a href="${i.href}">${i.label}</a>`).join("")}
        <div class="mobile-actions">
          <a class="btn-outline-dark" href="${DATA.brand?.callCta?.href ?? `tel:${DATA.brand?.phone ?? ""}`}">
            ${DATA.brand?.callCta?.label ?? "Call Now"}
          </a>
          <a class="btn-primary" href="${DATA.brand?.primaryCta?.href ?? "#contact"}">
            ${DATA.brand?.primaryCta?.label ?? "Get Quote"}
          </a>
        </div>
      `;
      mobile.hidden = true;
      mobile.classList.add("mobile-menu");
    }
  }

  // ---------- hero ----------
  function renderHero() {
    setText("heroTitle", DATA.hero?.title ?? "");
    setText("heroSubtitle", DATA.hero?.subtitle ?? "");

    const primaryBtn = $("heroPrimaryBtn");
    if (primaryBtn) {
      primaryBtn.textContent = DATA.hero?.buttons?.primary?.label ?? "Get Free Quote";
      primaryBtn.href = DATA.hero?.buttons?.primary?.href ?? "#contact";
    }

    const secondaryBtn = $("heroSecondaryBtn");
    if (secondaryBtn) {
      secondaryBtn.textContent = DATA.hero?.buttons?.secondary?.label ?? "View Projects";
      secondaryBtn.href = DATA.hero?.buttons?.secondary?.href ?? "#projects";
    }

    const trust = $("trustBadges");
    if (trust) {
      trust.innerHTML = (DATA.hero?.trustBadges ?? []).map((t) => `<span>${t}</span>`).join("");
    }
  }

  // ---------- quick quote ----------
  function renderQuickQuote() {
    setText("quoteTitle", DATA.quickQuote?.title ?? "Get a Quick Quote");
    setText("quoteBtn", DATA.quickQuote?.buttonLabel ?? "Submit");
    setText("quoteNote", DATA.quickQuote?.note ?? "");

    const select = $("quoteServices");
    if (select) {
      select.innerHTML = (DATA.quickQuote?.services ?? []).map((s) => `<option>${s}</option>`).join("");
    }
  }

  // ---------- services ----------
  function renderServices() {
    setText("servicesTitle", DATA.services?.title ?? "");
    setText("servicesSubtitle", DATA.services?.subtitle ?? "");

    const grid = $("servicesGrid");
    if (!grid) return;

    grid.innerHTML = (DATA.services?.cards ?? [])
      .map(
        (c) => `
        <div class="card animate">
          <img src="${c.img}" alt="${c.alt ?? c.title}">
          <div class="card-body">
            <h4>${c.title}</h4>
            <p>${c.linkLabel ?? "Learn More →"}</p>
          </div>
        </div>
      `
      )
      .join("");
  }

  // ---------- projects / carousel slides ----------
  function renderProjects() {
    setText("projectsTitle", DATA.projects?.title ?? "Featured Projects");
    setText("projectsSubtitle", DATA.projects?.subtitle ?? "");
    setText("projectsNote", DATA.projects?.note ?? "");

    const track = $("carouselTrack");
    if (!track) return;

    track.innerHTML = (DATA.projects?.slides ?? [])
      .map(
        (s) => `
        <article class="carousel-slide">
          <div class="slide-pad">
            <img src="${s.img}" alt="${s.alt ?? s.title ?? "Project"}">
            <div class="slide-caption">
              <h3>${s.title ?? ""}</h3>
              <p>${s.meta ?? ""}</p>
            </div>
          </div>
        </article>
      `
      )
      .join("");
  }

  // ---------- pricing + testimonials ----------
  function renderReviewsPricing() {
    const rp = DATA.reviewsPricing ?? {};

    setHTML("ratingScore", `${rp.ratingScore ?? 4.9}<span>★</span>`);
    setText("ratingSub", rp.ratingLabel ?? "from 180+ reviews");

    const pricingGrid = $("pricingGrid");
    if (pricingGrid) {
      pricingGrid.innerHTML = (rp.pricing ?? [])
        .map((p) => {
          const featured = p.featured ? " featured" : "";
          return `
          <div class="price-card${featured} animate">
            <h3>${p.name}</h3>
            <p class="muted">${p.startingAt ?? "Starting at"}</p>
            <h1>$${p.price} <span>${p.period ?? "/mo"}</span></h1>
            <button class="btn-primary btn-full" type="button">${p.buttonLabel ?? "Get Exact Quote"}</button>
          </div>
        `;
        })
        .join("");
    }

    const testGrid = $("testimonialsGrid");
    if (testGrid) {
      testGrid.innerHTML = (rp.testimonials ?? [])
        .map(
          (t) => `
        <div class="testimonial">
          <div class="avatar"></div>
          <div>
            <p class="quote">${t.quote}</p>
            <p class="byline">${t.by}</p>
          </div>
        </div>
      `
        )
        .join("");
    }
  }

  // ---------- contact ----------
  function renderContact() {
    const c = DATA.contact ?? {};

    setText("contactTitle", c.title ?? "");
    setText("contactSubtitle", c.subtitle ?? "");
    setText("contactHeadline", c.headline ?? "");
    setText("contactText", c.text ?? "");

    const meta = $("contactMeta");
    if (meta) {
      meta.innerHTML = (c.meta ?? [])
        .map((m) => {
          const value = m.href
            ? `<a class="meta-value" href="${m.href}">${m.value}</a>`
            : `<span class="meta-value">${m.value}</span>`;
          return `
            <div class="meta-item">
              <span class="meta-label">${m.label}</span>
              ${value}
            </div>
          `;
        })
        .join("");
    }

    const map = $("contactMap");
    if (map) {
      map.title = "Service area map";
      map.loading = "lazy";
      map.referrerPolicy = "no-referrer-when-downgrade";
      map.allowFullscreen = true;
      map.src = c.map?.embedSrc ?? "";
    }

    setText("mapBadge", c.map?.badge ?? "");

    setText("formTitle", c.form?.title ?? "Request a Quote");
    setText("formSubtitle", c.form?.subtitle ?? "");
    setText("formBtn", c.form?.buttonLabel ?? "Get a Quote");
    setText("formNote", c.form?.note ?? "");
  }

  // ---------- footer ----------
  function renderFooter() {
    setText("footerName", DATA.footer?.name ?? "");
  }

  // ---------- mobile menu behavior ----------
  function initMobileMenu() {
    const burger = document.querySelector(".burger");
    const mobileMenu = document.querySelector(".mobile-menu");
    if (!burger || !mobileMenu) return;

    burger.addEventListener("click", () => {
      const isOpen = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.hidden = isOpen;
    });

    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        burger.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
      });
    });
  }

  // ---------- carousel ----------
  function initCarousel() {
    try {
      const track = $("carouselTrack");
      const viewport = $("carouselViewport");
      const prevBtn = document.querySelector(".carousel-btn.prev");
      const nextBtn = document.querySelector(".carousel-btn.next");
      const dotsWrap = $("carouselDots");

      if (!track || !viewport) return;

      let index = 0;
      let autoplayTimer = null;
      let startX = 0;

      const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      const slides = () => [...track.querySelectorAll(".carousel-slide")];

      function normalizeDelta(d, n) {
        if (n <= 0) return 0;
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
        return d;
      }

      function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = "";
        slides().forEach((_, i) => {
          const b = document.createElement("button");
          b.className = "carousel-dot";
          b.type = "button";
          b.setAttribute("aria-label", `Go to slide ${i + 1}`);
          b.addEventListener("click", () => goTo(i));
          dotsWrap.appendChild(b);
        });
      }

      function setDots() {
        if (!dotsWrap) return;
        const dots = [...dotsWrap.querySelectorAll(".carousel-dot")];
        dots.forEach((d) => d.classList.remove("is-active"));
        dots[index]?.classList.add("is-active");
      }

      function setClasses() {
        const list = slides();
        list.forEach((el) => el.classList.remove("is-active", "is-prev", "is-next", "is-far"));

        const max = list.length - 1;
        if (max < 0) return;

        const prevI = index === 0 ? max : index - 1;
        const nextI = index === max ? 0 : index + 1;

        list[index]?.classList.add("is-active");
        list[prevI]?.classList.add("is-prev");
        list[nextI]?.classList.add("is-next");

        list.forEach((el, i) => {
          if (i !== index && i !== prevI && i !== nextI) el.classList.add("is-far");
        });
      }

      function layout() {
        const list = slides();
        const n = list.length;
        if (!n) return;

        const offset = Math.min(320, Math.max(170, viewport.clientWidth * 0.26));

        list.forEach((el, i) => {
          const d = normalizeDelta(i - index, n);
          const abs = Math.abs(d);

          let x = 0, s = 1, o = 1, blur = 0, z = 10;

          if (d === 0) {
            x = 0; s = 1.0; o = 1.0; blur = 0; z = 30;
          } else if (abs === 1) {
            x = d * offset; s = 0.88; o = 0.28; blur = 0.6; z = 20;
          } else if (abs === 2) {
            x = d * (offset * 1.55); s = 0.78; o = 0.12; blur = 1.1; z = 12;
          } else {
            x = d * (offset * 2.3); s = 0.72; o = 0; blur = 1.6; z = 1;
          }

          el.style.zIndex = String(z);
          el.style.opacity = String(o);
          el.style.filter = `blur(${blur}px)`;
          el.style.pointerEvents = d === 0 ? "auto" : "none";
          el.style.transform = `translate(-50%, -50%) translateX(${x}px) scale(${s})`;
        });

        setClasses();
        setDots();
      }

      function goTo(newIndex) {
        const max = slides().length - 1;
        if (max < 0) return;

        index = newIndex;
        if (index > max) index = 0;
        if (index < 0) index = max;

        layout();
      }

      function next() { goTo(index + 1); }
      function prev() { goTo(index - 1); }

      nextBtn?.addEventListener("click", next);
      prevBtn?.addEventListener("click", prev);

      window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      });

      function startAutoplay() {
        if (prefersReduced) return;
        stopAutoplay();
        autoplayTimer = setInterval(next, 3800);
      }

      function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = null;
      }

      viewport.addEventListener("mouseenter", stopAutoplay);
      viewport.addEventListener("mouseleave", startAutoplay);

      viewport.addEventListener("touchstart", (e) => {
        stopAutoplay();
        startX = e.touches[0].clientX;
      }, { passive: true });

      viewport.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const dx = endX - startX;
        if (Math.abs(dx) > 45) (dx > 0 ? prev() : next());
        startAutoplay();
      });

      let resizeTimer = null;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(layout, 80);
      });

      buildDots();
      index = slides().length >= 3 ? 1 : 0;
      layout();
      startAutoplay();
    } catch (err) {
      console.error("Carousel failed:", err);
    }
  }

  // ---------- scroll animations ----------
  function initScrollAnimations() {
    try {
      const animEls = document.querySelectorAll(".animate");
      if (!("IntersectionObserver" in window)) {
        animEls.forEach((el) => el.classList.add("show"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("show");
          });
        },
        { threshold: 0.12 }
      );

      animEls.forEach((el) => observer.observe(el));
    } catch (err) {
      console.error("Animation observer failed:", err);
      document.querySelectorAll(".animate").forEach((el) => el.classList.add("show"));
    }
  }

  // ---------- wire the forms to server ----------
  function initQuoteForms() {
    const quickForm = $("quickQuoteForm");
    const contactForm = $("contactForm");

    const quoteBtn = $("quoteBtn");
    const formBtn = $("formBtn");

    async function handleSubmit(formType) {
      const isQuick = formType === "quickQuote";

      const name = (isQuick ? $("qqName") : $("cfName"))?.value?.trim() || "";
      const phone = (isQuick ? $("qqPhone") : $("cfPhone"))?.value?.trim() || "";
      const zip = (isQuick ? $("qqZip") : $("cfZip"))?.value?.trim() || "";

      const email = isQuick ? "" : (($("cfEmail")?.value?.trim()) || "");
      const service = isQuick ? ($("quoteServices")?.value || "") : "";

      const targetForm = isQuick ? quickForm : contactForm;
      const btn = isQuick ? quoteBtn : formBtn;

      if (!name || !phone || !zip) {
        setFormStatus(targetForm, "Please fill name, phone, and zip.", false);
        return;
      }

      try {
        if (btn) {
          btn.disabled = true;
          btn.dataset.oldText = btn.textContent;
          btn.textContent = "Sending...";
        }

        setFormStatus(targetForm, "Sending...", true);

        await postQuote({
          formType,
          name,
          phone,
          zip,
          email,
          service,
          message: ""
        });

        setFormStatus(targetForm, "✅ Sent! We’ll get back to you shortly.", true);
        targetForm?.reset();
      } catch (err) {
        console.error("Quote submit failed:", err);
        setFormStatus(targetForm, `❌ ${err.message || "Failed to send. Try again."}`, false);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = btn.dataset.oldText || btn.textContent;
        }
      }
    }

    if (quickForm) {
      quickForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSubmit("quickQuote");
      });
    }

    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSubmit("contact");
      });
    }
  }

  // ---------- Render everything ----------
  renderNav();
  renderHero();
  renderQuickQuote();
  renderServices();
  renderProjects();
  renderReviewsPricing();
  renderContact();
  renderFooter();

  // ---------- Init behaviors ----------
  initMobileMenu();
  initCarousel();
  initScrollAnimations();
  initQuoteForms();
})();
