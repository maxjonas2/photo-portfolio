console.log("javascript called");

const contentType = "image/jpeg";
const path = "FOTO1.jpg";

const HEADER_HIDDEN_SCROLL_POINT = 300;
const HERO = document.querySelector(".hero-container");

const menu = document.getElementById("menu");
const btnSignIn = document.getElementById("btn-signin");
const menuContainer = document.getElementById("menu-container");
const btnHamburger = document.getElementById("btn-hamburger");
const btnMenuClose = document.getElementById("btn-menu-close");
const isSmallScreen = window.matchMedia("(max-width: 500px)").matches;

let isMenuOpen = false;

btnSignIn &&
  btnSignIn.addEventListener("click", e => {
    e.preventDefault();
    googleSignIn();
  });

let scrollMap = 0;

$(".menu-link").on("click", () => {
  console.log("menu link clicked");
  setTimeout(() => {
    closeMenu();
  }, 250);
});

document.body.addEventListener("click", e => {
  if (e.target === btnMenuClose || e.target === menuContainer) {
    closeMenu();
  }
});

if (btnHamburger) {
  btnHamburger.addEventListener("click", openMenu);
}

const hideMenuCallBack = () => {
  $(menuContainer).hide();
};

menu &&
  menu.addEventListener("transitionend", () => {
    if (!isMenuOpen) {
      hideMenuCallBack();
    }
  });

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
  const scrollMap = window.scrollY / 45;
  HERO ? (HERO.style.backgroundPosition = `center ${scrollMap * 25}px`) : null;
  // document.body.style.backgroundColor = `hsl(250, 0%, ${scrollMap / 2}%)`;
  // requestAnimationFrame(moveBackground);
}

moveBackground();

window.addEventListener("scroll", () => {
  requestAnimationFrame(moveBackground);
});

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

const slideIntoViewObserver = new IntersectionObserver(slideIntoViewCallback);

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
          (isSmallScreen ? 0 : 0) +
          0 * index * (isSmallScreen ? 1 : 2.5)
        ).toString() + "ms";
      child.classList.add("slide-on-view");
      slideIntoViewObserver.observe(child);
    });
  }
);

/*  ----- GALLERY FUNCTIONS ---- */

let lightboxOpen = false;
let lbCurrentIndex = 0;
let imageCount = 0;

const PORT = "8888";
// const origin = window.location.origin.replace(/\:\d{4}/, `:${PORT}`);
const origin = "https://jkieling.netlify.app";

const baseUrl = "https://storage.googleapis.com";
const bucketBaseName = "kieling-portfolio-images-";

const lightboxOverlay = document.querySelector(".lightbox-overlay");
const lightboxContainer = document.querySelector(".lightbox-container");
const lightboxImageContainer = document.querySelector(
  ".lightbox-image-container"
);
const lightboxCloseButton = document.querySelector(".btn-lightbox-close");
const nextButton = document.querySelector("#lightbox-btn-next");
const backButton = document.querySelector("#lightbox-btn-back");

function lightboxToggle(status) {
  if (status === "closed") {
    lightboxImageContainer.innerHTML = "";
    lightboxOverlay.classList.remove("shown");
  } else {
    lightboxOverlay.classList.add("shown");
  }
}

document.body.addEventListener("click", e => {
  if (
    e.target === lightboxOverlay ||
    e.target === lightboxContainer ||
    e.target === lightboxCloseButton
  ) {
    lightboxToggle("closed");
  }
});

async function fetchLinks(category) {
  const response = await window.fetch(
    `${origin}/.netlify/functions/getImages?bucket=${category}`,
    {
      method: "GET"
    }
  );

  const json = await response.json();
  return json;
}

function getBucketName(id, size = "large") {
  return "kieling-portfolio-images-" + id.replace(" ", "%20") + `-${size}`;
}

function lightboxChangeImage(direction, container, object, idList) {
  if (lbCurrentIndex === 0) {
    lbCurrentIndex = idList.findIndex(item => item === object.id);
  }

  if (direction === "next" && lbCurrentIndex === imageCount - 1) {
    return console.log("end of list");
  }

  if (direction === "next") {
    lbCurrentIndex++;
  } else {
    if (lbCurrentIndex !== 0) {
      lbCurrentIndex--;
    } else {
      return false;
    }
  }

  lightboxImageContainer.querySelector("img").src =
    baseUrl + "/" + getBucketName(object.bucket) + "/" + idList[lbCurrentIndex];
}

function openLightbox(event) {
  const escapeListener = e => {
    if (e.key.toLowerCase() === "escape") {
      console.log("escape");
      document.body.removeEventListener("keyup", escapeListener);
      lightboxToggle("closed");
    }
  };

  document.body.addEventListener("keyup", escapeListener);

  const { target } = event;
  const container = target.classList.contains("gallery-item")
    ? target
    : target.parentElement;
  const object = { bucket: container.dataset.bucket, id: container.dataset.id };
  const idList = Array.from(document.querySelectorAll(".gallery-item")).map(
    item => item.dataset.id
  );
  if (!lightboxOpen) {
    initiateLightbox(object, idList);
  }
}

function initiateLightbox(object, idList) {
  document.addEventListener("keyup", e => {
    if (e.key === "ArrowRight") {
      nextButton.click();
    } else if (e.key === "ArrowLeft") {
      backButton.click();
    }
  });

  if (nextButton || backButton) {
    nextButton.onclick = () => {
      lightboxChangeImage("next", lightboxContainer, object, idList);
    };

    backButton.onclick = () => {
      lightboxChangeImage("back", lightboxContainer, object, idList);
    };
  }

  lightboxOverlay.classList.add("shown");

  const image = document.createElement("img");
  const url = baseUrl + "/" + getBucketName(object.bucket) + "/" + object.id;

  image.src = url;
  image.style.visibility = "hidden";
  image.onload = function () {
    image.style.visibility = "visible";
  };
  lightboxImageContainer.append(image);
}

function populateGallery(data) {
  const galleryMosaic = document.getElementById("gallery-mosaic");
  if (!galleryMosaic) return;
  galleryMosaic.innerHTML = "";
  const isWebkit = navigator.userAgent.indexOf("AppleWebKit") !== -1;
  galleryMosaic.append(
    ...data.map(item => {
      const container = document.createElement("div");
      container.classList.add("gallery-item");
      $(container).attr({
        "data-id": item.name,
        "data-bucket": item.bucket.split("-")[0]
      });
      // container.setAttribute("data-id", item.name);
      // container.setAttribute("data-bucket", item.bucket.split("-")[0]);;
      container.addEventListener("click", openLightbox);

      const loader = document.createElement("img");
      loader.src = "../website_assets/svg/loader.svg";
      loader.classList.add("loader");
      container.append(loader);

      const image = document.createElement("img");
      image.src = item.url;
      image.loading = "lazy";
      image.classList.add("shadowed-card");
      // Add class "fade-on-view" for fading in on scroll into view effect
      image.addEventListener(isWebkit ? "load" : "loadend", () => {
        setTimeout(() => {
          image.classList.add("shown");
          image.previousElementSibling.remove();
        }, 100);
      });
      container.append(image);
      return container;
    })
  );
  callObserve();
}

function callObserve() {
  setTimeout(() => {
    document.querySelectorAll(".fade-on-view").forEach(element => {
      console.log("observer function called");
      fadeOnViewObserver.observe(element);
    });
  }, 1500);
}

const fadeOnViewObserver = new IntersectionObserver(fadeOnViewCallback, {
  threshold: 0,
  rootMargin: "-30% 0% -30% 0%"
});

function fadeOnViewCallback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      if (isSmallScreen) {
        // entry.target.style.transform = "scale(1)";
      }
    } else {
      entry.target.style.opacity = 0.06;
      if (isSmallScreen) {
        // entry.target.style.transform = "scale(.9)";
      }
    }
  });
}

function loadGallery(category = "all") {
  fetchLinks(category).then(data => {
    imageCount = data.length;
    populateGallery(data);
  });
}

function switchGallery(value) {
  loadGallery(value);
}

$(() => {
  const pickerCategories = $(".category-picker");
  pickerCategories.on("click", e => {
    lbCurrentIndex = 0;
    pickerCategories.removeClass("selected");
    $(e.target).addClass("selected");
    switchGallery(e.target.dataset.value);
  });
});

loadGallery("concerts");

/* ----- CONTACT FORM LOGIC ----- */

$("#form-contact").on("submit", e => {
  e.preventDefault();
  const data = new FormData(e.target);
});
