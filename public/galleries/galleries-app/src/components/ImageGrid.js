import React, { useEffect, useState } from "react";
import Image from "./ImageComponent";

export const ImageGrid = ({ images }) => {
  const [loadedImages, setLoadedImages] = useState([]);

  function pushToLoaded(image) {
    const index = loadedImages.findIndex(img => img.name === image.name);
    if (index === -1) {
      setLoadedImages([...loadedImages, image]);
    }
  }

  useEffect(() => {}, [loadedImages]);

  return (
    <div style={{ width: "100%" }}>
      {images.map(image => {
        return (
          <Image key={image.name} image={image} pushToLoaded={pushToLoaded} />
        );
      })}
    </div>
  );
};
