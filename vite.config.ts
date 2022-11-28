import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/sha-256-hmac-form/',
    plugins: [svgr(), react()],
});
