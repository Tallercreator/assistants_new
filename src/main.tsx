import * as React from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";
import { App } from "./app";

const rootElement = document.querySelector("#root");
if (!(rootElement instanceof HTMLElement)) {
  throw new Error("Не найден #root");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
