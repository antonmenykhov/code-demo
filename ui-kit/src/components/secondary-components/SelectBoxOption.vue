<template>
  <div class="tnnc-select-item-wrapper">
    <div
      class="tnnc-select-option"
      :class="{ selected: selected }"
      :title="`${option.name}`"
    >
      <div class="tnnc-select-option-collapse" v-if="isTree">
        <button
          v-if="hasChilds"
          class="tnnc-input-button"
          @click.prevent="() => (childVisible = !childVisible)"
        >
          <i
            class="tnnc-select-box-button-icon"
            :class="{ rotated: !childVisible }"
          ></i>
        </button>
      </div>
      <Checkbox
        v-if="showSelectBox"
        :value="selected"
        class="tnnc-select-option-checkbox"
        @click="onClick"
      />
      <div @click="onClick" class="tnnc-select-option-name">
        {{ option.name }}
      </div>
    </div>
    <div v-if="hasChilds && childVisible" class="tnnc-select-option-childs">
      <select-box-option
        v-for="childOption in option.child"
        :key="childOption.key"
        :option="childOption"
        :show-select-box="showSelectBox"
        :selected="selectedOptions?.includes(childOption.key)"
        :is-tree="isTree"
        :selectedOptions="selectedOptions"
        @click="childClick"
        @child-click="childClick"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { OptionPrimitive } from '../SelectBox.vue';
import Checkbox from '../Checkbox.vue';
import { computed, ref } from 'vue';

export type OptionComputed = {
  key: string | number;
  name: string | number;
  value: OptionPrimitive;
  child?: OptionComputed[];
};

const props = defineProps<{
  option: OptionComputed;
  showSelectBox: boolean;
  selectedOptions: Array<string | number | boolean>;
  selected: boolean;
  isTree?: boolean;
}>();
const emit = defineEmits<{
  (e: 'click', data: OptionPrimitive): void;
  (
    e: 'childClick',
    data: { child: OptionPrimitive[]; parent: OptionPrimitive[] },
  ): void;
}>();

const hasChilds = computed(
  () => props.isTree && props.option.child && props.option.child.length > 0,
);

const childVisible = ref(false);
function getAllChildsRecursive(option: OptionComputed) {
  const childs: OptionPrimitive[] = [];
  childs.push(option.value);
  option.child?.forEach((child) => {
    childs.push(...getAllChildsRecursive(child));
  });
  return childs;
}
function treeClick() {
  const childs = getAllChildsRecursive(props.option);
  emit('childClick', { parent: [], child: childs });
}
function childClick(data: {
  child: OptionPrimitive[];
  parent: OptionPrimitive[];
}) {
  emit('childClick', { ...data, parent: [...data.parent, props.option.value] });
}
function onClick() {
  if (props.isTree) return treeClick();
  emit('click', props.option.value);
}
</script>
<style>
.tnnc-select-option-childs {
  padding-left: 20px;
}
.tnnc-select-option-collapse {
  width: 20px;
}
.tnnc-select-option-collapse .tnnc-input-button{
  padding: 0;
}
.tnnc-select-box-button-icon.rotated {
  transform: rotate(0deg);
}
.tnnc-select-option-name {
  padding: 4px 0;
}
</style>
