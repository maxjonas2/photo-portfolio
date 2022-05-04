import React, { useEffect, useRef, useState } from "react";
import std from "styled-components";
import Loader from "../assets/svg/Loader";
import close from "../assets/svg/close.svg";
import arrow from "../assets/svg/arrow.svg";

export const Lightbox = ({
  currentImage,
  setLightboxOpen,
  navigateTo,
  imageLoading,
  setImageLoading
}) => {
  const fillRef = useRef();

  useEffect(() => {
    const exitLightboxOnClick = e => {
      if (e.target === fillRef.current) {
        setLightboxOpen(false);
      }
    };

    const handleKeyPress = e => {
      switch (e.key) {
        case "Escape":
          setLightboxOpen(false);
          break;
        case "ArrowRight":
          // setImageLoading(true);
          // changeImage("next");
          navigateTo.next();
          break;
        case "ArrowLeft":
          // setImageLoading(true);
          // changeImage("previous");
          navigateTo.previous();
          break;
        default:
          return;
      }
    };

    document.body.addEventListener("keyup", handleKeyPress);
    document.body.addEventListener("click", exitLightboxOnClick);

    return () => {
      document.body.removeEventListener("keyup", handleKeyPress);
      document.body.removeEventListener("click", exitLightboxOnClick);
    };
  }, [currentImage]);

  return (
    <Fill className="centered-items fill" ref={fillRef}>
      <LightboxContainer className="centered-items">
        <picture>
          <LightboxImage
            src={currentImage.url.replace("small", "large")}
            alt="Image"
            onLoad={() => setImageLoading(false)}
          />
        </picture>

        <div className="lightbox-controls horizontal-items">
          <button
            onClick={() => {
              // setImageLoading(true);
              // changeImage("previous");
              navigateTo.previous();
            }}
            className="btn lightbox-btn"
          >
            <img src={arrow} className="invert-horizontal" />
          </button>
          <button
            onClick={() => {
              // setImageLoading(true);
              // changeImage("next");
              navigateTo.next();
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
