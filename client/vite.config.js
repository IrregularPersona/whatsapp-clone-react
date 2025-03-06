import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // for libsignal to work 
      include: ['buffer', 'crypto']
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/chatHub': {
        target: 'http://localhost:3000',
        ws: true
      }
    }
  }
})
