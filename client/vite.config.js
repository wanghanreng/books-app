import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";

export default defineConfig({
  plugins:[react(), UnoCSS()],
  server: {
    port: 4001
  },
  resolve:{
    alias:{
      '@': '/src',
      '@pages': '/src/pages',
    },
  },
});