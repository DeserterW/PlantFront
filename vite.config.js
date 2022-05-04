import vue from '@vitejs/plugin-vue'

export default {
    base: './',
    plugins: [vue()],
    optimizeDeps: {
        include: ['schart.js']
    },
    proxy: {
      '^/api': {
        // target: 'http://152.136.185.210:5000',
        target: 'http://127.0.0.1:8080',
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true
      }
    }
}