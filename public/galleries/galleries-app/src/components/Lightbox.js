import React from "react";
import path from "path";

export const Lightbox = () => {
  return (
    <div className="lightbox-overlay">
      <button
        className="btn btn-lightbox-close centered-items"
        id="btn-lightbox-close"
      >
        <img src={require("../assets/svg/close.svg")} alt="" />
      </button>
      <div className="lightbox-container">
        <div className="lightbox-image-container"></div>
        <div className="lightbox-controls horizontal-items">
          <button className="btn lightbox-btn" id="lightbox-btn-back">
            <img
              className="image-svg"
              src={require("../assets/svg/arrows.svg")}
              alt=""
            />
          </button>
          <button className="btn lightbox-btn" id="lightbox-btn-next">
            <img
              className="image-svg"
              src={require("../assets/svg/arrows.svg")}
              alt=""
            />
          </button>
        </div>
      </div>
    </div>
  );
};
