import { defineConfig, /* loadEnv,  ConfigEnv */ } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default (/* { mode } : ConfigEnv */) => {
  // Load environment variables based on `mode` (development, production, etc.)
  // const env = loadEnv(mode, process.cwd(), 'VITE_')

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: env.VITE_API_BASE_URL_DEV,  // <-- use env here
    //       changeOrigin: true,
    //       rewrite: path => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
  })
}
