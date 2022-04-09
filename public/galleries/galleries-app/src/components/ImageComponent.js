import React, { useEffect, useRef, useState } from "react";

function ImageComponent({ image, pushToLoaded, dimensions }) {
  const [loaded, setLoaded] = useState(false);
  const [imageWidth, setImageWidth] = useState(null);

  return (
    <div style={{ display: "inline-block" }}>
      <img
        style={{
          transition: "opacity .2s ease",
          display: "block",
          width: imageWidth + "px" || "auto",
          opacity: loaded ? 1 : 0
        }}
        src={image.url}
        onLoad={e => {
          setLoaded(true);
          pushToLoaded({
            name: image.name,
            dimensions: { width: e.target.width, height: e.target.height }
          });
        }}
      />
    </div>
  );
}

export default ImageComponent;
