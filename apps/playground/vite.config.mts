import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            target: 'https://boot3.jeecg.com/jeecgboot',
            ws: true,
          },
          '/upload-api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/upload-api/, ''),
            target: 'https://api3.boot.jeecg.com',
            ws: true,
          },
        },
      },
    },
  };
});
