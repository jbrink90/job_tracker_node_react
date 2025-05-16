import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log('Proxying to:', env.VITE_PROXY_TARGET, env.VITE_PROXY_PORT);

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      allowedHosts: [
        'reacttracker.jordanbrinkman.space',
        'localhost', 
      ],
      proxy: {
        '/api': {
          target: `http://${env.VITE_PROXY_TARGET || 'localhost'}:${env.VITE_PROXY_PORT || '4444'}`,
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },
  };
});