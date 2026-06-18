import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { getAvailableShops, getDownloadShops } from "./services/auth";

const mount = (el, params) => {
  if (!el._root) {
    el._root = ReactDOM.createRoot(el);
  }
  const initialState = {
    admin: params?.admin || true,
    downloadShops: params?.downloadShops || getDownloadShops() || [],
    availableShops: params?.availableShops || getAvailableShops() || [],
    fetchWorkflowCount: params?.fetchWorkflowCount
      ? params?.fetchWorkflowCount
      : () => {},
  };
  console.log(initialState);

  const root = el._root;
  root.render(<App initialState={initialState} />);
};

if (module.hot) {
  module.hot.accept("./App.css", () => {
    console.log("Hot Module Replacement for CSS files triggered");
  });

  module.hot.dispose(() => {
    console.warn("Disposing the old module due to HMR update");
  });
}

// if (process.env.NODE_ENV === "development") {
const devRoot = document.getElementById("prodigi-root");

if (devRoot) {
  mount(devRoot);
}
// }

export { mount };
