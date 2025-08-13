export default defineNuxtConfig({
  devServer: {
    port: 4000,
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'https://localhost:8000/api/',
      webSocketUrl: process.env.WEBSOCKET_URL || 'http://localhost:6969',
      baseUrlWithoutApi: process.env.API_URL_WITHOUT_API || 'https://localhost:8000/',
      giphyApiKey: process.env.GIPHY_API_KEY 
    },
  },

  app: {
    head: {
      title: 'SyncSpace',
      meta: [
        {
          name: 'description',
          content: 'SyncSpace est votre espace de travail concentré',
        },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/flowbite/dist/flowbite.min.js',
          defer: true,
        },
      ],
    },
  },

  compatibilityDate: '2025-08-01',
  devtools: { enabled: true },
  css: ['vue3-toastify/dist/index.css', '~/assets/css/main.css'],


  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      plugins: ['~/plugins/formatDate', '~/plugins/swiper.client'],
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
