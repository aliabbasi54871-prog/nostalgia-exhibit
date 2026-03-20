import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages often serves from a sub-path; "./" keeps asset URLs relative.
  base: './',
  plugins: [react()],
})
