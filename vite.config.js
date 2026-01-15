import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 使用默认的 public 目录，现在 static 文件夹在 public 内部
  // 这样打包后 dist 目录下会保留 static 文件夹，路径与开发环境一致
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 允许图片等大文件直接被打包
    assetsInlineLimit: 0 
  },
  server: {
    proxy: {
      // 本地开发时保留 proxy 兼容，虽然现在已经是静态了
      '/static': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
