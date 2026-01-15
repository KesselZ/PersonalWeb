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
  // 核心修复：确保 static 目录下的所有资源都被拷贝到部署产物中
  publicDir: 'static', 
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
