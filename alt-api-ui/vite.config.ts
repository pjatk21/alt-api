import { defineConfig } from 'vite'
import { VitePWA as vitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePWA({
      manifest: {
        name: 'Plan zajęć Altapi',
        short_name: 'Altapi',
        description: 'Lepsza implementacja dla planu zajęć PJATK.',
        theme_color: '#000',
        icons: [
          {
            src: 'img/AltapiIcon_192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'img/AltapiIcon_512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'img/AltapiIcon_512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
