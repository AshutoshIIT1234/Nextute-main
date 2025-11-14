import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],
  build: {
    minify: "terser",
    cssCodeSplit: false, // Inline critical CSS
    sourcemap: false,
    target: "es2020",
    chunkSizeWarningLimit: 1000,
    // Force new hashes on every build for cache busting
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-core": ["react", "react-dom", "react-router-dom"],
          "ui-heavy": ["framer-motion", "chart.js", "react-chartjs-2"],
          "maps": ["leaflet", "react-leaflet"],
          "utils": ["axios", "js-cookie", "qrcode", "libphonenumber-js", "lucide-react", "react-icons"]
        },
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0] || assetInfo.name || '';
          const info = fileName.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug", "console.warn"],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    }
  },
  server: {
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom"
    ],
    exclude: [
      "framer-motion",
      "chart.js",
      "leaflet"
    ]
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none'
  }
});
