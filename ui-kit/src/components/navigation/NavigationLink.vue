<template>
  <div
    v-if="isVisible"
    class="tnnc-navigation-link"
    :class="[item.cssClass, { 'tnnc-navigation-link-active': isActive }]"
    @mouseenter="() => (hovered = true)"
    @mouseleave="() => (hovered = false)"
  >
    <RouterLink
      v-if="item.link && !item.external"
      :to="item.link"
      :target="item.newWindow ? '_blank' : ''"
      >{{ item.name }}</RouterLink
    >
    <a v-else :href="item.link" :target="item.newWindow ? '_blank' : ''">{{
      item.name
    }}</a>
    <i
      v-if="item.child?.length"
      class="fa-solid fa-chevron-right"
      :class="{ hovered }"
    ></i>
    <div
      v-if="item.child?.length"
      class="tnnc-navigation-menu tnnc-navigation-link-child-list"
      :class="{ hovered }"
    >
      <NavigationLink
        v-for="child in item.child"
        :key="child.name"
        :item="child"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { NavigationItem } from './NavigationComponent.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps<{
  item: NavigationItem;
}>();
const hovered = ref(false);
const isActive = computed(
  () => route.path === props.item.link || hasActiveChilds(props.item.child),
);

function hasActiveChilds(links?: NavigationItem[]): boolean {
  if (!links) return false;
  return links.some(
    (link) => link.link === route.path || hasActiveChilds(link.child),
  );
}
function getVisibleValue(item: NavigationItem) {
  if (item.child?.length && item.visible === undefined) {
    return item.child.some(getVisibleValue);
  }
  return item.visible !== false;
}
const isVisible = computed(() => getVisibleValue(props.item));
</script>
<style>
.tnnc-navigation-link {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  align-items: center;
}
.tnnc-navigation-link a {
  font-size: 17px;
  padding: 10px 0;
  color: black;
  text-decoration: none;
  font-weight: 400;
}
.tnnc-navigation-link a:visited {
  color: black;
}
.tnnc-navigation-link a:active,
.tnnc-navigation-link a:focus {
  filter: none;
  color: rgb(72, 72, 72);
}
.tnnc-navigation-link a:hover {
  filter: none;
  color: rgb(72, 72, 72);
}

.tnnc-navigation-link i {
  font-size: 14px;
  color: var(--tnnc-add-color-gray-3);
}

.tnnc-navigation-link-child-list {
  position: absolute;
  z-index: 5;
  left: 99%;
  top: 0;
  background: var(--color-white-contrast);
  padding: 5px 10px;
  border-radius: 0px 5px 5px 5px;
  box-shadow: 1px 2px 2px #aeaeae;
  min-width: 200px;
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  opacity: 0;
  transform: scaleX(0) translateX(-150%);
}

.tnnc-navigation-link .tnnc-navigation-link-child-list.hovered {
  opacity: 1;
  transform: scaleX(1) translateX(0);
}
.tnnc-navigation-link i.hovered {
  color: rgb(72, 72, 72);
}
.tnnc-navigation-link-active > a {
  color: black !important;
  -webkit-text-decoration-color: black !important;
  text-decoration-color: black !important;
  font-weight: 700;
}
</style>
