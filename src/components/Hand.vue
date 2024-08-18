<script setup lang="ts">
import { Ref, ref } from 'vue';
import { CardID } from '../type/hand.d';
import { SizeDef } from '../type/hand-def.d';
import GameCard from './GameCard.vue';
import { handDefs } from '../def/hand';

const props = defineProps<{
  type: string;
  cardIDs: Array<CardID>;
  selectable: Array<boolean>;
  selected: Array<boolean>;
  exclusiveSelect?: boolean;
  active?: boolean;
}>();
const emit = defineEmits(['selectHand']);

const def = handDefs[props.type];

// const exclusiveSelect: boolean = props.exclusiveSelect || false;
const focused: Ref<boolean[]> = ref([]);
// const active: boolean = props.active || false;
const size: SizeDef = def.size;

const isSelectable = (idx: number): boolean => {
  if (!props.active) {
    return false;
  }
  return props.selectable && props.selectable[idx] ? true : false;
};

const showDetail = (idx: number): void => {
  focused.value = [];
  focused.value[idx] = true; // focus is always only one.
};

const hideDetail = (): void => {
  focused.value = [];
};

const unselectExcept = (idx: number): void => {
  props.selected.forEach((_s, i) => {
    if (i === idx) {
      return;
    }
    props.selected[i] = false;
  });
};

const selectHand = (idx: number): void => {
  if (!isSelectable(idx)) {
    return;
  }

  props.selected[idx] = !props.selected[idx];
  if (props.selected[idx]) {
    if (props.exclusiveSelect) {
      unselectExcept(idx);
    }
    emit('selectHand', idx);
  }
};
</script>

<template>
  <ul class="hand">
    <li
      class="aura"
      v-for="(c, idx) in props.cardIDs"
      :key="c.cid"
      v-bind:style="{
        width: size.width,
        borderRadius: size.radius,
        zIndex: idx,
      }"
      :class="{
        selectable: props.active && props.selectable[idx],
        selected: props.active && props.selected[idx],
        focued: props.cardIDs.length > 1 && focused[idx],
      }"
      @click="selectHand(idx)"
    >
      <GameCard
        :id="c.cid"
        :prioritizeMini="true"
        :selectable="props.active && props.selectable[idx]"
        :selected="props.active && props.selected[idx]"
        :detailPos="'center'"
        :meta="c.meta"
        @selectCard="selectHand(idx)"
        @showDetail="showDetail(idx)"
        @hideDetail="hideDetail()"
        ref="cardRef"
      >
      </GameCard>
    </li>
  </ul>
</template>

<style scoped lang="scss">
ul {
  padding: 0;
}
ul.hand {
  display: flex;
  justify-content: center;
}
li {
  list-style-type: none;
  margin-left: -10px;
  margin-right: -10px;
  transition: margin-left 0.5s;
  transition: margin-right 0.5s;
  border: 2px solid transparent;
}
.selectable {
  border: 2px solid #00e9eb;
  box-shadow: 0 0 5px 5px rgb(0 233 235 / 50%);
}
.selected {
  border: 2px solid #fffc00;
  box-shadow: 0 0 5px 5px rgb(255 252 0 / 50%);
}
.focued {
  margin-left: 30px;
  margin-right: 30px;
  transition: margin-left 0.5s;
  transition: margin-right 0.5s;
}

.aura {
  transition: 0.2s;
  position: relative;
}
</style>
