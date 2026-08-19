import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      colorMode: true,
      ui: {
        colors: {
          primary: 'green',
          neutral: 'zinc',
        },
        icons: {
          light: 'i-heroicons-sun',
          dark: 'i-heroicons-moon',
        },
      },
    }),
  ],
})
