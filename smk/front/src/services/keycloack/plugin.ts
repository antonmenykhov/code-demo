import Keycloak from 'keycloak-js'
import type { LocationQueryRaw } from 'vue-router'
import router from '@/router'

const initOptions = {
  url: '',
  realm: 'Authentication',
  clientId: 'smk'
}

const keycloak = new Keycloak(initOptions)
const redirectToValidUrl = () => {
  // keycloack, после авторизации возвращает на страницу, но добавляет к адресу параметры.
  // код ниже перекидывает на страницу без параметров
  const indexOfSharp = window.location.href.indexOf('#/')
  const indexQuery = window.location.href.indexOf('?')
  const indexOfState = window.location.href.indexOf('&state')
  const length = window.location.href.length
  const queryObj: LocationQueryRaw = {}
  if (indexQuery !== -1)
    window.location.href
      .slice(indexQuery + 1, indexOfState === -1 ? length : indexOfState)
      .split('&')
      .map((q) => q.split('='))
      .forEach((queryArr: string[]) => {
        const [first, second] = queryArr
        queryObj[first] = second
      })
  router.push({
    path: window.location.href.slice(indexOfSharp + 1, indexOfState === -1 ? length : indexOfState),
    query: queryObj
  })
}
export { keycloak, redirectToValidUrl }
