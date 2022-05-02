import React, { useState } from "react";
import std from "styled-components";
import Loader from "../assets/svg/Loader";
import close from "../assets/svg/close.svg";
import arrow from "../assets/svg/arrow.svg";

export const Lightbox = ({ currentImage, changeImage, setLightboxOpen }) => {
  const [imageLoading, setImageLoading] = useState(false);

  return (
    <Fill className="centered-items">
      <LightboxContainer className="centered-items">
        <picture>
          <LightboxImage
            src={currentImage.url.replace("small", "large")}
            alt="Image"
            onLoad={() => setImageLoading(false)}
            loading={imageLoading}
          />
        </picture>

        <div className="lightbox-controls horizontal-items">
          <button
            onClick={() => {
              setImageLoading(true);
              changeImage("previous");
            }}
            className="btn lightbox-btn"
          >
            <img src={arrow} className="invert-horizontal" />
          </button>
          <button
            onClick={() => {
              setImageLoading(true);
              changeImage("next");
            }}
            className="btn lightbox-btn"
          >
            <img src={arrow} />
          </button>
        </div>
      </LightboxContainer>
      {imageLoading ? (
        <Fill className="centered-items" darkness={0.4}>
          <Loader />
        </Fill>
      ) : null}
      <button
        className="btn btn-lightbox-close"
        onClick={() => setLightboxOpen(false)}
      >
        <img src={close} alt="Close" />
      </button>
    </Fill>
  );
};

const Fill = std.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: ${props =>
    props.darkness ? `rgba(0,0,0,${props.darkness})` : "rgba(0,0,0,.85)"};
  margin: 0px !important;
`;

const LightboxContainer = std.div``;

const LightboxImage = std.img`
  max-height: 90vh;
`;
