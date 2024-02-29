import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'tnnc-ui-kit/dist/style.css'
import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'
import { keycloak, redirectToValidUrl } from './services/keycloack/plugin'

keycloak.init({ onLoad: 'login-required' }).then((auth) => {
  if (!auth) {
    window.location.reload()
  } else {
    const store = createPinia()
    createApp(App)
      .use(store)
      .use(router)
      .provide('keycloak', keycloak)
      .directive('title', (el: HTMLElement, binding: { value: string }) => {
        el.title = binding.value
      })
      .mount('#app')
    redirectToValidUrl()
    setInterval(() => {
      keycloak.updateToken(70)
    }, 60000)
  }
})
