import Keycloak from 'keycloak-js'
import router from '@/router'
import { keycloak_url } from '@/config/urls'

const initOptions = {
  url: keycloak_url,
  realm: '',
  clientId: ''
}

const keycloak = new Keycloak(initOptions)

function redirectToValidUrl() {
  const link = window.location.href
  const [url] = link.split('#state=')
  const [origin, path] = url.split(window.location.origin)
  router.push({ path })
}
export { keycloak, redirectToValidUrl }
