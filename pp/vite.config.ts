import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/new-front',
  plugins: [vue()],
  server: {
    port: 8080,
    host: '0.0.0.0'
  },
  build: { rollupOptions: { treeshake: false } },
  esbuild: { treeShaking: false },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
