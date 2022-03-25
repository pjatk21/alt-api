import { defineConfig } from 'vite'
import { VitePWA as vitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Plan zajęć Altapi',
        short_name: 'Altapi',
        description: 'Lepsza implementacja dla planu zajęć PJATK.',
        scope: './app/',
        start_url: './app/',
        theme_color: '#000',
        categories: ['education', 'productivity'],
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
