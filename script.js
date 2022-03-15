const HEADER_HIDDEN_SCROLL_POINT = 300;

let scrollInterval = setInterval(checkScroll, 1000);

function checkScroll() {
  const headerShown = window.scrollY < HEADER_HIDDEN_SCROLL_POINT;
  toggleHeader(headerShown);
}

function toggleHeader(shown) {
  const HEADER_REF = document.querySelector(".header-main");
  HEADER_REF.style.transform = `translateY(${shown ? "0" : "-4"}rem)`;
}
