import ReactDom from "react-dom/client";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Homepage from "./pages/Homepage";
import "./css/main.css";

// basename="/public/galleries/galleries-app/build"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/:album" element={<Homepage />} />
        {/* <Route path="/carousel" element={<LightboxCarousel />} /> */}
      </Routes>
    </Router>
  );
};

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(<App />);
