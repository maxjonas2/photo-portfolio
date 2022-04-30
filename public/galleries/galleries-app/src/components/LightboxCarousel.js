import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

export default ({ carouselItems }) => {
  const angle = 360 / 4;

  const [currentImage, setCurrentImage] = useState(0);
  const [currentSide, setCurrentSide] = useState(0);

  function previousImage() {
    if (currentSide === 0) return;
    setCurrentSide(currentSide - 1);
    setCurrentImage(currentImage - 1);
  }

  function nextImage() {
    setCurrentSide(currentSide + 1);
    setCurrentImage(currentImage + 1);
  }

  const CarouselCell = ({ imageUrl, isVisibleCell, cubeSide, ...rest }) => {
    return (
      <Cell {...rest}>
        {isVisibleCell === true ? (
          <picture>
            <img src={imageUrl} alt="" width={300} height={200} />
          </picture>
        ) : (
          <p>{cubeSide}</p>
        )}
      </Cell>
    );
  };

  return (
    <SceneContainer>
      <Scene>
        <Carousel currentSide={currentSide}>
          {[1, 2, 3, 4].map((item, index) => {
            return (
              <CarouselCell
                key={item}
                rotation={angle * index}
                isVisibleCell={(currentSide + 1) % item === 0}
                imageUrl={carouselItems[currentImage].url}
                cubeSide={item}
              />
            );
          })}
        </Carousel>
      </Scene>
      <LightboxControls className="horizontal-items">
        <button onClick={previousImage} className="btn slightbox-btn">
          Back
        </button>
        <button onClick={nextImage} className="btn slightbox-btn">
          Next
        </button>
      </LightboxControls>
    </SceneContainer>
  );
};

const LightboxControls = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  padding: 4rem;
`;

const SceneContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgb(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 !important;
`;

const Scene = styled.div`
  --scene: 1px;
  width: 300px;
  height: 200px;
  perspective: 1000px;
  position: relative;
`;

const Carousel = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateY(${props => props.currentSide * 90 * -1}deg);
  transition: transform 0.8s ease;
`;

const Cell = styled.div`
  position: absolute;
  width: 280px;
  height: 180px;
  top: 10px;
  left: 10px;
  background-color: hsl(${Math.floor(Math.random() * 255)}, 50%, 50%);
  transform: rotateY(${props => props.rotation + "deg"})
    translateZ(
      ${props => {
        const distance = Math.floor(140 / Math.tan(Math.PI / 4));
        return distance + "px";
      }}
    );
`;
