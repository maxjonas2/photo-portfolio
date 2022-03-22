let lightboxOpen = false;
let lbCurrentIndex = 0;

const PORT = "8888";
// const origin = window.location.origin.replace(/\:\d{4}/, `:${PORT}`);
const origin = "https://jkieling.netlify.app";

const baseUrl = "https://storage.googleapis.com";
const bucketBaseName = "kieling-portfolio-images-";
const isSmallScreen = window.innerWidth < 500;

const lightboxOverlay = document.querySelector(".lightbox-overlay");
const lightboxContainer = document.querySelector(".lightbox-container");
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
  if (e.target === lightboxOverlay || e.target === lightboxContainer) {
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

function getBucketName(id) {
  return "kieling-portfolio-images-" + id.replace(" ", "%20") + "-small";
}

function lightboxChangeImage(direction, container, object, idList) {
  if (lbCurrentIndex === 0) {
    lbCurrentIndex = idList.findIndex(item => item === object.id);
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
  lightboxContainer.append(image);
}

function populateGallery(data) {
  const galleryMosaic = document.getElementById("gallery-mosaic");
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
  rootMargin: "-10% 0% -10% 0%"
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
    imgCount = Array.from(data).length;
    populateGallery(data);
  });
}

function switchGallery(value) {
  loadGallery(value);
}

$(() => {
  const pickerCategories = $(".picker-category-title");
  pickerCategories.on("click", e => {
    pickerCategories.removeClass("selected");
    $(e.target).addClass("selected");
    switchGallery(e.target.dataset.value);
  });
});

loadGallery("concerts");
