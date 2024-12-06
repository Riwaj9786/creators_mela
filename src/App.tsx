import React from "react";
import HomePage from "./Pages/HomePage/HomePage";

import "../src/App.css";
import { Route, Routes } from "react-router-dom";
import { allRoutes } from "./app/features/RouteSetting";
import PageError from "./Pages/ErrorPage/PageError";

const App = () => {
  return (
    <div>
      {/* <HomePage /> */}
      <Routes>
        {allRoutes.map((route) => (
          <Route key={route.id} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<PageError />} />
      </Routes>
    </div>
  );
};

export default App;
