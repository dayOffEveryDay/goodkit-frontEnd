import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 這裡一定要寫成 /你的 repo 名稱/
  base: '/goodkit-frontEnd/',
  build: {
    // 叫 Vite 把 build 結果輸出到 docs 資料夾
    outDir: 'docs',
  },
})
