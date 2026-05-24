/**
 * Delish Restaurant — interactions
 */

const MENU_ITEMS = [
  { name: "Wild Mushroom Arancini", price: 15, desc: "Ricotta, goat cheese, beetroot and dateline.", category: "dinner", image: "images/menu-arancini.jpg", stars: 5 },
  { name: "Honey Glazed Salmon", price: 22, desc: "Pan-seared with citrus glaze and herbs.", category: "dinner", image: "images/menu-salmon.jpg", stars: 5 },
  { name: "Truffle Mushroom Risotto", price: 18, desc: "Creamy arborio rice with wild mushrooms.", category: "dinner", image: "images/menu-risotto.jpg", stars: 5 },
  { name: "Classic Caesar Salad", price: 12, desc: "Crisp romaine, parmesan, house dressing.", category: "lunch", image: "images/menu-salad.jpg", stars: 4 },
  { name: "Braised Short Ribs", price: 26, desc: "Slow-cooked until fork-tender.", category: "dinner", image: "images/menu-ribs.jpg", stars: 5 },
  { name: "Chocolate Lava Cake", price: 10, desc: "Warm center with vanilla bean ice cream.", category: "breakfast", image: "images/menu-cake.jpg", stars: 5 },
  { name: "Mediterranean Quinoa Salad", price: 14, desc: "Fresh vegetables, feta, lemon vinaigrette.", category: "lunch", image: "images/menu-quinoa.jpg", stars: 4 },
  { name: "Chicken Masala", price: 19, desc: "Aromatic spices in rich tomato sauce.", category: "dinner", image: "images/menu-masala.jpg", stars: 5 },
  { name: "Avocado Toast", price: 11, desc: "Sourdough, poached egg, chili flakes.", category: "breakfast", image: "images/menu-toast.jpg", stars: 4 },
  { name: "Szechuan Beef Stir-Fry", price: 20, desc: "Wok-tossed with peppers and jasmine rice.", category: "lunch", image: "images/menu-beef.jpg", stars: 5 },
];

function renderMenu(filter = "all") {
  const listEl = document.getElementById("menu-list");
  const gridEl = document.getElementById("menu-grid");
  if (!listEl || !gridEl) return;

  const filtered =
    filter === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === filter);

  const listItems = filtered.slice(0, 5);
  const featured = filtered[0] || MENU_ITEMS[0];

  listEl.innerHTML = `
    <img class="menu-list__featured" src="${featured.image}" alt="${featured.name}" width="340" height="255" loading="lazy" />
    ${listItems
      .map(
        (item) => `
      <article class="menu-item">
        <div class="menu-item__row">
          <h4>${item.name}</h4>
          <span class="menu-item__price">$${item.price.toFixed(2)}</span>
        </div>
        <p>${item.desc}</p>
      </article>`
      )
      .join("")}
  `;

  gridEl.innerHTML = filtered
    .map(
      (item) => `
    <article class="menu-card" data-category="${item.category}">
      <img src="${item.image}" alt="${item.name}" width="280" height="280" loading="lazy" />
      <div class="menu-card__stars" aria-label="${item.stars} out of 5 stars">${"★".repeat(item.stars)}${"☆".repeat(5 - item.stars)}</div>
      <h4>${item.name}</h4>
      <span class="menu-card__price">$${item.price.toFixed(2)}</span>
    </article>`
    )
    .join("");
}

/* Hero slider */
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero__slide");
  const dots = document.querySelectorAll(".hero__dots button");
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === current);
      d.setAttribute("aria-selected", i === current ? "true" : "false");
    });
  }

  function next() {
    goTo(current + 1);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(i);
      resetTimer();
    });
  });

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, 6000);
  }

  resetTimer();
}

/* Menu filters */
function initMenuFilters() {
  const buttons = document.querySelectorAll(".menu-filters__btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderMenu(btn.dataset.filter);
    });
  });
}

/* Gallery scroll */
function initGallery() {
  const track = document.getElementById("gallery-track");
  const prev = document.getElementById("gallery-prev");
  const next = document.getElementById("gallery-next");
  if (!track) return;

  const scrollAmount = 300;
  prev?.addEventListener("click", () => track.scrollBy({ left: -scrollAmount, behavior: "smooth" }));
  next?.addEventListener("click", () => track.scrollBy({ left: scrollAmount, behavior: "smooth" }));
}

/* Mobile nav */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
}

/* Active nav on scroll */
function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll('.site-nav a[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          links.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}

/* Forms */
function initForms() {
  const bookingForm = document.getElementById("booking-form");
  const bookingMsg = document.getElementById("booking-message");
  const contactForm = document.getElementById("contact-form");
  const contactMsg = document.getElementById("contact-message");
  const newsletterForm = document.getElementById("newsletter-form");

  bookingForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }
    bookingMsg.textContent = "Thank you! Your reservation request has been received. We will confirm shortly.";
    bookingMsg.hidden = false;
    bookingForm.reset();
  });

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    contactMsg.textContent = "Message sent successfully. We will get back to you soon.";
    contactMsg.hidden = false;
    contactForm.reset();
  });

  newsletterForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    if (input?.value) {
      input.value = "";
      alert("Thanks for subscribing to Delish updates!");
    }
  });
}

/* Set min date on booking */
function initBookingDate() {
  const dateInput = document.querySelector('#booking-form input[type="date"]');
  if (!dateInput) return;
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);
}

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  initHeroSlider();
  initMenuFilters();
  initGallery();
  initNav();
  initScrollSpy();
  initForms();
  initBookingDate();
});
