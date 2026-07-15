import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // sockjs-client (dùng bởi realtimeService.js để kết nối WebSocket) được viết
  // cho môi trường Node.js và tham chiếu tới biến toàn cục `global`, vốn
  // không tồn tại trong trình duyệt -> gây lỗi "global is not defined".
  // Khai báo ở đây để Vite thay mọi chỗ dùng `global` trong code build ra
  // thành `globalThis` (biến chuẩn có sẵn trên trình duyệt).
  define: {
    global: 'globalThis',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})