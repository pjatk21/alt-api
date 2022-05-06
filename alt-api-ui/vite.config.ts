import { defineConfig } from 'vite'
import { VitePWA as vitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-query', 'react-router-dom', 'usehooks-ts'],
          essentials: ['lodash', 'ky', 'luxon', 'class-transformer', 'reflect-metadata'],
          nextui: ['@nextui-org/react'],
          fontawesome: [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-brands-svg-icons',
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/react-fontawesome',
          ],
          sentry: ['@sentry/react', '@sentry/tracing'],
        },
      },
    },
  },
  plugins: [
    react(),
    vitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Plan zajęć Altapi',
        short_name: 'Altapi',
        description: 'Lepsza implementacja dla planu zajęć PJATK.',
        scope: './app/',
        display: 'standalone',
        start_url: './app/',
        theme_color: '#000000',
        background_color: '#000000',
        categories: ['education', 'productivity'],
        icons: [
          {
            src: 'img/AltapiIcon_192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'img/AltapiIcon_192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'img/AltapiIcon_512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      scope: './app/',
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
      },
    }),
  ],
})
