import React from "react";

export default function Loader() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={styles.loaderStyle}
        width="60px"
        height="60px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <path
          d="M10 50A40 40 0 0 0 90 50A40 42.9 0 0 1 10 50"
          fill="white"
          stroke="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="0.75s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 51.45;360 50 51.45"
          ></animateTransform>
        </path>
      </svg>
    </>
  );
}

const styles = {
  loaderStyle: {
    margin: "auto",
    background: "rgba(0, 0, 0, 0) none repeat scroll 0% 0%",
    display: "block",
    shapeRendering: "auto",
    position: "absolute"
  }
};
