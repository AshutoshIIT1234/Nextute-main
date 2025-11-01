import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { AdminProvider } from "./context/AdminContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminProvider>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AdminProvider>
  </React.StrictMode>
);
