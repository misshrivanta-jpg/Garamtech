"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const main = document.querySelector("#main");
const pageItems = Array.from(main.children);
const backToTop = document.querySelector(".back-to-top");
const scrollProgressBar = document.querySelector("#scrollProgressBar");
const pageTitles = {
  home: "Garamtech Solutions | Water Heating & Treatment",
  about: "About Us | Garamtech Solution",
  products: "Products | Garamtech Solution",
  services: "Services | Garamtech Solution",
  projects: "Our Projects | Garamtech Solution",
  "why-us": "Why Us | Garamtech Solution",
  contact: "Contact | Garamtech Solution"
};
const pageIds = new Set(Object.keys(pageTitles));
const navPageLinks = Array.from(navMenu.querySelectorAll("a[href^='#']:not(.button)"));
const isPageSwitcher = pageItems.some((item) => item.matches("[data-page]"));

function pageForHash(hash) {
  const targetId = decodeURIComponent(hash.replace(/^#/, ""));
  if (targetId === "top") return "home";

  const target = document.getElementById(targetId);
  const pageItem = target && target.closest("[data-page]");
  return pageItem && pageIds.has(pageItem.dataset.page) ? pageItem.dataset.page : null;
}

function closeMobileMenu() {
  navMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

function showPage(page, { updateHistory = false, scroll = false } = {}) {
  if (!pageIds.has(page)) page = "home";

  pageItems.forEach((item) => {
    item.hidden = item.dataset.page !== page;
  });
  navPageLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${page}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.title = pageTitles[page];

  if (updateHistory && window.location.hash !== `#${page}`) {
    window.history.pushState({ page }, "", `#${page}`);
  }
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });

  main.classList.remove("page-transition");
  void main.offsetWidth;
  main.classList.add("page-transition");
}

function syncPageFromLocation() {
  const page = pageForHash(window.location.hash) || "home";
  showPage(page, { scroll: true });
}

if (isPageSwitcher) {
  const initialPage = pageForHash(window.location.hash) || "home";
  if (!window.location.hash || !pageForHash(window.location.hash)) {
    window.history.replaceState({ page: initialPage }, "", `#${initialPage}`);
  }
  showPage(initialPage);
  window.addEventListener("popstate", syncPageFromLocation);
  window.addEventListener("hashchange", syncPageFromLocation);
}

document.addEventListener("click", (event) => {
  if (!isPageSwitcher) return;
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest("a[href^='#']");
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target) return;

  const hash = link.getAttribute("href");
  const page = pageForHash(hash);
  if (!page) return;

  event.preventDefault();
  closeMobileMenu();
  showPage(page, { updateHistory: true, scroll: true });
});

function updateScrollChrome() {
  if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 500);

  if (scrollProgressBar) {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    scrollProgressBar.style.width = `${scrolled}%`;
  }
}
window.addEventListener("scroll", updateScrollChrome, { passive: true });
updateScrollChrome();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navMenu.classList.toggle("open", !isOpen);
});
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});
document.addEventListener("click", (event) => {
  if (event.target instanceof Node && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMobileMenu();
  }
});
if (backToTop) {
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const counters = document.querySelectorAll(".counter");
function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1100;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    counter.textContent = String(Math.floor(target * (1 - Math.pow(1 - progress, 3))));
    if (progress < 1) window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);
}
if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => { counter.textContent = counter.dataset.target; });
}

const elementSpecs = {
  "1": ["Small point-of-use tanks", "Up to 50 L"],
  "1.5": ["Domestic / light commercial tanks", "50–80 L"],
  "2": ["Domestic and small commercial tanks", "80–100 L"],
  "3": ["Small commercial hot water systems", "100–150 L"],
  "4": ["Commercial storage and process tanks", "150–200 L"],
  "5": ["Commercial hot water applications", "200–250 L"],
  "6": ["Larger commercial storage systems", "250–300 L"],
  "8": ["Commercial and light industrial tanks", "300–400 L"],
  "10": ["Industrial and high-demand systems", "400–500 L"],
  "12": ["Industrial process and storage tanks", "500–600 L"],
  "15": ["Large industrial hot water systems", "600–750 L"],
  "18": ["High-capacity industrial applications", "750–900 L"],
  "24": ["Large-capacity industrial applications", "900 L+"]
};
const elementTiles = Array.from(document.querySelectorAll(".element-tile"));
const elementFocus = document.querySelector(".element-focus");
function highlightElementTile(index) {
  if (!elementTiles.length || !elementFocus) return;
  const tileIndex = index % elementTiles.length;
  const tile = elementTiles[tileIndex];
  elementTiles.forEach((item) => item.classList.toggle("selected", item === tile));
  elementFocus.style.left = `${tile.offsetLeft}px`;
  elementFocus.style.top = `${tile.offsetTop}px`;
  elementFocus.style.width = `${tile.offsetWidth}px`;
  elementFocus.style.height = `${tile.offsetHeight}px`;
}
document.querySelectorAll(".kw-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".kw-button.active").classList.remove("active");
    button.classList.add("active");
    const [use, tank] = elementSpecs[button.dataset.kw];
    const ratingIndex = Array.from(document.querySelectorAll(".kw-button")).indexOf(button);
    highlightElementTile(ratingIndex);
    document.querySelector("#spec-rating").textContent = `${button.dataset.kw} kW`;
    document.querySelector("#spec-use").textContent = use;
    document.querySelector("#spec-tank").textContent = tank;
  });
});
window.addEventListener("resize", () => {
  const activeRating = document.querySelector(".kw-button.active");
  if (activeRating) highlightElementTile(Array.from(document.querySelectorAll(".kw-button")).indexOf(activeRating));
});
highlightElementTile(0);

const interestSelect = document.querySelector("#interest");
document.querySelectorAll("[data-interest]").forEach((link) => {
  link.addEventListener("click", () => {
    const interest = link.dataset.interest;
    const option = Array.from(interestSelect.options).find((item) => item.text === interest);
    if (option) interestSelect.value = option.value;
  });
});

const projects = [
  { id: 1, image: "images/projects/goa-st-regis.jpg", brand: "Midea", site: "St. Regis Goa Hotel", displayName: "St. Regis Goa Hotel", city: "Goa", capacity: 8000, description: "8000-litre Midea heat pump water heating system installed for the hotel." },
  { id: 2, image: "images/projects/dehradun-taj.jpg", brand: "Midea", site: "Taj Hotel Dehradun", displayName: "Taj Hotel Dehradun", city: "Dehradun", capacity: 6000, description: "6000-litre Midea heat pump water heating system installed for the hotel." },
  { id: 3, image: "images/projects/manesar-holiday-inn.jpg", brand: "Midea", site: "Holiday Inn Hotel", displayName: "Holiday Inn Hotel (Manesar)", city: "Manesar", capacity: 5000, description: "5000-litre Midea heat pump water heating system installed for the hotel." },
  { id: 4, image: "images/projects/manesar-golden-tulip.jpg", brand: "Greentek", site: "Golden Tulip Hotel", displayName: "Golden Tulip Hotel (Manesar)", city: "Manesar", capacity: 10000, description: "10000-litre Greentek heat pump water heater installed for the hotel." },
  { id: 5, image: "images/projects/amritsar-holiday-inn.jpg", brand: "Midea", site: "Holiday Inn Hotel", displayName: "Holiday Inn Hotel (Amritsar)", city: "Amritsar", capacity: 10000, description: "10000-litre Midea heat pump water heater installed for the hotel." },
  { id: 6, image: "images/projects/sonipat-ramada.jpg", brand: "Midea", site: "Ramada Hotel", displayName: "Ramada Hotel (Sonipat)", city: "Sonipat", capacity: 6000, description: "6000-litre Midea heat pump water heater installed for the hotel." },
  { id: 7, image: "images/projects/sonipat-ramada-wyndham.jpg", brand: "Midea", site: "Ramada by Wyndham Hotel", displayName: "Ramada by Wyndham Hotel (Sonipat)", city: "Sonipat", capacity: 5000, description: "5000-litre Midea heat pump water heater installed for the hotel." },
  { id: 8, image: "images/projects/delhi-bhutani-house.jpg", imageAlt: "Bhutani Group House Delhi, Greentek heat pump water heater installation", images: [
    { src: "images/projects/delhi-bhutani-house.jpg", alt: "Bhutani Group House Delhi, Greentek heat pump water heater installation" },
    { src: "images/projects/delhi-bhutani-house-2.jpg", alt: "Bhutani Group House Delhi, Greentek heat pump water heater installation" }
  ], brand: "Greentek", site: "Bhutani Group House", displayName: "Bhutani Group House (Delhi)", city: "Delhi", capacity: 3000, description: "3000-litre Greentek heat pump water heater installed for the project." }
];

const projectsGrid = document.querySelector("#projects-grid");
const projectDialog = document.querySelector("#project-dialog");

if (projectsGrid && projectDialog) {
  const projectDialogImage = projectDialog.querySelector(".project-dialog-image");
  const projectDialogImagePlaceholder = projectDialog.querySelector(".project-dialog-image-placeholder");
  const projectDialogMedia = projectDialog.querySelector(".project-dialog-media");
  const projectDialogGalleryControls = projectDialog.querySelector(".project-dialog-gallery-controls");
  const projectDialogGalleryDots = projectDialog.querySelector(".project-dialog-gallery-dots");
  const projectDialogGalleryPrevious = projectDialog.querySelector(".project-dialog-gallery-previous");
  const projectDialogGalleryNext = projectDialog.querySelector(".project-dialog-gallery-next");
  const projectDialogBrand = projectDialog.querySelector(".project-dialog-brand");
  const projectDialogTitle = projectDialog.querySelector("#project-dialog-title");
  const projectDialogLocation = projectDialog.querySelector(".project-dialog-image-location");
  const projectDialogCapacity = projectDialog.querySelector(".project-dialog-capacity");
  const projectDialogDescription = projectDialog.querySelector(".project-dialog-description");
  const projectDialogClose = projectDialog.querySelector(".project-dialog-close");
  const projectDialogPrevious = projectDialog.querySelector(".project-dialog-previous");
  const projectDialogNext = projectDialog.querySelector(".project-dialog-next");
  const projectDialogQuote = projectDialog.querySelector(".project-dialog-quote");
  let activeProjectIndex = 0;
  let activeProjectCard = null;
  let activeProjectImages = [];
  let activeProjectImageIndex = 0;
  let projectImageTouchStartX = null;

  projectsGrid.innerHTML = projects.map((project) => `
    <article class="project-card reveal" tabindex="0" role="button" aria-haspopup="dialog" aria-controls="project-dialog" aria-expanded="false" aria-label="View details for ${project.displayName}">
      <div class="project-card-media">
        <img src="${project.image}" alt="${project.imageAlt || `Heat pump water heating installation at ${project.site} in ${project.city}`}" loading="lazy">
        <div class="project-image-caption">
          <h3>${project.displayName}</h3>
          <p>${project.city}</p>
        </div>
        <span class="project-view-hint" aria-hidden="true">View details <span>↗</span></span>
      </div>
      <div class="project-card-content">
        <span class="project-brand">${project.brand}</span>
        <p class="project-capacity">${project.capacity} litres</p>
        <p class="project-description">${project.description}</p>
      </div>
    </article>
  `).join("");

  function showProjectImage(index) {
    activeProjectImageIndex = (index + activeProjectImages.length) % activeProjectImages.length;
    const image = activeProjectImages[activeProjectImageIndex];
    projectDialogImage.hidden = false;
    projectDialogImagePlaceholder.hidden = true;
    projectDialogImage.onerror = () => {
      projectDialogImage.hidden = true;
      projectDialogImagePlaceholder.hidden = false;
    };
    projectDialogImage.onload = () => {
      projectDialogImage.hidden = false;
      projectDialogImagePlaceholder.hidden = true;
    };
    projectDialogImage.alt = image.alt;
    projectDialogImage.src = image.src;
    projectDialogImagePlaceholder.setAttribute("aria-label", image.alt);
    projectDialogGalleryDots.querySelectorAll("button").forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeProjectImageIndex);
      dot.setAttribute("aria-pressed", String(dotIndex === activeProjectImageIndex));
    });
  }

  function showProject(index) {
    activeProjectIndex = (index + projects.length) % projects.length;
    const project = projects[activeProjectIndex];
    projectImageTouchStartX = null;
    activeProjectImages = project.images || [{
      src: project.image,
      alt: project.imageAlt || `Heat pump water heating installation at ${project.site} in ${project.city}`
    }];
    projectDialogGalleryControls.hidden = activeProjectImages.length < 2;
    projectDialogGalleryDots.innerHTML = activeProjectImages.map((image, imageIndex) => `
      <button class="project-dialog-gallery-dot${imageIndex === 0 ? " active" : ""}" type="button" data-image-index="${imageIndex}" aria-label="Show image ${imageIndex + 1}" aria-pressed="${imageIndex === 0}"></button>
    `).join("");
    showProjectImage(0);
    projectDialogBrand.textContent = project.brand;
    projectDialogTitle.textContent = project.displayName;
    projectDialogLocation.textContent = project.city;
    projectDialogCapacity.textContent = `${project.capacity} litres`;
    projectDialogDescription.textContent = project.description;
  }

  function openProject(index, card) {
    if (projectDialog.open) return;
    activeProjectCard = card;
    activeProjectCard.setAttribute("aria-expanded", "true");
    showProject(index);
    projectDialog.showModal();
    document.body.classList.add("project-dialog-open");
    projectDialogClose.focus({ preventScroll: true });
  }

  projectsGrid.querySelectorAll(".project-card").forEach((card, index) => {
    card.addEventListener("click", () => openProject(index, card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProject(index, card);
      }
    });
  });

  projectDialogClose.addEventListener("click", () => projectDialog.close());
  projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });
  projectDialog.addEventListener("close", () => {
    document.body.classList.remove("project-dialog-open");
    if (activeProjectCard) {
      activeProjectCard.setAttribute("aria-expanded", "false");
      activeProjectCard.focus({ preventScroll: true });
    }
    activeProjectCard = null;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectDialog.open) projectDialog.close();
  });
  projectDialogPrevious.addEventListener("click", () => showProject(activeProjectIndex - 1));
  projectDialogNext.addEventListener("click", () => showProject(activeProjectIndex + 1));
  projectDialogGalleryPrevious.addEventListener("click", () => showProjectImage(activeProjectImageIndex - 1));
  projectDialogGalleryNext.addEventListener("click", () => showProjectImage(activeProjectImageIndex + 1));
  projectDialogGalleryDots.addEventListener("click", (event) => {
    const dot = event.target.closest("button[data-image-index]");
    if (dot) showProjectImage(Number(dot.dataset.imageIndex));
  });
  projectDialogMedia.addEventListener("touchstart", (event) => {
    projectImageTouchStartX = event.touches.length === 1 ? event.touches[0].clientX : null;
  }, { passive: true });
  projectDialogMedia.addEventListener("touchend", (event) => {
    if (projectImageTouchStartX === null) return;
    const touch = event.changedTouches[0];
    const swipeDistance = touch ? touch.clientX - projectImageTouchStartX : 0;
    projectImageTouchStartX = null;
    if (activeProjectImages.length < 2) return;
    if (swipeDistance > 40) showProjectImage(activeProjectImageIndex - 1);
    else if (swipeDistance < -40) showProjectImage(activeProjectImageIndex + 1);
  }, { passive: true });
  projectDialogMedia.addEventListener("touchcancel", () => {
    projectImageTouchStartX = null;
  }, { passive: true });
  projectDialogQuote.addEventListener("click", (event) => {
    event.preventDefault();
    if (activeProjectCard) activeProjectCard.setAttribute("aria-expanded", "false");
    activeProjectCard = null;
    document.body.classList.remove("project-dialog-open");
    projectDialog.close();
    showPage("contact", { updateHistory: true, scroll: true });
  });

  const projectRevealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
    : null;

  projectsGrid.querySelectorAll(".project-card").forEach((card) => {
    if (projectRevealObserver) projectRevealObserver.observe(card);
    else card.classList.add("is-visible");
  });
}


const testimonials = Array.from(document.querySelectorAll(".testimonial"));
const sliderDots = Array.from(document.querySelectorAll(".slider-dot"));
let testimonialIndex = 0;
function showTestimonial(index) {
  if (!testimonials.length) return;
  testimonialIndex = (index + testimonials.length) % testimonials.length;
  testimonials.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === testimonialIndex));
  sliderDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === testimonialIndex);
    dot.setAttribute("aria-pressed", String(dotIndex === testimonialIndex));
  });
}
const sliderPrev = document.querySelector(".slider-prev");
const sliderNext = document.querySelector(".slider-next");
if (sliderPrev) sliderPrev.addEventListener("click", () => showTestimonial(testimonialIndex - 1));
if (sliderNext) sliderNext.addEventListener("click", () => showTestimonial(testimonialIndex + 1));
sliderDots.forEach((dot, index) => dot.addEventListener("click", () => showTestimonial(index)));
showTestimonial(0);

const contactForm = document.querySelector("#contact-form");
const formError = document.querySelector("#form-error");
const formSuccess = document.querySelector("#form-success");
if (contactForm && formError && formSuccess) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formError.textContent = "";
    formSuccess.hidden = true;
    const name = contactForm.elements.name.value.trim();
    const phone = contactForm.elements.phone.value.trim();
    const email = contactForm.elements.email.value.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    const validEmail = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || phoneDigits.length < 10 || phoneDigits.length > 15 || !validEmail) {
      formError.textContent = !name
        ? "Please enter your name."
        : phoneDigits.length < 10 || phoneDigits.length > 15
          ? "Please enter a valid phone number (10–15 digits)."
          : "Please enter a valid email address.";
      contactForm.querySelector(!name ? "#name" : phoneDigits.length < 10 || phoneDigits.length > 15 ? "#phone" : "#email").focus();
      return;
    }

    // Demo behavior only. Connect this form to your PHP/API endpoint when a backend is ready.
    contactForm.reset();
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

// ==========================================================================
// HERO BACKGROUND VIDEO CONTROLS & MOBILE DATA-SAVER
// ==========================================================================
const heroBgVideo = document.querySelector(".hero-bg-video");
const heroBgVideoSource = heroBgVideo && heroBgVideo.querySelector("source[data-src]");
if (heroBgVideo && heroBgVideoSource) {
  const heroBgVideoMedia = window.matchMedia("(min-width: 801px)");
  const reducedDataMedia = window.matchMedia("(prefers-reduced-data: reduce)");
  const syncHeroBgVideo = () => {
    if (heroBgVideoMedia.matches && !reducedDataMedia.matches) {
      heroBgVideo.preload = "metadata";
      heroBgVideo.setAttribute("autoplay", "");
      if (!heroBgVideoSource.hasAttribute("src")) {
        heroBgVideoSource.setAttribute("src", heroBgVideoSource.dataset.src);
        heroBgVideo.load();
      }
      const playPromise = heroBgVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Hero background video autoplay was blocked; the poster remains visible.", error);
        });
      }
    } else {
      heroBgVideo.pause();
      heroBgVideo.removeAttribute("autoplay");
      heroBgVideo.preload = "none";
      if (heroBgVideoSource.hasAttribute("src")) {
        heroBgVideoSource.removeAttribute("src");
        heroBgVideo.load();
      }
    }
  };
  syncHeroBgVideo();
  heroBgVideoMedia.addEventListener("change", syncHeroBgVideo);
  reducedDataMedia.addEventListener("change", syncHeroBgVideo);
}
