import React, { useRef, useState } from "react";
import Image from "./Image";
import styled from "styled-components";
import { Lightbox } from "./Lightbox";

export const ImageGrid = props => {
  // const [loadedImages, setLoadedImages] = useState([]);

  // const countRef = useRef(3);

  // const observerCallback = entries => {
  //   if (entries[entries.length - 1].isIntersecting === true) {
  //     countRef.current += 3;
  //     setLoadedImages(images.slice(0, countRef.current));
  //   }
  // };

  // const endReachedObserver = useRef(new IntersectionObserver(observerCallback));

  // useEffect(() => {
  //   setLoadedImages(images.slice(0, countRef.current));
  // }, [images]);

  // useEffect(() => {
  //   console.log("loaded images", loadedImages[0]);
  // }, [loadedImages]);

  // useEffect(() => {
  //   if (!lastImageRef.current || !endReachedObserver.current) return;
  //   endReachedObserver.current.observe(lastImageRef.current);
  // });

  function changeImage(direction) {
    if (direction === "next") {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(currentImageIndex === 0 ? 0 : currentImageIndex - 1);
    }
  }

  const { images } = props;
  const lastImageRef = useRef();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      {lightboxOpen ? (
        <Lightbox
          currentImage={images[currentImageIndex]}
          changeImage={changeImage}
          setLightboxOpen={setLightboxOpen}
        />
      ) : null}
      <ImageGridComponent>
        {images.map((image, index) => {
          return (
            <Image
              key={image.name}
              image={image}
              ref={index === images.length - 1 ? lastImageRef : null}
              onClick={() => setLightboxOpen(true)}
            />
          );
        })}
      </ImageGridComponent>
    </>
  );
};

const ImageGridComponent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-auto-rows: 300px;
  justify-content: center;
  gap: 33.33px;

  img {
    max-height: 100%;
    width: auto;
    object-fit: cover;
    object-position: center top;
  }
`;

const CarouselPhoto = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 2rem;
  position: absolute;
  inset: 0;
`;
