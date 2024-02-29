<template>
  <DefaultLayout>
    <template #side>
      <TnncLogo /> <NavigationComponent :navigation-items="filteredNavItems" />
      <Teleport to="body">
        <LoaderComponent v-if="loading.isLoading" />
      </Teleport>
    </template>
    <template #main>
      <div class="content" v-if="roles.isUser && isHandbooksLoaded">
        <router-view v-slot="{ Component, route }">
          <Suspense
            v-if="!route.meta.requiredRoles ||(route.meta.requiredRoles as string[]).some((item) => roles[item as keyof typeof roles])"
          >
            <div class="container">
              <div class="title-row">
                <h1>{{ title }}</h1>
                <p>{{ versionName }}</p>
              </div>

              <component :is="Component" />
            </div>
          </Suspense>
          <div v-else><h1>Нет доступа к разделу</h1></div>
        </router-view>
      </div>
      <div v-else><h1>Нет доступа к системе</h1></div>
    </template>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, provide, ref } from 'vue'
import useHttp from './composables/use-http.composable'
import type { KeycloakInstance } from 'keycloak-js'
import { TnncLogo, NavigationComponent, notify, DefaultLayout, confirm } from '@tnnc/tnnc-ui-kit'
import useServiceStaff from './composables/use-service-staff.composable'
import useHandbooks from './views/handbooks/useHandbooks.composable'
import { loadingState } from './store/loading.state'
import LoaderComponent from './components/LoaderComponent.vue'
import { roleStore } from './store/role.store'
import { baseUrl } from './config/baseUrl'
import { versionStore } from './store/version.store'
import { storeToRefs } from 'pinia'
import { titleStore } from './store/title.store'
import useUserStatus from './composables/use-user-status.composable'

const loading = loadingState()

const keycloak = inject('keycloak') as KeycloakInstance
const { http } = useHttp(keycloak, notify)
const { http: silentHttp } = useHttp(keycloak, notify, true)
provide('http', http)
provide('silentHttp', silentHttp)
const { getDepartments, getMvz, getEmployees, getDepartmentsTree, getDirectorsOfDepartment } =
  useServiceStaff(silentHttp)
getDepartments()
getMvz()
getEmployees()
getDepartmentsTree()
getDirectorsOfDepartment()
const isHandbooksLoaded = ref(false)
const { getAllHandbooks } = useHandbooks(http)
getAllHandbooks().then(() => {
  isHandbooksLoaded.value = true
})
const roles = roleStore()
http.get(`${baseUrl}/get_user_info`).then(({ data }) => {
  roles.userInfo = data
})
const navItems = computed(() => {
  const { isAdmin, isCurator, isEconomist, isManager } = roles
  return [
    {
      name: 'Список командировок',
      link: '/',
      rendered: isAdmin || isCurator || isEconomist || isManager
    },
    {
      name: 'Справочники',
      link: '/handbook',
      rendered: isAdmin || isEconomist
    },
    {
      name: 'Отчеты',

      rendered: isAdmin || isCurator || isEconomist || isManager,
      child: [
        {
          name: 'Главный отчет',
          link: '/report'
        },
        {
          name: 'Отчет по суточным',
          link: '/report-daily-payment'
        }
      ]
    },
    {
      name: 'Администрирование',
      rendered: isAdmin || isEconomist,
      child: [
        {
          name: 'Пользователи',
          link: '/managment/users'
        },
        {
          name: 'Роли',
          link: '/managment/roles'
        },
        {
          name: 'Доступ пользователей',
          link: '/managment/user-access'
        },
        {
          name: 'Статусы пользователей',
          link: '/managment/statuses'
        }
      ]
    },
    {
      name: 'Фактические данные',
      rendered: isAdmin || isEconomist,
      child: [
        { name: 'Загруженный факт', link: '/fact/handbook' },
        { name: 'Обработанный факт', link: '/fact/handbook-pre' },
        { name: 'Загрузка данных', link: '/fact/upload' }
      ]
    }
  ].filter((item) => item.rendered)
})

const filteredNavItems = computed(() => {
  return navItems.value
})
onMounted(() => {
  if (window.location.hostname === '10.28.70.23') {
    confirm('Вы находитесь на тестовом сервере, продолжить работу?')
      .then(() => {})
      .catch(() => {
        document.location = 'about:blank'
      })
  }
})

const { versionName } = storeToRefs(versionStore())
const { getVersion } = versionStore()
getVersion(http)
const { title } = storeToRefs(titleStore())
const { getUserStatus } = useUserStatus(http)
getUserStatus()
</script>

<style lang="scss">
.container {
  margin: 0;
}

.content {
  min-height: 100%;
}
.tnnc-table.stretch-table {
  height: calc(100vh - 110px);
  width: 100%;
  td {
    padding-left: 5px;
    padding-right: 5px;
  }
}

.tnnc-table-wrapper {
  min-height: unset !important;
  flex: 1;
}
.tnnc-table {
  display: flex;
  flex-direction: column;
  td {
    height: 21px !important;
    padding-left: 5px;
    padding-right: 5px;
  }
}
//:root {
//  --tnnc-color-orange: #ffd740 !important;
//  --tnnc-color-blue: #1d1d1b !important;
//  --tnnc-color-gray-light: #f7f7f7 !important;
//  --tnnc-color-gray-standart: #eeeeee !important;
//}
//a:hover,
//a:active,
//a:focus {
//  filter: drop-shadow(0px 0px 1px #3d3d3d) !important;
//}

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
.tnnc-notification-message {
  .text {
    font-size: 20px;
    min-width: 100px;
  }
  .icon i {
    font-size: 24px;
  }
  .icon {
    height: 30px !important;
    width: 30px !important;
    margin: 5px 10px;
  }
}
.container.input-form {
  max-width: 1000px;

  input {
    background: white;
    padding-left: 10px !important;
    border-radius: 5px 5px 0 0;
  }
  input:read-only,
  input:disabled {
    background: transparent;
  }
  .tnnc-check-box {
    transform: scale(0.8);
    input {
      border-radius: 8px;
      padding-left: 0 !important;
    }
  }

  .buttons {
    margin-top: 15px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  .small-button {
    font-size: 13px;
    padding: 5px;
    height: 30px;
    width: 30px;
  }
  .transport-header {
    td {
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
    }
  }
  .input-with-button {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  .tnnc-check-box {
    flex-direction: row-reverse;
    justify-content: flex-start;
    label {
      width: 80px;
    }
  }
}
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    margin: 0;
    line-height: 1;
    font-weight: 500;
    font-size: 16px;
  }
}
.content {
  .tnnc-group-row td {
    background: #d8e6f5;
  }
}
</style>
