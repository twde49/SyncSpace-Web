export default defineNuxtConfig({
  devServer: {
    port: 4000,
  },
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/flowbite/dist/flowbite.min.js',
          defer: true,
        },
      ],
    },
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['vue3-toastify/dist/index.css','~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      plugins: ['~/plugins/formatDate'],
    },
  },

  modules: [
    '@nuxt/icon',
    '@vee-validate/nuxt',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    '@nuxt/ui',
  ],
});