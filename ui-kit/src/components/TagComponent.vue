<template>
  <div class="tnnc-tag" :class="[cssClass, { 'allow-delete': allowDelete }]">
    {{ text }}
    <button v-if="allowDelete" class="tag-delete-button" @click.prevent="emitDeleted">
      <i class="tag-delete-icon"></i>
    </button>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  text: string;
  cssClass?: string;
  allowDelete?: boolean;
}>();
const emit = defineEmits<{ (e: "deleted"): void }>();
function emitDeleted() {
  emit("deleted");
}
</script>
<style>
.tnnc-tag {
  background: var(--tnnc-color-gray-standart);
  border-radius: 10px;
  padding: 7.5px 15px;
  font-size: 14px;
  line-height: 17px;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  transition: all 0.2s;
}
.tnnc-tag:hover {
  background: var(--tnnc-add-color-gray-4);
}
.tnnc-tag.allow-delete {
  background: var(--tnnc-color-blue);
  color: rgba(255, 255, 255, 0.5);
}
.tag-delete-button {
  height: 17px;
  width: 17px;
  border: none;
  background: transparent;
  padding: 2px;
  cursor: pointer;
}

.tag-delete-icon {
  height: 100%;
  width: 100%;
  background: url("../assets/images/delete-icon.svg") no-repeat center center /
    contain;
  display: block;
  opacity: 0.5;
  transition: all 0.2s;
}
.tag-delete-button:hover .tag-delete-icon {
  transform: rotate(-90deg);
  opacity: 1;
}
.tnnc-tag.allow-delete:hover {
  color: white;
  background: #7a45ec;
}
</style>
