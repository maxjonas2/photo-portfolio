const contentType = "image/jpeg";
const path = "FOTO1.jpg";

const HEADER_HIDDEN_SCROLL_POINT = 300;
const HERO = document.querySelector(".hero-container");

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
