import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const loadConfig = async () => {
  const response = await fetch("/config.json");
  const config = await response.json();
  window.env = config;
};

loadConfig().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
