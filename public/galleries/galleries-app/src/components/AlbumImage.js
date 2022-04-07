import React, { useEffect, useState } from "react";
import Loader from "../assets/svg/Loader";

function AlbumImage({ url }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageShown, setImageShown] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setImageShown(true);
    }, 0);
  }, []);

  return (
    <div className="gallery-item">
      {imageLoaded === false ? <Loader /> : null}
      <img
        style={{ display: imageShown ? "block" : "none" }}
        onLoad={() => setImageLoaded(true)}
        className="fade-on-view shown"
        src={url}
        loading="lazy"
      />
    </div>
  );
}

export default AlbumImage;
