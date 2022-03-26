import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCqJ0CZmuAYkau-pZg66zfUWswXgVmr0sA",
  authDomain: "photo-portolio.firebaseapp.com",
  databaseURL: "https://photo-portolio-default-rtdb.firebaseio.com",
  projectId: "photo-portolio",
  storageBucket: "photo-portolio.appspot.com",
  messagingSenderId: "233123194430",
  appId: "1:233123194430:web:b4932f559227dc5572536f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const dbTextRef = ref(db, "homepage/text/section1");
onValue(dbTextRef, snapshot => {
  const par = document.querySelector(".aside-info > p");
  if (par) {
    console.log(snapshot.val());
  }
});

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

menuContainer &&
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
          (isSmallScreen ? 0 : 100) +
          100 * index * (isSmallScreen ? 1 : 2.5)
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
const origin = window.location.origin.replace(/\:\d{4}/, `:${PORT}`);
// const origin = "https://jkieling.netlify.app";

const baseUrl = "https://storage.googleapis.com";
const bucketBaseName = "kieling-portfolio-images-";

const lightboxOverlay = document.querySelector(".lightbox-overlay");
const lightboxContainer = document.querySelector(".lightbox-container");
const lightboxCloseButton = document.querySelector(".btn-lightbox-close");
const nextButton = document.querySelector("#lightbox-btn-next");
const backButton = document.querySelector("#lightbox-btn-back");

function lightboxToggle(status) {
  if (status === "closed") {
    lightboxContainer.innerHTML = "";
    lightboxOverlay.classList.remove("shown");
  } else {
    lightboxOverlay.classList.add("shown");
  }
}

document.body.addEventListener("click", e => {
  console.log(e.target);
  if (
    e.target === lightboxOverlay ||
    e.target === lightboxContainer ||
    e.target === lightboxCloseButton
  ) {
    lightboxToggle("closed");
  }
});

function getNewElement(type, classList) {
  const element = document.createElement(type);
  element.classList.add(...classList);
  return element;
}

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

  lightboxContainer.querySelector("img").src =
    baseUrl + "/" + getBucketName(object.bucket) + "/" + idList[lbCurrentIndex];
}

function openLightbox(event) {
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
  nextButton.onclick = () => {
    lightboxChangeImage("next", lightboxContainer, object, idList);
  };
  backButton.onclick = () => {
    lightboxChangeImage("back", lightboxContainer, object, idList);
  };

  lightboxOverlay.classList.add("shown");

  const image = document.createElement("img");
  const url = baseUrl + "/" + getBucketName(object.bucket) + "/" + object.id;

  image.src = url;
  image.style.visibility = "hidden";
  image.onload = function () {
    image.style.visibility = "visible";
  };
  lightboxContainer.append(image);
}

function populateGallery(data) {
  const galleryMosaic = document.getElementById("gallery-mosaic");
  if (!galleryMosaic) return;
  galleryMosaic.innerHTML = "";
  const isWebkit = navigator.userAgent.indexOf("AppleWebKit") !== -1;
  galleryMosaic.append(
    ...data.map((item, index) => {
      const container = document.createElement("div");
      container.classList.add("gallery-item");
      container.setAttribute("data-id", item.name);
      container.setAttribute("data-bucket", item.bucket.split("-")[0]);
      container.addEventListener("click", openLightbox);

      const loader = document.createElement("img");
      loader.src = "loader.svg";
      loader.classList.add("loader");
      container.append(loader);

      const image = document.createElement("img");
      image.src = item.url;
      image.classList.add("fade-on-view");
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
  rootMargin: "-20% 0% -20% 0%"
});

function fadeOnViewCallback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      if (isSmallScreen) {
        // entry.target.style.transform = "scale(1)";
      }
    } else {
      entry.target.style.opacity = 0.1;
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