// Performance optimizer for instant loading
class PerformanceOptimizer {
  constructor() {
    this.initialized = false;
    this.criticalResourcesLoaded = false;
  }

  // Initialize performance optimizations
  init() {
    if (this.initialized) return;

    this.setupResourceHints();
    this.optimizeImages();
    this.setupIntersectionObserver();
    this.preloadCriticalResources();

    this.initialized = true;
  }

  // Setup resource hints for better loading
  setupResourceHints() {
    const head = document.head;

    // Preload critical fonts
    const fontPreload = document.createElement("link");
    fontPreload.rel = "preload";
    fontPreload.as = "font";
    fontPreload.type = "font/woff2";
    fontPreload.crossOrigin = "anonymous";
    fontPreload.href =
      "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2";
    head.appendChild(fontPreload);
  }

  // Optimize image loading
  optimizeImages() {
    const images = document.querySelectorAll("img[data-src]");

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.remove("lazy");
              imageObserver.unobserve(img);
            }
          });
        },
        {
          rootMargin: "50px 0px",
        }
      );

      images.forEach((img) => imageObserver.observe(img));
    }
  }

  // Setup intersection observer for lazy loading
  setupIntersectionObserver() {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;

            // Trigger animations
            if (element.classList.contains("animate-on-scroll")) {
              element.classList.add("animate-in");
            }

            // Load deferred content
            if (element.dataset.deferredContent) {
              this.loadDeferredContent(element);
            }

            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "20px",
      }
    );

    // Observe elements that need lazy loading
    document
      .querySelectorAll("[data-lazy], .animate-on-scroll")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  // Preload critical resources
  preloadCriticalResources() {
    const criticalResources = [
      "/assets/css/style.css",
      "/assets/js/react-core.js",
      "/assets/js/index.js",
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";

      if (resource.endsWith(".css")) {
        link.as = "style";
      } else if (resource.endsWith(".js")) {
        link.as = "script";
      }

      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // Load deferred content
  loadDeferredContent(element) {
    const content = element.dataset.deferredContent;
    if (content) {
      element.innerHTML = content;
      element.removeAttribute("data-deferred-content");
    }
  }

  // Optimize for Core Web Vitals
  optimizeCoreWebVitals() {
    // Reduce Cumulative Layout Shift
    this.preventLayoutShift();

    // Improve Largest Contentful Paint
    this.optimizeLCP();

    // Reduce First Input Delay
    this.optimizeFID();
  }

  preventLayoutShift() {
    // Add aspect ratio containers for images
    const images = document.querySelectorAll("img:not([width]):not([height])");
    images.forEach((img) => {
      if (!img.style.aspectRatio) {
        img.style.aspectRatio = "16/9"; // Default aspect ratio
      }
    });
  }

  optimizeLCP() {
    // Preload LCP image
    const heroImage = document.querySelector(".hero img, .banner img");
    if (heroImage && heroImage.src) {
      const preload = document.createElement("link");
      preload.rel = "preload";
      preload.as = "image";
      preload.href = heroImage.src;
      document.head.appendChild(preload);
    }
  }

  optimizeFID() {
    // Break up long tasks
    if ("scheduler" in window && "postTask" in scheduler) {
      // Use scheduler API for better task scheduling
      scheduler.postTask(
        () => {
          this.initializeNonCriticalFeatures();
        },
        { priority: "background" }
      );
    } else {
      // Fallback to setTimeout
      setTimeout(() => {
        this.initializeNonCriticalFeatures();
      }, 0);
    }
  }

  initializeNonCriticalFeatures() {
    // Initialize analytics, chat widgets, etc.
    console.log("Non-critical features initialized");
  }
}

// Create and export singleton instance
const performanceOptimizer = new PerformanceOptimizer();

// Auto-initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    performanceOptimizer.init();
    performanceOptimizer.optimizeCoreWebVitals();
  });
} else {
  performanceOptimizer.init();
  performanceOptimizer.optimizeCoreWebVitals();
}

export default performanceOptimizer;
