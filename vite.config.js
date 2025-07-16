import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // '@components': path.resolve(__dirname, 'src/components'),
      // '@assets': path.resolve(__dirname, 'src/assets'),
      // '@utils': path.resolve(__dirname, 'src/utils'),
      // '@hooks': path.resolve(__dirname, 'src/hooks'),
      // '@context': path.resolve(__dirname, 'src/context'),
    },
  },
  server: {
    cors: true,
    proxy: {
      '/api': {
        target: 'https://api.inrest.co',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
})
