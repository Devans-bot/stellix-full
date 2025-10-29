import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest: {
      name: 'Stellix',
      short_name: 'Stellix',
      start_url: '/',
      display: 'standalone',
      background_color: '#000000',
      theme_color: '#1e40af',
      icons: [
        {
          src: '/Frontend/public/S-o.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/Frontend/public/S-o.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/Frontend/public/S-o.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    }
  })
],



  server: {
    proxy: {
      "/api": {
        target: "https://stellix-x.onrender.com",
        changeOrigin: true,
        secure: false,
      }
    }
  }
  
})
