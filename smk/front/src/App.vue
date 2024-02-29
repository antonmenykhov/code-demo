<template>
  <DefaultLayout :class="{ embeded }">
    <template #side>
      <TnncLogo />
      <NavigationComponent :navigation-items="filteredNavItems" />
      <div
        v-if="rolesStore.isRespondent || rolesStore.isAdministrator"
        class="tnnc-navigation-link file-link"
      >
        <i class="fa-solid fa-file-pdf"></i>
        <a href="./Инструкция респондента.pdf" target="_blank"> Инструкция респондента</a>
      </div>
      <div
        v-if="rolesStore.isResponsible || rolesStore.isAdministrator"
        class="tnnc-navigation-link file-link"
      >
        <i class="fa-solid fa-file-pdf"></i>
        <a href="./Инструкция руководителя СП.PDF" target="_blank">Инструкция руководителя СП</a>
      </div>
    </template>
    <template #main>
      <div class="content" v-if="rolesStore.roles.length > 0">
        <router-view v-slot="{ Component, route }">
          <Transition :name="route.meta.transition as string || 'slide-right'" mode="out-in">
            <Suspense>
              <component :is="Component" />
            </Suspense>
          </Transition>
        </router-view>
      </div>
      <div v-else class="content">
        <h3>У вас нет прав, на просмотр данной страницы. Обратитесь в ОСТРиМК</h3>
      </div>
    </template>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { computed, inject, provide, ref, watch, type Ref } from 'vue'
import useHttp from './composables/use-http.composable'
import type { KeycloakInstance } from 'keycloak-js'
import {
  TnncLogo,
  type NavigationItem,
  NavigationComponent,
  DefaultLayout,
  notify
} from 'tnnc-ui-kit'
import { useRoleStore } from './store'
import { useElementBounding } from '@vueuse/core'

const keycloak = inject('keycloak') as KeycloakInstance
const { http } = useHttp(keycloak, notify)
provide('http', http)
const { http: silentHttp } = useHttp(keycloak, notify)
provide('silentHttp', silentHttp)
const rolesStore = useRoleStore()

type NavigationItemExtended = NavigationItem & { roles?: string[] }

const navItems: Ref<NavigationItemExtended[]> = ref([
  {
    name: 'Главная',
    link: '/'
  },
  {
    name: 'Опрос',
    link: '/survey',
    roles: ['RESPONDENT']
  },
  {
    name: 'Корректирующие действия',
    link: '/actions',
    roles: ['ADMINISTRATOR', 'RESPONSIBLE', 'MANAGER']
  },
  {
    name: 'Отчеты',
    child: [
      {
        name: 'Мои ответы',
        link: '/my-answers',
        roles: ['RESPONDENT']
      },
      {
        name: 'КД к моим замечаниям',
        link: '/my-actions',
        roles: ['RESPONDENT']
      },
      {
        name: 'Оценки подразделению',
        link: '/department-answers',
        roles: ['RESPONSIBLE']
      },
      {
        name: 'КД подразделения',
        link: '/department-actions',
        roles: ['RESPONSIBLE']
      },
      {
        name: 'Все ответы',
        link: '/all-answers',
        roles: ['ADMINISTRATOR', 'MANAGER']
      },
      {
        name: 'Все КД',
        link: '/all-actions',
        roles: ['ADMINISTRATOR', 'MANAGER']
      },
      {
        name: 'Все ответы',
        link: '/viewer-answers',
        roles: ['VIEWER']
      },
      {
        name: 'Все КД',
        link: '/viewer-actions',
        roles: ['VIEWER']
      }
    ]
  },
  {
    name: 'Участники опроса',
    link: '/managment/users',
    roles: ['ADMINISTRATOR']
  },
  {
    name: 'Блоки вопросов',
    link: '/managment/blocks',
    roles: ['ADMINISTRATOR']
  },
  {
    name: 'Периоды проведения',
    link: '/managment/periods',
    roles: ['ADMINISTRATOR']
  }
])

const filteredNavItems = computed(() => {
  return navItems.value.map(fiterByRoles).filter((item) => item.name !== 'deleted')
})

function fiterByRoles(navItem: NavigationItemExtended) {
  const { roles } = rolesStore
  if (
    (navItem.roles && roles.some((userRole) => navItem.roles?.includes(userRole))) ||
    !navItem.roles ||
    navItem.roles?.length === 0
  ) {
    const newNavItem = { ...navItem, roles: undefined } as NavigationItem
    if (newNavItem.child)
      newNavItem.child = newNavItem.child
        .map(fiterByRoles)
        .filter((item) => item.name !== 'deleted')
    return newNavItem
  }
  return { ...navItem, name: 'deleted' }
}

const embeded = inject('embeded')
const content = ref()
const { height } = useElementBounding(content)
watch(height, (newVal) => {
  window.top?.postMessage(newVal > 1000 ? newVal : 1000, '*')
})
</script>

<style lang="scss">
.content {
  min-height: 100%;
}
.stretch-table {
  height: calc(100vh - 110px);
  width: 100%;
}
.tnnc-button {
  white-space: nowrap;
  overflow: hidden;
}
.tnnc-table-wrapper {
  min-height: unset !important;
  flex: 1;
}
.tnnc-table {
  display: flex;
  flex-direction: column;
}
.tnnc-date-time-picker-wrapper {
  z-index: 9999 !important;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.2s ease;
}
.slide-left-leave-from,
.slide-right-leave-to {
  opacity: 0;
}
.slide-left-enter-to,
.slide-right-enter-from {
  opacity: 0;
}
.file-link {
  gap: 10px;
  i {
    font-size: 30px !important;
  }
  a {
    flex: 1;
  }
}
.embeded {
  aside {
    display: none;
  }
  main {
    padding: 0 !important;
    border-radius: 5px;
  }
}
</style>
