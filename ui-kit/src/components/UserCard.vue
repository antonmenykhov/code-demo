<template>
  <div
    class="tnnc-user-card"
    :class="cssClass"
    @mouseenter="showFull"
    @mouseleave="showMinimal"
    @click="emitCardClicked"
  >
    <picture
      class="tnnc-user-avatar"
      :class="{
        'no-margin': !showMoreButtonComputed && !currentUserName.length,
      }"
      @click="emitAvatarClicked"
    >
      <img :src="imageUrl" :alt="fullName" />
    </picture>
    <div
      ref="refUserName"
      class="tnnc-user-card-name"
      :class="{
        'no-margin': !currentUserName.length || (expanded && expandable),
      }"
    >
      {{ currentUserName }}
    </div>
    <div
      v-if="expandable"
      ref="refFullUserName"
      class="tnnc-user-card-name"
      :class="{ 'no-margin': !expanded }"
      style="width: 0px"
    >
      {{ fullName }}
    </div>
    <button
      ref="refButton"
      class="tnnc-user-card-more-btn"
      :class="{
        'no-margin': !showMoreButtonComputed,
        'btn-visible': showMoreButtonComputed,
      }"
      @click.prevent="emit('more-btn-clicked')"
    >
      <i class="tnnc-more-icon"></i>
    </button>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, type Ref } from 'vue';

const props = withDefaults(
  defineProps<{
    imageUrl: string;
    fullName: string;
    showMoreButton?: boolean;
    size?: 'small' | 'medium' | 'large';
    expandable?: boolean;
    firstName?: string;
    cssClass?: string;
  }>(),
  { size: 'large', showMoreButton: false },
);
const emit = defineEmits<{
  (e: 'more-btn-clicked'): void;
  (e: 'card-clicked'): void;
  (e: 'avatar-clicked'): void;
}>();
const showMoreButtonComputed = computed(() => {
  if (props.showMoreButton) {
    if (expanded.value) return true;
    if (props.size === 'large') return true;
    if (!props.expandable) return true;
  }
  return false;
});
const expanded = ref(false);
const refFullUserName: Ref<HTMLElement | null> = ref(null);
const refUserName: Ref<HTMLElement | null> = ref(null);
const refButton: Ref<HTMLElement | null> = ref(null);
function showFull() {
  expanded.value = true;
  if (
    refUserName.value &&
    refFullUserName.value &&
    props.expandable &&
    props.size !== 'large'
  ) {
    refUserName.value.style.width = `0px`;
    refFullUserName.value.style.width = `${refFullUserName.value.scrollWidth}px`;
  }
}
function showMinimal() {
  expanded.value = false;
  if (
    refUserName.value &&
    refFullUserName.value &&
    props.expandable &&
    props.size !== 'large'
  ) {
    refUserName.value.style.width = `${refUserName.value.scrollWidth}px`;
    refFullUserName.value.style.width = `0px`;
  }
}

const userName = computed(() => {
  const { size, fullName, firstName } = props;
  if (size === 'medium') return firstName || fullName.split(' ')[0];
  if (size === 'small') return '';
  return fullName;
});
const currentUserName = ref(userName.value);
function emitCardClicked(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target.tagName !== 'BUTTON' && target.tagName !== 'button')
    emit('card-clicked');
}
function emitAvatarClicked() {
  emit('avatar-clicked');
}
</script>
<style>
.tnnc-user-card {
  display: flex;
  align-items: center;
  background: var(--tnnc-color-gray-standart);
  border-radius: 24px;
  width: fit-content;
  transition: all 0.4s;
  overflow: hidden;
}
.tnnc-user-card > * {
  margin-right: 10px;
}
.tnnc-user-card-name {
  transition: all 0.4s;
  overflow: hidden;
  white-space: nowrap;
  will-change: transform;
}
.tnnc-user-avatar {
  height: 38px;
  width: 38px;
  padding: 3px;
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.2s;
  will-change: transform;
}
.tnnc-user-avatar img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.tnnc-user-card-more-btn {
  width: 0px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s;
  will-change: transform;
  opacity: 0;
}
.tnnc-user-card-more-btn.btn-visible {
  width: 20px;
  opacity: 1;
}
.tnnc-more-icon {
  height: 4px;
  width: 4px;
  background: var(--tnnc-add-color-gray-3);
  border-radius: 50%;
  position: relative;
  transition: all 0.4s;
}
.tnnc-more-icon::before,
.tnnc-more-icon::after {
  height: 4px;
  width: 4px;
  background: var(--tnnc-add-color-gray-3);
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: -8px;
  content: '';
  transition: all 0.4s;
}
.tnnc-more-icon::after {
  left: 8px;
}
.tnnc-user-card-more-btn:hover .tnnc-more-icon {
  transform: rotateY(180deg);
}
.tnnc-user-card:hover .tnnc-more-icon,
.tnnc-user-card:hover .tnnc-more-icon::after,
.tnnc-user-card:hover .tnnc-more-icon::before {
  background: var(--color-white-contrast);
}
.tnnc-user-card:hover {
  background: var(--tnnc-color-blue);
}
.tnnc-user-card:hover .tnnc-user-card-name {
  color: var(--color-white-contrast);
}
.no-margin {
  margin: 0;
  transition: all 0.4s;
}
</style>
