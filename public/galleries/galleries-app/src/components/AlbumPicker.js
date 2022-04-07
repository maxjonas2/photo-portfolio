import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export const AlbumPicker = ({ albums, selected }) => {
  return (
    <div className="container-portfolio-picker">
      {albums.map(item => (
        <Link
          to={"/" + item.value}
          key={item.value}
          className={"normal upper category-picker".concat(
            selected === item.value ? " selected" : ""
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};
