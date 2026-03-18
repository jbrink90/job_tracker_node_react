import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default () => {
  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
      sourcemap: true,
    },
  });
};
