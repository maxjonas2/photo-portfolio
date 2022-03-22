const contentType = "image/jpeg";
const path = "FOTO1.jpg";

const HEADER_HIDDEN_SCROLL_POINT = 300;
const HERO = document.querySelector(".hero-container");

const menu = document.getElementById("menu");
const menuContainer = document.getElementById("menu-container");
const isSmallScreen = window.matchMedia("(max-width: 500px)").matches;

function openMenu() {
  menu.parentElement.style.display = "block";
  menu.parentElement.classList.add("shown");
  menu.classList.add("shown");
}

function closeMenu() {
  menu.parentElement.style.display = "none";
  menu.parentElement.classList.remove("shown");
  menu.classList.remove("shown");
}

menuContainer.addEventListener("click", e => {
  if (e.target === menuContainer) {
    closeMenu();
  }
});

let scrollMap = 0;

function moveBackground() {
  const scrollMap = window.scrollY / 45;
  HERO ? (HERO.style.backgroundPosition = `center ${scrollMap * 25}px`) : null;
  // document.body.style.backgroundColor = `hsl(250, 0%, ${scrollMap / 2}%)`;
  requestAnimationFrame(moveBackground);
}

requestAnimationFrame(moveBackground);

let scrollInterval = setInterval(checkScroll, 1000);

function checkScroll() {
  const headerShown = window.scrollY < HEADER_HIDDEN_SCROLL_POINT;
  toggleHeader(headerShown);
}

function toggleHeader(shown) {
  const HEADER_REF = document.querySelector(".header-main");
  !shown
    ? HEADER_REF.classList.add("opaque")
    : HEADER_REF.classList.remove("opaque");
}

const slideIntoViewObserver = new IntersectionObserver(slideIntoViewCallback, {
  threshold: isSmallScreen ? 0.4 : 0.6
});

function slideIntoViewCallback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
    }
  });
}

Array.from(document.getElementsByClassName("slide-on-view")).forEach(child => {
  child.style.transitionDelay = "100ms";
  child.classList.add("slide-on-view");
  slideIntoViewObserver.observe(child);
});

Array.from(document.getElementsByClassName("children-slide")).forEach(
  container => {
    Array.from(container.children).forEach((child, index) => {
      child.style.transitionDelay =
        (
          (isSmallScreen ? 0 : 100) +
          100 * index * (isSmallScreen ? 1 : 2.5)
        ).toString() + "ms";
      child.classList.add("slide-on-view");
      slideIntoViewObserver.observe(child);
    });
  }
);
