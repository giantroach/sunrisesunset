<script setup lang="ts">
import { auraDef } from '../def/aura';

const props = defineProps<{
  type: string;
  radius: string;
  active?: boolean;
}>();

const type: string = props.type; // card type
const radius: string = props.radius;
const active: boolean = props.active || false;
</script>

<template>
  <template v-if="active">
    <div
      class="before"
      :class="{
        holizontal: auraDef[type].anime === 'holizontal',
        verticalMini: auraDef[type].anime === 'verticalMini',
      }"
      v-bind:style="{
        borderRadius: radius,
        background: auraDef[type].background,
        border: auraDef[type].border,
      }"
    ></div>
    <div
      class="after"
      :class="{
        holizontal: auraDef[type].anime === 'holizontal',
        verticalMini: auraDef[type].anime === 'verticalMini',
      }"
      v-bind:style="{
        borderRadius: radius,
        background: auraDef[type].background,
        border: auraDef[type].border,
        zIndex: auraDef[type].zIndex || -10,
      }"
    ></div>
  </template>
</template>

<style scoped>
@keyframes anime {
  0% {
    transform: scale(0.95);
    opacity: 1;
  }
  90% {
    opacity: 0.3;
  }
  to {
    transform: scale(1.2);
    opacity: 0;
  }
}
@keyframes animeHolizontal {
  0% {
    transform: scale(0.95);
    opacity: 1;
  }
  90% {
    opacity: 0.3;
  }
  to {
    transform: scale(1.2, 1.8);
    opacity: 0;
  }
}
@keyframes animeVerticalMini {
  0% {
    transform: scale(0.95);
    opacity: 1;
  }
  90% {
    opacity: 0.3;
  }
  to {
    transform: scale(1.3, 1.1);
    opacity: 0;
  }
}
.before,
.after {
  position: absolute;
  z-index: -10;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  box-sizing: border-box;
  pointer-events: none;
}
.before {
  animation: anime 2s ease-out infinite;
}
.after {
  animation: anime 2s ease-out 1s infinite;
}
.before.holizontal {
  animation: animeHolizontal 2s ease-out infinite;
}
.after.holizontal {
  animation: animeHolizontal 2s ease-out 1s infinite;
}
.before.verticalMini {
  animation: animeVerticalMini 2s ease-out infinite;
}
.after.verticalMini {
  animation: animeVerticalMini 2s ease-out 1s infinite;
}
</style>
