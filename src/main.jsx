import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Clipboard from './windows/Clipboard';
import "./style.css";

let root = <></>;

switch (window.location.pathname) {
  case '/clipboard':
    root = <Clipboard />;
    break;
  default:
    root = <App />;
    break;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {root}
  </React.StrictMode>
);
