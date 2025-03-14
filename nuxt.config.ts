export default defineNuxtConfig({
  devServer: {
    port: 4000,
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'https://localhost:8000/api/',
      webSocketUrl: process.env.WEBSOCKET_URL || 'http://localhost:6969',
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

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['vue3-toastify/dist/index.css', '~/assets/css/main.css'],

  nuxtError: {
    apiToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJMQ201RW9VZTBxVm5iYzRNMm45ck0iLCJzaXRlSWQiOiJJU1VoQ2xnQUc2ZXQzNFYxNVRCSGwifQ.sA2ZUZ0HkVpJ9mubwfKxLTo2sowR0C74lP31AD8CPeI',
  },

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
    'nuxt-error',
  ],
});
