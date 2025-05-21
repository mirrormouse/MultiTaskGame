import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: '/MultiTaskGame/',   // リポジトリ名と合わせる
  plugins: [react()],
})
