import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import compression from 'vite-plugin-compression';
import path from 'path'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname,'./src'),
    },
  },
  plugins: [
    vue(),
    VueSetupExtend(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    compression({
      verbose: true,
      disable: false,
      threshold: 10240, // 压缩阈值，小于这个值的文件将不会被压缩（单位为字节）这里就是大于 10kb 才去压缩
      algorithm: 'gzip', // 压缩算法
      ext: '.gz', // 压缩文件后缀名
    }),
  ],
  optimizeDeps: {
    include: ['schart.js'],
  },
})
