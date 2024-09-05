<script setup lang="ts">
import { inject, ref } from 'vue';
import type { Ref } from 'vue';
import { ctrlButtonDefs as d } from '../def/ctrl-button';
import type { ButtonType } from '../type/ctrl-button.d';

const props = defineProps<{
  type: ButtonType;
  active?: boolean;
  display?: boolean;
}>();

const emit = defineEmits(['btnClick']);

const i18n: Ref<any> = inject('i18n') || ref('');

const btnClick = () => {
  if (!props.active) {
    return;
  }
  emit('btnClick');
};
</script>

<template>
  <button
    v-bind:style="{
      width: d[props.type].size.width,
      height: d[props.type].size.height,
      borderRadius: d[props.type].size.radius,
      color: d[props.type].textColor,
      background: d[props.type].background,
      border: d[props.type].border,
      cursor: active ? 'pointer' : '',
      display: props.display ? 'initial' : 'none',
    }"
    :class="{
      selectable: props.active,
    }"
    class="aura"
    @click="btnClick()"
  >
    {{ i18n(d[props.type].label) }}
  </button>
</template>

<style scoped></style>
