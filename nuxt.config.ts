// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@/assets/css/main.css', 'leaflet/dist/leaflet.css'],
  app: {
    head: {
      title: 'Наш День Любви',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Сайт-поздравление в честь нашей годовщины ❤️' }
      ]
    }
  },
  compatibilityDate: '2024-11-01'
})


