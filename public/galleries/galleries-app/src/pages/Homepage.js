import React, { useEffect, useState } from "react";
import Loader from "../assets/svg/Loader.js";
import AlbumImage from "../components/AlbumImage.js";
import { AlbumPicker } from "../components/AlbumPicker.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ImageGrid } from "../components/ImageGrid.js";

const Homepage = ({ imageViaUrl }) => {
  const origin = "https://jkieling.netlify.app";

  const params = useParams();
  const navigate = useNavigate();

  function fetchLinks(category) {
    return window.fetch(
      `${origin}/.netlify/functions/getImages?bucket=${category}`,
      {
        method: "GET"
      }
    );
  }

  const [currentAlbum, setCurrentAlbum] = useState(null);

  const [images, setImages] = useState([]);

  React.useEffect(() => {
    // console.log(params);
    if (!params.album) {
      navigate("color", { replace: true });
      return;
    }
    fetchLinks(params.album ? params.album : "color")
      .then(response => response.json())
      .then(data => {
        setImages(data);
      });
  }, [params?.album]);

  const albums = [
    { value: "color", label: "Color" },
    { value: "bw", label: "Black & White" },
    { value: "portrait", label: "Portraits" }
  ];

  return (
    <>
      <section>
        <div className="content flow gallery-mosaic-container">
          <AlbumPicker
            albums={albums}
            setCurrentAlbum={setCurrentAlbum}
            selected={params.album}
          />

          {images.length !== 0 && (
            <ImageGrid
              images={images}
              openImage={params?.photo}
              imageViaUrl={imageViaUrl}
            />
          )}

          {/* <div className="gallery-mosaic" id="gallery-mosaic">
            {images.length > 0
              ? images.map(image => {
                  return <AlbumImage key={image.name} url={image.url} />;
                })
              : null}
          </div> */}
        </div>
      </section>
      {/* <section>
        <div className="content">
          <a href="http://jkieling.com" className="btn btn-link">
            Back
          </a>
        </div>
      </section> */}
    </>
  );
};

export default Homepage;
