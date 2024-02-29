<template>
  <DefaultLayout>
    <template #side>
      <TnncLogo />
      <NavigationComponent :navigation-items="navItemsFiltered" />
      <LoaderComponent v-if="loading.isLoading" />
      <UserProfile />
    </template>
    <template #main>
      <div class="content">
        <router-view v-slot="{ Component, route }">
          <Suspense>
            <template #default>
              <component :is="Component" :key="route.fullPath" />
            </template>
          </Suspense>
        </router-view>
      </div>
    </template>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { computed, inject, ref, type Ref } from 'vue'
import {
  NavigationComponent,
  TnncLogo,
  type NavigationItem,
  DefaultLayout,
  LoaderComponent
} from 'tnnc-ui-kit'
import type { KeycloakInstance } from 'keycloak-js'
import { useLoadingState } from './store/loading.state'
import UserProfile from './components/general/UserProfile.vue'
import { base_url } from './config/urls'
import useHandbooks from './widgets/handbooks/composables/useHandbooks.composable'
import { useRouter, type RouteRecordNormalized, type RouteRecordRaw } from 'vue-router'

const loading = useLoadingState()
const keycloak = inject('keycloak') as KeycloakInstance
const { getAllHandbookNew } = useHandbooks()
getAllHandbookNew()

const navItems: Ref<NavigationItem[]> = ref([
  {
    name: 'Назад к старому интерфейсу',
    link: `${base_url}:8082`,
    external: true
  },
  {
    name: 'Тематический план работ',
    link: '/tpr'
  },
  {
    name: 'Справочники',
    link: '/handbooks'
  },
  {
    name: 'Администрирование',
    child: [
      {
        name: 'Модератор срезов',
        link: '/moderator'
      }
    ]
  }
])
const router = useRouter()

function createNavItemFromRouteRecord(
  routeRecord: RouteRecordNormalized | RouteRecordRaw,
  previousRoute: string = ''
): NavigationItem {
  return {
    name: String(routeRecord.meta?.title || 'Роут без имени'),
    link: routeRecord.children
      ? undefined
      : [previousRoute, routeRecord.path].filter((item) => item !== '').join('/'),
    child: routeRecord.children?.map((record) =>
      createNavItemFromRouteRecord(
        record,
        [previousRoute, routeRecord.path].filter((item) => item !== '').join('/')
      )
    )
  }
}

const navItemsWithReports = computed(() => {
  const routerRoutes = router.getRoutes()
  const itemsList = [...navItems.value]
  const reportRoute = routerRoutes.find((route) => route.path === '/report')
  if (reportRoute) {
    itemsList.push(createNavItemFromRouteRecord(reportRoute))
  }

  return itemsList
})
const navItemsFiltered = computed(() =>
  keycloak.hasResourceRole('admin', 'supp')
    ? navItemsWithReports.value
    : navItemsWithReports.value.filter((navItem) => navItem.name !== 'Администрирование')
)
</script>

<style lang="scss">
.container {
  margin: 5px 0;
}
.content {
  min-height: 100%;
}
.stretch-table {
  height: calc(100vh - 10px);
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
.tnnc-table tbody td {
  height: 21px;
}
.tnnc-table-cell.computed {
  text-align: right;
}
.tnnc-aside-content {
  height: 100%;
}
</style>
./composables/http/use-http.composable
