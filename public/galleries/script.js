let lightboxOpen = false;

function getNewElement(type, classList) {
  const element = document.createElement(type);
  element.classList.add(...classList);
  return element;
}

async function fetchLinks(category) {
  const response = await fetch(
    "http://localhost:8000/images/small/" + category,
    {
      method: "get"
    }
  );
  return await response.json();
}

function getBucketName(id) {
  return "kieling-portfolio-images-" + id.replace(" ", "%20") + "-small";
}

function lightboxChangeImage(direction, container, object, idList) {
  const index = idList.findIndex(item => item.id === object.id);
  console.log(index);
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
  const overlay = document.querySelector(".lightbox-overlay");
  const container = document.querySelector(".lightbox-container");
  const nextButton = document.querySelector("#lightbox-btn-next");
  const backButton = document.querySelector("#lightbox-btn-back");

  nextButton.onclick = () => {
    lightboxChangeImage("next", container, object, idList);
  };
  backButton.onclick = () => {
    lightboxChangeImage("back", container, object, idList);
  };

  overlay.classList.add("shown");

  const image = document.createElement("img");
  const url =
    "https://storage.googleapis.com/" +
    getBucketName(object.bucket) +
    "/" +
    object.id;

  image.src = url;
  container.append(image);
}

function populateGallery(data) {
  const galleryMosaic = document.getElementById("gallery-mosaic");
  galleryMosaic.innerHTML = "";
  galleryMosaic.append(
    ...data.map(item => {
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
      image.addEventListener("loadend", e => {
        image.classList.add("shown");
        image.previousElementSibling.remove();
      });
      container.append(image);
      return container;
    })
  );
}

function loadGallery(category = "all") {
  fetchLinks((data = category)).then(data => {
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
