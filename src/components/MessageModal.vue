<script setup lang="ts">
const props = defineProps<{
  message: String;
  backdrop: Boolean;
}>();

const emit = defineEmits(['hideModal']);

const hideModal = (): void => {
  emit('hideModal', { aaa: 'bbb' });
};
</script>

<template>
  <div v-if="message">
    <div class="message" @click="hideModal">{{ props.message }}</div>

    <div
      class="overlay"
      v-on:mouseover="hideModal"
      :class="{ backdrop: props.backdrop }"
    ></div>
  </div>
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
