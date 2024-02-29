<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import {
  ConfigProvider,
  Layout,
  LayoutContent,
  Menu,
  MenuItem,
  LayoutSider,
  LayoutHeader,
  Drawer,
  Button
} from 'ant-design-vue'
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons-vue'
import ru_RU from 'ant-design-vue/es/locale/ru_RU'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import useAppNavigation from '@/composables/useAppNavigation.composable'
import { storeToRefs } from 'pinia'
import { useUserInfoStore } from './stores/userInfoStore'
import { inject, ref } from 'vue'
import Keycloak from 'keycloak-js'
import { useModeStore } from './stores/modeStore'
import { useDocumentTitleStore } from './stores/documentTitleStore'

dayjs.locale('ru')

const theme = { token: { colorBorderSecondary: '#d9d9d9' } }
const { keycloak } = storeToRefs(useUserInfoStore())
const injectedKeycloak = inject('keycloak') as Keycloak
keycloak.value = injectedKeycloak
const route = useRoute()
const { navigationElements, onMenuItemClick, selectedKeys } = useAppNavigation()
const { isMobile } = storeToRefs(useModeStore())
const { currentPageName } = storeToRefs(useDocumentTitleStore())
const isDrawerOpened = ref(false)
function menuItemClickHandler(e: MouseEvent) {
  onMenuItemClick(e)
  if (isMobile.value) isDrawerOpened.value = false
}
</script>

<template>
  <ConfigProvider :locale="ru_RU" :theme="theme">
    <Layout style="width: 100%">
      <LayoutHeader v-if="isMobile" class="mobile-header">
        <Button @click="() => (isDrawerOpened = true)" type="primary"> <MenuOutlined /> </Button>
        <h2>{{ currentPageName }}</h2></LayoutHeader
      >
      <Drawer v-if="isMobile" v-model:open="isDrawerOpened" title="Меню" placement="left">
        <Menu v-model:selected-keys="selectedKeys" class="without-border">
          <MenuItem
            @click="menuItemClickHandler"
            v-for="(item, index) in navigationElements"
            :key="index"
          >
            <component :is="item.iconComponent"></component>
            <span>{{ item.caption }}</span>
            <div class="counter" v-if="item.count">{{ item.count }}</div>
          </MenuItem>

          <MenuItem :key="100" @click="keycloak?.logout()">
            <LogoutOutlined /> <span>Выход</span></MenuItem
          >
        </Menu>
      </Drawer>
      <Layout>
        <LayoutSider v-if="!isMobile" collapsible breakpoint="lg" style="min-height: 100vh">
          <Menu theme="dark" mode="inline" v-model:selected-keys="selectedKeys">
            <MenuItem
              @click="onMenuItemClick"
              v-for="(item, index) in navigationElements"
              :key="index"
            >
              <component :is="item.iconComponent"></component>
              <span>{{ item.caption }}</span>
              <div class="counter" v-if="item.count">{{ item.count }}</div>
            </MenuItem>

            <MenuItem :key="100" @click="keycloak?.logout()">
              <LogoutOutlined /> <span>Выход</span></MenuItem
            >
          </Menu>
        </LayoutSider>

        <Layout class="main-content-layout">
          <LayoutContent>
            <Suspense>
              <RouterView :key="route.fullPath" />
            </Suspense>
          </LayoutContent>
        </Layout>
      </Layout>
    </Layout>
  </ConfigProvider>
</template>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
}
#app {
  width: 100% !important;
  max-width: 100%;
  padding: 0;
  display: flex;
}
.ant-message {
  left: 0 !important;
}
.counter {
  position: absolute;
  right: 0;
  top: 0;
  background: #ff4d4f;
  min-width: 18px;
  height: 18px;
  color: #ffffff;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  padding: 0 5px;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.main-content-layout {
  padding: 10px;
}
.ant-layout-header {
  padding-inline: 10px !important;
}
.mobile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  h2 {
    color: white;
  }
}
.without-border {
  border: none !important;
}
@media (max-width: 700px) {
  .ant-form-item {
    margin-bottom: 10px;
  }
  .ant-form-item-label {
    line-height: 1 !important;
    label {
      height: fit-content !important;
    }
  }
}
.form-table {
  border-spacing: 0;
  border-collapse: collapse;
  overflow: hidden;
  margin-bottom: 5px;
  width: 100%;
  th {
    padding: 1px 5px;
    background: #e7e6e6;
    border-radius: 7px;
    border: 2px solid white;
    color: #333;
    &:last-child {
      background: transparent;
    }
  }
  &.isMobile {
    display: block;
    overflow: auto;
    width: 100%;
  }
}
</style>
