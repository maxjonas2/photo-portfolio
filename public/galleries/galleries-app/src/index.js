import ReactDom from "react-dom/client";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  HashRouter
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import "./css/main.css";

// basename="/public/galleries/galleries-app/build"

const App = () => {
  return (
    <Router basename="/public/galleries">
      <Routes>
        <Route path=":album" element={<Homepage />}>
          <Route path=":photo" element={<Homepage lightboxOpen />} />
        </Route>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
};

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(<App />);
