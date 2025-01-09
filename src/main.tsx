import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { register } from "swiper/element/bundle";
import { store } from "./app/store.ts";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
register();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);