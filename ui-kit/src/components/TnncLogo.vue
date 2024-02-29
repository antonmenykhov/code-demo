<template>
  <div class="tnnc-logo">
    <img v-if="link == null" src="../assets/logo-tnnc.png" alt="ТННЦ" />
    <a v-else class="tnnc-logo-link" :href="link">    
      <img v-if="newYearLogo" src="../assets/logo-tnnc-ny.png" alt="ТННЦ" />
      <img v-else src="../assets/logo-tnnc.png" alt="ТННЦ" />
    </a>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  link: {
    type: String || null,
    default: ()=>null
  },
  newYearLogo:{
    type:Boolean,
    default:()=>false
  }
})
</script>
<style>
.tnnc-logo {
  width: 100%;
  margin: 20px 0;
  height: 100px;
  text-align: center;
}
.tnnc-logo-link {
  cursor: pointer;
}
.tnnc-logo-link:hover,
.tnnc-logo-link:active,
.tnnc-logo-link:focus {
  filter: none;
}
.tnnc-logo img {
  object-fit: contain;
  object-position: center;
  height: 100%;
  max-width: 100%;
}
</style>
