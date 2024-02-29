<template>
  <DefaultLayout>
    <template #side>
      <TnncLogo />
      <NavigationComponent :navigation-items="navItems" />
      <Teleport to="body">
        <LoaderComponent v-if="isLoading" />
      </Teleport>
    </template>
    <template #main>
      <div class="content" ref="content" v-if="true">
        <router-view v-slot="{ Component, route }">
          <Suspense v-if="true">
            <component :is="Component" :key="route.fullPath" />
          </Suspense>
          <div v-else>
            <h1>Нет доступа к разделу</h1>
            <ButtonComponent text="Выйти" @click="keycloak.logout()" />
          </div>
        </router-view>
      </div>
      <div v-else><h1>Нет доступа к системе</h1></div>
    </template>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  TnncLogo,
  type NavigationItem,
  NavigationComponent,
  DefaultLayout,
  LoaderComponent,
  ButtonComponent
} from '@tnnc/tnnc-ui-kit'
import { useLoadingState } from './store/loading.state'
import { storeToRefs } from 'pinia'
import { useLockStore } from './store/lock.store'

const { isLoading } = storeToRefs(useLoadingState())
const { keycloak } = storeToRefs(useLockStore())

const navItems = computed<NavigationItem[]>(() => {
  return [
    { link: '/request-card/new', name: 'Подать заявку', cssClass: 'overlined' },
    { link: '/my-requests', name: 'Мои заявки', cssClass: 'underlined' },
    { link: '/requests', name: 'Все заявки', cssClass: 'underlined' },
    { link: '/handbooks', name: 'Справочники' },
    { link: '/forms', name: 'Формы' },
    { link: '/request-stages', name: 'Стадии заявок' },
    { link: '/report', name: 'Отчет' }
  ]
})
</script>

<style lang="scss">
.container {
  margin: 0;
}

.tnnc-table.stretch-table {
  height: calc(100vh - 110px);
  width: 100%;
  td {
    padding-left: 5px;
    padding-right: 5px;
  }
}
\ .tnnc-table-wrapper {
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
.tnnc-pop-up {
  background: var(--tnnc-color-gray-light) !important;
}
.tnnc-check-box input[type='checkbox']:checked {
  background: var(--tnnc-color-blue);
}
.overlined {
  border-top: 2px solid black;
}
.underlined {
  border-bottom: 2px solid black;
}
</style>
