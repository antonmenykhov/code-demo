import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@tnnc/tnnc-ui-kit/dist/style.css'
import { keycloak, redirectToValidUrl } from './services/keycloack/plugin'
import { createPinia } from 'pinia'
import { FakeKeycloakClass } from './services/keycloack/fake-plugin'
import type { KeycloakInstance } from 'keycloak-js'

function initVueApp(keycloakInstance: KeycloakInstance | FakeKeycloakClass, embeded?: boolean) {
  const store = createPinia()
  createApp(App)
    .use(store)
    .use(router)
    .provide('keycloak', keycloakInstance)
    .provide('embeded', embeded)
    .directive('title', (el: HTMLElement, binding: { value: string }) => {
      el.title = binding.value
    })
    .mount('#app')
}

function initAppWithKeycloak() {
  keycloak.init({ onLoad: 'login-required' }).then((auth) => {
    if (!auth) {
      window.location.reload()
    } else {
      initVueApp(keycloak)
      redirectToValidUrl()
      setInterval(() => {
        keycloak.updateToken(70)
      }, 60000)
    }
  })
}

function initAppWithFakeKeycloak() {
  const { href } = window.location
  const queryParams = href.split('?')[1].split('&')
  const token = queryParams.find((param) => param.includes('token='))?.split('=')[1]
  if (!token) return initAppWithKeycloak()
  const fakeKeycloak = new FakeKeycloakClass(token)
  initVueApp(fakeKeycloak, true)
}

function init() {
  if (window.location.href.includes('token=')) return initAppWithFakeKeycloak()
  initAppWithKeycloak()
}
init()
