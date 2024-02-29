import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/main.css'

import App from './App.vue'
import router from './router'
import { keycloak, redirectToValidUrl } from './services/keycloak'

keycloak.init({ onLoad: 'login-required' }).then((auth) => {
  if (!auth) {
    window.location.reload()
  } else {
    const app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.provide('keycloak', keycloak)
    app.mount('#app')
    redirectToValidUrl()
    setInterval(() => keycloak.updateToken(70), 60000)
  }
})
