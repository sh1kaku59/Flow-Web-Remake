import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
 throw new Error("Root element with id 'root' not found.");
}

import { LanguageProvider } from "./shared/i18n/LanguageContext";

createRoot(container).render(
 <React.StrictMode>
  <LanguageProvider>
   <App />
  </LanguageProvider>
 </React.StrictMode>
);
