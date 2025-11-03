export default defineNuxtPlugin((nuxtApp) => {
  // Register a no-op directive on server to satisfy SSR renderer
  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() {
      return {}
    }
  })
})


