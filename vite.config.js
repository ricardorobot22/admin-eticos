import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "admin-ecommerce",
  optimizeDeps: {
    include: ['@hello-pangea/dnd'],
    include: ['moment', 'moment-timezone'],
    include: ['@react-spring/web'],
    include: ['sortablejs'],
    include: ['jquery'],
    include: ['react-dropzone'],
    include: ['papaparse'],
  },
})
