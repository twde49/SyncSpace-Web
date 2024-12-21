export default defineNuxtConfig({
  app:{
    head: {
        script: [
          { src: 'https://cdn.jsdelivr.net/npm/flowbite/dist/flowbite.min.js', defer: true }
        ]
      }
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['@nuxt/icon'],
})