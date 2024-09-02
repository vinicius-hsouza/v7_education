import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    manifest: {
      name: "React-vite-app",
      short_name: "V7",
      description: "I am a simple vite app",
      theme_color: '#171717',
      background_color: '#f0e7db',
      display: "standalone",
      scope: '/',
      start_url: "/",
      orientation: 'portrait'
    }
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
