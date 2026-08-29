import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

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
    resolve: {
        alias: {
            // Map absolute /fonts/ CSS URLs to public/fonts/ so Vite resolves them
            // at build time instead of emitting "didn't resolve" warnings.
            '/fonts': path.resolve(process.cwd(), 'public/fonts'),
        },
    },
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
                        if (id.includes('react-dom')) {
                            return 'vendor-react-dom';
                        }
                        if (id.includes('react')) {
                            return 'vendor-react';
                        }
                        if (id.includes('@inertiajs')) {
                            return 'vendor-inertia';
                        }
                        if (id.includes('axios')) {
                            return 'vendor-axios';
                        }
                        if (id.includes('@tailwindcss')) {
                            return 'vendor-tailwindcss';
                        }
                    }
                },
            },
        },
    },
});
