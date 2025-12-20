import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@countries': path.resolve(__dirname, './src/features/countries'),
      '@components': path.resolve(__dirname, './src/components'),
      '@core': path.resolve(__dirname, './src/core')
    }
  }
})