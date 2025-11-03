export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement) {
      el.classList.add('reveal')
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('reveal--in')
            io.disconnect()
            break
          }
        }
      }, { threshold: 0.15 })
      io.observe(el)
    }
  })
})


