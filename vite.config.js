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
    proxy: {
      '^/users/.*': {
        target: 'http://92.205.61.102',
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    }
  }
})
