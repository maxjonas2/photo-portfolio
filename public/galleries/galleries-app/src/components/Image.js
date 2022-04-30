import React, { useState } from "react";
import styled from "styled-components";
import Loader from "../assets/svg/Loader";

const Image = React.forwardRef((props, ref) => {
  const [loaded, setLoaded] = useState(false);

  const { image } = props;

  return (
    <ImageContainer loaded={loaded}>
      {!loaded ? <Loader /> : null}
      <img
        src={image.url}
        onLoad={e => {
          setLoaded(true);
        }}
        ref={ref}
        loading={"lazy"}
      />
    </ImageContainer>
  );
});

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  img {
    transition: opacity 1s ease, transform 1s ease;
    opacity: ${props => (props.loaded ? 1 : 0)};
    transform: ${props => (props.loaded ? "scale(1)" : "scale(0.9)")};
  }

  &:hover {
    transform: scale(1.05);
  }
`;

export default Image;
