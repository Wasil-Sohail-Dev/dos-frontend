import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { LoginPage } from "./pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router";
import store from "../src/store/index";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
    <Toaster />
      <App />
    </BrowserRouter>
  </Provider>
);
