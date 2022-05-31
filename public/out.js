(() => {
  // javascript/index.js
  var HEADER_HIDDEN_SCROLL_POINT = 300;
  var HERO = document.querySelector(".hero-container");
  var menu = document.getElementById("menu");
  var btnSignIn = document.getElementById("btn-signin");
  var menuContainer = document.getElementById("menu-container");
  var btnHamburger = document.getElementById("btn-hamburger");
  var btnMenuClose = document.getElementById("btn-menu-close");
  var isSmallScreen = window.matchMedia("(max-width: 500px)").matches;
  var isMenuOpen = false;
  btnSignIn && btnSignIn.addEventListener("click", (e) => {
    e.preventDefault();
    googleSignIn();
  });
  $(".menu-link").on("click", () => {
    setTimeout(() => {
      closeMenu();
    }, 250);
  });
  document.body.addEventListener("click", (e) => {
    if (e.target === btnMenuClose || e.target === menuContainer) {
      closeMenu();
    }
  });
  if (btnHamburger) {
    btnHamburger.addEventListener("click", openMenu);
  }
  var hideMenuCallBack = () => {
    $(menuContainer).hide();
  };
  if (menu) {
    menu.addEventListener("transitionend", () => {
      if (!isMenuOpen) {
        hideMenuCallBack();
      }
    });
  }
  function openMenu() {
    isMenuOpen = true;
    $(menuContainer).show();
    setTimeout(() => {
      menu.classList.add("shown");
    }, 0);
  }
  function closeMenu() {
    isMenuOpen = false;
    menu.classList.remove("shown");
  }
  function moveBackground() {
    if (!HERO)
      return;
    HERO.style.backgroundPosition = `center ${window.scrollY * 0.5555}px`;
  }
  moveBackground();
  window.addEventListener("scroll", () => {
    requestAnimationFrame(moveBackground);
  });
  var scrollInterval = setInterval(checkScroll, 500);
  function checkScroll() {
    const headerShown = window.scrollY < HEADER_HIDDEN_SCROLL_POINT;
    toggleHeader(headerShown);
  }
  function toggleHeader(shown) {
    const HEADER_REF = document.querySelector(".header-main");
    !shown ? HEADER_REF.classList.add("opaque") : HEADER_REF.classList.remove("opaque");
  }
  var slideIntoViewObserver = new IntersectionObserver(slideIntoViewCallback);
  function slideIntoViewCallback(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }
  Array.from(document.getElementsByClassName("slide-on-view")).forEach((child) => {
    child.style.transitionDelay = "100ms";
    child.classList.add("slide-on-view");
    slideIntoViewObserver.observe(child);
  });
  Array.from(document.getElementsByClassName("children-slide")).forEach((container) => {
    Array.from(container.children).forEach((child, index) => {
      child.style.transitionDelay = ((isSmallScreen ? 0 : 0) + 0 * index * (isSmallScreen ? 1 : 2.5)).toString() + "ms";
      child.classList.add("slide-on-view");
      slideIntoViewObserver.observe(child);
    });
  });
})();
