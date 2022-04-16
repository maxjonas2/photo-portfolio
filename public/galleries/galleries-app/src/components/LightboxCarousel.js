import React from "react";
import styled from "styled-components";

var carouselItems = [1, 2, 3, 4, 5].map(item => <div>{item}</div>);

export default ({ carouselItems }) => {
  const itemsLength = carouselItems.length;

  const angle = 360 / itemsLength;

  return (
    <Scene>
      <Carousel>
        {carouselItems.map((item, index) => (
          <CarouselCell rotation={angle * index}>{item}</CarouselCell>
        ))}
      </Carousel>
    </Scene>
  );
};

const Scene = styled.div`
  width: 300px;
  height: 200px;
  perspective: 1000px;
  position: relative;
`;

const Carousel = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
`;

const CarouselCell = styled.div`
  position: relative;
  width: 280px;
  height: 180px;
  top: 10px;
  left: 10px;
  background-color: hsl(${Math.floor(Math.random() * 255)}, 50%, 50%);
  transform: rotateY(${props => props.rotateY + "deg"});
`;
