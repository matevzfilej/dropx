import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'DropX',
        short_name: 'DropX',
        description: 'Find and claim nearby drops',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0A0F14',
        theme_color: '#0A0F14',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-maskable.png', sizes: '1024x1024', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ],
  server: { port: 5173 },
  // Če boš deployal na https://<user>.github.io/<repo>/ odkomentiraj:
  // base: '/dropx-web/'
})
