import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'
import { copyFileSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['liberty128.png', 'liberty48.png'],
            manifest: {
                name: 'Liberty',
                short_name: 'Liberty',
                description: 'Liberty cryptographic core for secure messaging',
                theme_color: '#0f172a',
                background_color: '#0f172a',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: '/liberty128.png',
                        sizes: '128x128',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: '/liberty128.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            },
            devOptions: {
                enabled: true,
            },
        }),
        react(),
        tailwindcss(),
        {
            name: 'copy-manifest',
            closeBundle() {
                copyFileSync(
                    path.resolve(__dirname, 'public/manifest.json'),
                    path.resolve(__dirname, 'dist/manifest.json')
                )
            },
        },
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
        },
    },
})
