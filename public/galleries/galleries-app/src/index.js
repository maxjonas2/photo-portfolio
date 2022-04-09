import ReactDom from "react-dom/client";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Homepage from "./pages/Homepage";
import "./css/main.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/:album" element={<Homepage />} />
      </Routes>
    </Router>
  );
};

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(<App />);
