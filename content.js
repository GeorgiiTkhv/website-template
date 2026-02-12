/* =====================================================
   CENTRAL SITE CONTENT
   Edit ONLY this file to customize the site
   ===================================================== */

window.SITE_DATA = {

  api: {
    baseUrl: "http://localhost:3000"
  },
  /* =====================================================
     COMPANY INFO (MAIN CONTROL PANEL)
     ===================================================== */
  company: {
    name: "Test Company Landscaping",
    phone: "(555) 123-4567",
    phoneRaw: "+15551234567",
    email: "info@greenscape.com",
    location: "Houston, TX",
    website: "https://greenscape.com"
  },


  /* =====================================================
     PAGE META (AUTO-GENERATED)
     ===================================================== */
  page: {
    titleTemplate: "{name} — Professional Lawn & Landscape"
  },


  /* =====================================================
     BRAND / HEADER
     ===================================================== */
  brand: {
    callCta: {
      label: "Call Now"
    },
    primaryCta: {
      label: "Get Quote",
      href: "#contact"
    }
  },


  /* =====================================================
     NAVIGATION
     ===================================================== */
  nav: [
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" }
  ],


  /* =====================================================
     HERO
     ===================================================== */
  hero: {
    title: "Landscapes that feel like home.",
    subtitle: "Design, install, and maintenance. Licensed & insured. Fast estimates.",

    buttons: {
      primary: { label: "Get Free Quote", href: "#contact" },
      secondary: { label: "View Projects", href: "#projects" }
    },

    trustBadges: [
      "✔ Licensed & Insured",
      "★★★★★ 4.9 Rating",
      "10+ Years Experience",
      "✔ Satisfaction Guaranteed"
    ]
  },


  /* =====================================================
     QUICK QUOTE
     ===================================================== */
  quickQuote: {
    title: "Get a Quick Quote",
    buttonLabel: "Submit",
    note: "Most estimates delivered in 24–48 hours.",

    services: [
      "Landscape Design",
      "Lawn Care & Maintenance",
      "Mulch & Planting",
      "Patios & Hardscapes",
      "Outdoor Lighting"
    ]
  },


  /* =====================================================
     SERVICES
     ===================================================== */
  services: {
    title: "Everything your yard needs, handled by one crew.",
    subtitle: "Pick a service or bundle multiple for the best value.",

    cards: [
      {
        title: "Landscape Design",
        img: "images/service1.jpg",
        alt: "Landscape design"
      },
      {
        title: "Lawn Care & Maintenance",
        img: "images/service2.jpg",
        alt: "Lawn care"
      },
      {
        title: "Mulch & Planting",
        img: "images/service3.jpg",
        alt: "Mulch and planting"
      },
      {
        title: "Patios & Hardscapes",
        img: "images/service4.jpg",
        alt: "Patios and hardscapes"
      },
      {
        title: "Outdoor Lighting",
        img: "images/service5.jpg",
        alt: "Outdoor lighting"
      }
    ]
  },


  /* =====================================================
     PROJECTS / SLIDER
     ===================================================== */
  projects: {
    title: "Featured Projects",
    subtitle: "Swipe or use arrows to browse.",
    note: "Most estimates delivered in 24–48 hours.",

    slides: [
      {
        title: "Front Yard Refresh",
        meta: "Cleanup • Mulch • Stone edging",
        img: "images/project1.jpg"
      },
      {
        title: "Luxury Backyard Remodel",
        meta: "Naperville • Pavers • Lighting",
        img: "images/project2.jpg"
      },
      {
        title: "Patio & Planting",
        meta: "Paver patio • New beds • Lighting",
        img: "images/project3.jpg"
      },
      {
        title: "Modern Pond Design",
        meta: "Water feature • Turf • Edging",
        img: "images/project4.jpg"
      },
      {
        title: "Backyard Lighting",
        meta: "Path lights • Uplighting • Warm glow",
        img: "images/project5.jpg"
      }
    ]
  },


  /* =====================================================
     REVIEWS + PRICING
     ===================================================== */
  reviewsPricing: {
    ratingScore: 4.9,
    ratingLabel: "from 180+ reviews",

    pricing: [
      {
        name: "Basic Maintenance",
        price: 149,
        period: "/mo"
      },
      {
        name: "Premium Yard Care",
        price: 229,
        period: "/mo",
        featured: true
      },
      {
        name: "Full Service Package",
        price: 349,
        period: "/mo"
      }
    ],

    testimonials: [
      {
        quote: "Our yard has never looked better! Excellent service and attention to detail.",
        by: "— Sarah M., Glenview"
      },
      {
        quote: "Professional and reliable. They showed up on time and nailed the patio lighting.",
        by: "— James P., Naperville"
      }
    ]
  },


  /* =====================================================
     CONTACT
     ===================================================== */
  contact: {
    title: "Get a Free Quote Today",
    subtitle: "Fast estimates — usually within 24–48 hours.",

    headline: "We’re local to Chicagoland",
    text: "Call, message, or request a quote — we reply fast.",

   map: {
    zoom: 10,
    badgeTemplate: "Serving {location}"
    },


    form: {
      title: "Request a Quote",
      subtitle: "Tell us what you need — we’ll get back to you quickly.",
      buttonLabel: "Get a Quote",
      note: "Most estimates delivered in 24–48 hours."
    }
  },


  /* =====================================================
     FOOTER
     ===================================================== */
  footer: {
    name: ""
  }

};



/* =====================================================
   AUTO-SYNC ENGINE (DO NOT EDIT)
   ===================================================== */

(function autoSync() {

  const data = window.SITE_DATA;
  const c = data.company;

  if (!c) return;

  /* ---------- Brand ---------- */
  data.brand.name = c.name;
  data.footer.name = c.name;

  /* ---------- Phone CTA ---------- */
  data.brand.callCta.href = `tel:${c.phoneRaw}`;

  /* ---------- Contact Meta ---------- */
  data.contact.meta = [
    {
      label: "Call",
      value: c.phone,
      href: `tel:${c.phoneRaw}`
    },
    {
      label: "Email",
      value: c.email,
      href: `mailto:${c.email}`
    },
    {
      label: "Serving",
      value: c.location
    }
  ];

  /* ---------- Page Title ---------- */
  if (data.page?.titleTemplate) {
    data.page.title = data.page.titleTemplate
      .replace("{name}", c.name)
      .replace("{location}", c.location ?? "");
  }

  /* ---------- Map (AUTO from location) ---------- */

if (data.contact?.map && c.location) {

  const encodedLocation = encodeURIComponent(c.location);

  const zoom = data.contact.map.zoom || 10;

  data.contact.map.embedSrc =
    `https://www.google.com/maps?q=${encodedLocation}&z=${zoom}&output=embed`;

  if (data.contact.map.badgeTemplate) {
    data.contact.map.badge =
      data.contact.map.badgeTemplate.replace("{location}", c.location);
  }
}


})();
