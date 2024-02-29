<template>
  <div class="tnnc-breadcrumbs">
    <router-link
      v-for="breadcrumb in breadcrumbs.slice(0, breadcrumbs.length - 1)"
      :key="breadcrumb.name"
      :to="breadcrumb.route"
      class="tnnc-breadcrumb"
    >
      {{ breadcrumb.name }}
    </router-link>
    <a
      v-for="breadcrumb in breadcrumbs.slice(breadcrumbs.length - 1)"
      :key="breadcrumb.name"
      class="tnnc-breadcrumb"
    >
      {{ breadcrumb.name }}
    </a>
  </div>
</template>
<script lang="ts" setup>
export type Breadcrumb = {
  name: string;
  route: string;
};
const props = defineProps<{
  breadcrumbs: Breadcrumb[];
}>();
</script>
<style>
.tnnc-breadcrumbs {
  display: flex;
  gap: 24px;
  margin: 10px 0;
}
.tnnc-breadcrumb {
  color: var(--tnnc-add-color-gray-3);
  cursor: pointer;
  text-decoration: solid underline transparent 1px;
  transition: all 0.2s;
  position: relative;
}
.tnnc-breadcrumb:last-child {
  color: var(--tnnc-color-black);
  cursor: auto;
}
.tnnc-breadcrumb:last-child:hover {
  filter: none;
  text-decoration: transparent;
}
.tnnc-breadcrumb::before {
  content: "";
  position: absolute;
  left: -24px;
  top: 2px;
  bottom: 1px;
  width: 24px;
  background: url("../assets/images/arrow-gray.svg") no-repeat center center /
    contain;
}
.tnnc-breadcrumb:last-child::before {
  background: url("../assets/images/arrow-orange.svg") no-repeat center center /
    contain;
}
.tnnc-breadcrumb:first-child::before {
  display: none;
}
</style>
