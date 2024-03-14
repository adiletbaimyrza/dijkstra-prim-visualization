import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "./build",
  },
  base: "/dijkstra-prim-visualization/",
  resolve: {
    alias: {
      "@algorithms": "/src/algorithms",
      "@components": "/src/components",
      "@contexts": "src/context",
      "@assets": "src/assets",
    },
  },
});
