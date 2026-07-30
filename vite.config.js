import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('recharts')) {
                            return 'vendor-recharts';
                        }
                        if (id.includes('@tiptap')) {
                            return 'vendor-tiptap';
                        }
                        if (id.includes('react') || id.includes('@inertiajs')) {
                            return 'vendor-core';
                        }
                        return 'vendor';
                    }
                },
            },
        },
    },
});
