<script setup lang="ts">
const props = defineProps<{
  backdrop: boolean;
}>();

const emit = defineEmits(['hideModal']);

const backdrop: boolean = props.backdrop;
const hideModal = (): void => {
  emit('hideModal', { aaa: 'bbb' });
};
</script>

<template>
  <div
    class="overlay"
    v-on:mouseover="hideModal"
    :class="{ backdrop: backdrop }"
  ></div>
</template>

<style scoped lang="scss">
.overlay {
  z-index: 1;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}
.backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
