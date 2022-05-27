import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import Loader from "../assets/svg/Loader";
import close from "../assets/svg/close.svg";
import arrow from "../assets/svg/arrow.svg";

export const Lightbox = ({
  currentImage,
  setLightboxOpen,
  navigateTo,
  imageLoading,
  setImageLoading,
  lastReached
}) => {
  const fillRef = useRef();
  const captionRef = useRef();

  // function fadeCaption() {
  //   if (captionRef.current) {
  //     captionRef.current.animate([{ opacity: 1 }, { opacity: 0.5 }], {
  //       duration: 250,
  //       delay: 2000,
  //       fill: "forwards"
  //     });
  //   }
  // }

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
          if (lastReached) {
            console.log("last reached");
            return;
          } else {
            navigateTo.next();
          }
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
        <ImageView>
          <picture>
            <LightboxImage
              src={currentImage.url.replace("small", "large")}
              alt="Image"
              onLoad={() => {
                setImageLoading(false);
                // fadeCaption();
              }}
            />
          </picture>
          {imageLoading ? null : (
            <p className="image-caption serif" ref={captionRef}>
              Portfolio image
            </p>
          )}
        </ImageView>

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
            style={{ visibility: lastReached ? "hidden" : "visible" }}
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

const Fill = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: ${props =>
    props.darkness ? `rgba(0,0,0,${props.darkness})` : "rgba(0,0,0,.85)"};
  margin: 0px !important;
`;

const LightboxContainer = styled.div``;

const LightboxImage = styled.img`
  max-height: 90vh;
`;

const ImageView = styled.div`
  position: relative;
  height: fit-content;
  overflow: hidden;

  .image-caption {
    visibility: hidden;
    position: absolute;
    inset: auto 0 0 0;
    padding: 0.2rem;
    background-color: rgba(0, 0, 0, 0.5);
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    font-weight: 300;
    text-transform: uppercase;
    font-size: 0.9rem;
  }
`;
