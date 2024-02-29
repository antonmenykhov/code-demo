import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@tnnc/tnnc-ui-kit/dist/style.css'
import { keycloak, redirectToValidUrl } from './services/keycloack/plugin'
import { createPinia } from 'pinia'

keycloak.init({ onLoad: 'login-required' }).then((auth) => {
  if (!auth) {
    window.location.reload()
  } else {
    const store = createPinia()
    createApp(App).use(store).use(router).provide('keycloak', keycloak).mount('#app')
    redirectToValidUrl()
    setInterval(() => {
      keycloak.updateToken(70)
    }, 60000)
  }
})
