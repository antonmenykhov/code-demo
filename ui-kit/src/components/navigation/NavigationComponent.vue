<template>
  <nav class="tnnc-navigation-menu">
    <NavigationLink
      v-for="item in navigationItems"
      :key="item.name"
      :item="item"
    />
  </nav>
</template>
<script lang="ts" setup>
import NavigationLink from './NavigationLink.vue';

export type NavigationItem = {
  name: string;
  link?: string;
  newWindow?: boolean;
  external?: boolean;
  child?: NavigationItem[];
  cssClass?: string;
  visible?: boolean;
};
const props = defineProps<{
  navigationItems: NavigationItem[];
}>();
</script>
<style>
.tnnc-navigation-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
