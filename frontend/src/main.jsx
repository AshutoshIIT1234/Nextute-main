import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";
import "./utils/performanceOptimizer.js";

// Register service worker for caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Instant skeleton removal and React hydration
const removeInitialSkeleton = () => {
  const skeleton = document.getElementById('initial-skeleton');
  if (skeleton) {
    skeleton.style.opacity = '0';
    setTimeout(() => skeleton.remove(), 150);
  }
};

// Start React immediately
const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);

// Remove skeleton after React takes over
requestAnimationFrame(() => {
  setTimeout(removeInitialSkeleton, 50);
});
