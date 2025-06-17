import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:18080',  // Spring Boot가 실행되는 포트
        changeOrigin: true
      }
    }
  }
})
