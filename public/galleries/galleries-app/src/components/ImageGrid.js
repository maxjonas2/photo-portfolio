import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Image from "./Image";
import styled from "styled-components";
import { Lightbox } from "./Lightbox";

export const ImageGrid = ({ images, openImage, imageViaUrl }) => {
  // console.log("image via url? ", imageViaUrl);
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

  const [lastReached, setLastReached] = useState(false);

  console.log("open image? ", openImage);

  function changeImage(direction) {
    if (direction === "next") {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (direction === "previous") {
      if (currentImageIndex === 0) {
        setCurrentImageIndex(0);
        setLightboxOpen(false);
      } else {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    }
  }

  const lastImageRef = useRef();

  const navigate = useNavigate();
  const params = useParams();

  const [currentImageIndex, setCurrentImageIndex] = useState(
    params?.photo ? parseInt(params.photo) : 0
  );
  const [lightboxOpen, setLightboxOpen] = useState(openImage ? true : false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (lightboxOpen === false) {
      navigate(`/${params.album}`, { replace: true });
    }
  }, [lightboxOpen]);

  useEffect(() => {
    setLastReached(images.length - currentImageIndex <= 1);
  }, [currentImageIndex]);

  const navigateTo = {
    next: () => {
      setImageLoading(true);
      setCurrentImageIndex(currentImageIndex + 1);
      navigate((currentImageIndex + 1).toString(), {
        replace: true
      });
    },
    previous: () => {
      if (currentImageIndex === 0) {
        setCurrentImageIndex(0);
        setLightboxOpen(false);
      } else {
        setImageLoading(true);
        setCurrentImageIndex(currentImageIndex - 1);
        navigate((currentImageIndex - 1).toString(), {
          replace: true
        });
      }
    }
  };
  return (
    <>
      {lightboxOpen ? (
        <Lightbox
          currentImage={images[currentImageIndex]}
          changeImage={changeImage}
          setLightboxOpen={setLightboxOpen}
          navigateTo={navigateTo}
          imageLoading={imageLoading}
          setImageLoading={setImageLoading}
          lastReached={lastReached}
        />
      ) : null}
      <ImageGridComponent>
        {images.map((image, index) => {
          return (
            <Image
              key={image.name}
              image={image}
              ref={index === images.length - 1 ? lastImageRef : null}
              onClick={() => {
                setCurrentImageIndex(index);
                setLightboxOpen(true);
                navigate(index.toString(), {
                  replace: true
                });
              }}
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

  @media (max-width: 550px) {
    grid-auto-rows: initial;
  }

  img {
    max-height: 100%;
    width: auto;
    object-fit: cover;
    object-position: center top;
  }
`;

// const CarouselPhoto = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   font-weight: bold;
//   font-size: 2rem;
//   position: absolute;
//   inset: 0;
// `;
