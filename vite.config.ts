import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false,
    rollupOptions: {
      // Segunda entrada: la presentación para la directiva vive en /directiva/.
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        directiva: resolve(import.meta.dirname, 'directiva/index.html'),
      },
    },
  },
})
