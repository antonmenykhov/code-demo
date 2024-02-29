import { pubsub_url } from '@/config/urls'
import type { KeycloakInstance } from 'keycloak-js'
import { inject } from 'vue'

export default function useEventSource(channel = 'global') {
  const keycloak = inject('keycloak') as KeycloakInstance
  const source = new EventSource(
    `${pubsub_url}/channel/${channel}?token=Bearer ` +
      (keycloak.token || '').replace('.', 'qwer123')
  )
  return { source }
}
