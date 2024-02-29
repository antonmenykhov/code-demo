import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'tnnc-ui-kit/dist/style.css'
import { keycloak, redirectToValidUrl } from './services/keycloack/plugin'
import { createPinia } from 'pinia'
import useHttp from './composables/use-http.composable'
import useWhoami from './composables/use-whoami.composable'
import { useRoleStore } from './store'
import { FakeKeycloakClass } from './services/keycloack/fake-plugin'
import type { KeycloakInstance } from 'keycloak-js'

async function initVueApp(keycloak: KeycloakInstance | FakeKeycloakClass, embeded?: boolean) {
  const store = createPinia()
  const app = createApp(App).use(store)
  const { http } = useHttp(keycloak)
  const { whoami } = useWhoami(http)
  const rolesStore = useRoleStore()
  rolesStore.roles = await whoami()
  app.use(router).provide('keycloak', keycloak).provide('embeded', embeded)
  redirectToValidUrl()
  app.mount('#app')
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
