import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // 建議加入官方 React 插件
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 確保 base 路徑設定正確，對於 Vercel，通常是根目錄 '/'
  base: '/', 
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 建議將 @ 指向 src
    },
  },
})
