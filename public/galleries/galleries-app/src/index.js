import ReactDom from "react-dom/client";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Homepage from "./pages/Homepage";
import "./css/main.css";
import LightboxCarousel from "./components/LightboxCarousel";

const App = () => {
  return (
    <Router basename="/public/galleries/galleries-app/build">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/:album" element={<Homepage />} />
        <Route path="/carousel" element={<LightboxCarousel />} />
      </Routes>
    </Router>
  );
};

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(<App />);
