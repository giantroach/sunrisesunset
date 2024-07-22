<script setup lang="ts">
import { inject, ref } from 'vue';
import { watch } from 'vue';
import Modal from './Modal.vue';
import { SizeDef, MiniDef, TextLayoutDef } from '../type/card-def.d';
import { CardMeta } from '../type/card.d';
import { cardMetaDefs } from '../def/card';
import type { Ref } from 'vue';
import { cardDefs } from '../def/card';

export interface Size {
  // xRatio: number;
  // yRatio: number;
  width: string;
  height: string;
}

const props = defineProps<{
  id?: string;
  prioritizeMini: boolean;
  selectable: boolean; // for card detail modal
  selected?: boolean; // for card detail modal
  ghost?: boolean;
  detailPos: 'center' | 'right';
  meta?: CardMeta[];
}>();

const emit = defineEmits(['selectCard', 'showDetail', 'hideDetail']);

const image: Ref<string> = ref('');
let size!: SizeDef;
let textDef!: TextLayoutDef;
let text!: string;
let prioritizeMini: Ref<boolean> = ref(props.prioritizeMini);
let miniDef!: MiniDef | null;
const selected: Ref<boolean> = ref(props.selected || false);
const selectable: Ref<boolean> = ref(props.selectable);
const ghost: Ref<boolean> = ref(props.ghost);
const detailPos: Ref<'center' | 'right'> = ref(props.detailPos);
const meta: Ref<CardMeta[]> = ref(props.meta || []);

const modal: Ref<boolean> = ref(false);
const modalTop: Ref<number> = ref(-10000);
const modalLeft: Ref<number> = ref(-10000);

const id: Ref<string> = ref(props.id || '');
const urlBase: Ref<string> = inject('urlBase') || ref('');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const i18n: Ref<any> = inject('i18n') || ref('');
const bgPos: Ref<string> = ref('0 0');
const bgPosMini: Ref<string> = ref('0 0');
const onlyMini: Ref<boolean> = ref(false);
let minModalTop = 0;

// tweaks related to show details
let disableShowDetailsUntilMouseOut = false;
let lastTimeHideDetails = 0;

const getBgPos = (sprite: string, size: SizeDef, idx: number): string => {
  const sm = /^(\d+)x(\d+)/g.exec(sprite);
  const wm = /^([\d.]+)(.*)/g.exec(size.width);
  const hm = /^([\d.]+)(.*)/g.exec(size.height);
  if (!sm || !wm || !hm) {
    return '0 0';
  }
  const colNum = Number(sm[1]);
  const y = Math.floor(idx / colNum);
  const x = idx % colNum;
  return `-${x * Number(wm[1])}${wm[2]} -${y * Number(hm[1])}${hm[2]}`;
};

const updateDef = () => {
  const ids = /([^\d]+)(\d+)/.exec(props.id || '');
  if (!ids) {
    return;
  }

  const cat = ids[1];
  const idx = Number(ids[2]);
  const def = cardDefs[cat];
  if (!def) {
    throw 'no card definition found: ' + props.id;
  }
  text = def.details?.[idx]?.text || '';
  image.value = def.image;
  size = def.size;
  textDef = def.textDef || {
    offsetY: '0',
    paddingSide: '0',
    paddingBottom: '0',
  };
  miniDef = def.miniDef || null;
  bgPos.value = getBgPos(def.sprite, def.size, idx);
  if (!def.miniDef) {
    return;
  }
  bgPosMini.value = getBgPos(def.miniDef.sprite, def.miniDef.size, idx);
  onlyMini.value = def.details?.[idx]?.onlyMini || false;
  minModalTop = def.minModalTop || 0;
};
updateDef();

watch(
  () => props.id,
  () => {
    updateDef();
  }
);
// };

const showDetails = (evt: MouseEvent | TouchEvent) => {
  if (onlyMini.value) {
    return;
  }
  if (disableShowDetailsUntilMouseOut) {
    return;
  }
  if (lastTimeHideDetails && Number(new Date()) - lastTimeHideDetails < 10) {
    disableShowDetailsUntilMouseOut = true;
    return;
  }

  const elm = evt.srcElement as HTMLElement;
  const rect = elm.getBoundingClientRect();

  // find center coordinate
  const centerY = rect.top + rect.height / 2;
  let centerX = 0;
  if (detailPos.value === 'right') {
    // *2 because it is center
    centerX = rect.right + window.scrollX + rect.width * 2;
  } else {
    centerX = rect.left + window.scrollX + rect.width / 2;
  }
  modal.value = true;

  setTimeout(() => {
    // wait for render
    const mcElm = document.querySelector('#card-modal-' + props.id);
    const body = document.body;
    if (!mcElm) {
      return;
    }
    const mcRect = mcElm.getBoundingClientRect();
    let mcTop = centerY - mcRect.height / 2;
    let mcLeft = centerX - mcRect.width / 2;
    const bdRect = body.getBoundingClientRect();
    if (mcTop + mcRect.height > bdRect.height) {
      mcTop = bdRect.height - mcRect.height;
    }
    // bdRect.height depends on all the items below
    const maxTop = window.innerHeight - mcRect.height;
    if (mcTop > maxTop) {
      mcTop = maxTop;
    }
    if (mcLeft + mcRect.width > bdRect.width) {
      mcLeft = bdRect.width - mcRect.width;
    }
    modalTop.value = mcTop > minModalTop ? mcTop : minModalTop;
    modalLeft.value = mcLeft > 0 ? mcLeft : 0;

    emit('showDetail', props.id);
  });
};

const selectCard = (): void => {
  hideDetails();
  lastTimeHideDetails = Number(new Date());
  if (!props.selectable) {
    return;
  }
  emit('selectCard', props.id);
};

const mouseOutFromMini = () => {
  if (detailPos.value === 'right') {
    hideDetails();
  }
  disableShowDetailsUntilMouseOut = false;
};

const mouseOutFromDetail = () => {
  if (detailPos.value === 'right') {
    return; // ignore
  }
  hideDetails();
};

const hideDetails = () => {
  modal.value = false;
  emit('hideDetail', props.id);
};
</script>

<template>
  <div class="container">
    <template v-if="!prioritizeMini || !miniDef">
      <div
        :id="'card-' + id"
        class="card"
        v-bind:style="{
          width: size.width,
          height: size.height,
          backgroundImage: 'url(' + urlBase + image + ')',
          borderRadius: size.radius,
          backgroundPosition: bgPos,
        }"
        @click="selectCard"
      >
        <div v-if="text" class="container-text">
          <div
            class="text"
            v-if="text"
            v-bind:style="{
              top: textDef.offsetY,
              borderWidth: `0 ${textDef.paddingSide || 0} ${
                textDef.paddingBottom || 0
              }`,
            }"
          >
            {{ i18n(text) }}
          </div>
        </div>
      </div>
    </template>

    <template v-if="miniDef && prioritizeMini">
      <div
        :id="'card-mini-' + id"
        class="card card-mini"
        :class="{
          ghost: ghost,
        }"
        v-bind:style="{
          width: miniDef.size.width,
          height: miniDef.size.height,
          backgroundImage: 'url(' + urlBase + miniDef.image + ')',
          borderRadius: miniDef.size.radius,
          backgroundPosition: bgPosMini,
        }"
        @click="[showDetails($event), selectCard()]"
        @mouseenter="showDetails"
        @mouseout="mouseOutFromMini"
        @touchstart.passive="showDetails"
      >
        <div
          class="detail-meta-mini"
          v-if="meta && meta.length"
          v-bind:style="{}"
        >
          ⚠️
        </div>
      </div>
    </template>
  </div>

  <teleport to="#modals" v-if="modal">
    <div
      :id="'card-modal-' + id"
      class="card card-modal"
      :class="{
        selectable: !selected && selectable,
        selected: selected,
      }"
      v-bind:style="{
        width: size.width,
        height: size.height,
        top: modalTop + 'px',
        left: modalLeft + 'px',
        backgroundImage: 'url(' + urlBase + image + ')',
        borderRadius: size.radius,
        backgroundPosition: bgPos,
      }"
      @click="selectCard"
      v-on:mouseout="mouseOutFromDetail"
    >
      <div v-if="text" class="container-text">
        <div
          class="text"
          v-if="text"
          v-bind:style="{
            top: textDef.offsetY,
            borderWidth: `0 ${textDef.paddingSide || 0} ${
              textDef.paddingBottom || 0
            }`,
          }"
        >
          {{ i18n(text) }}
        </div>
      </div>
    </div>

    <ul
      class="detail-meta-modal"
      v-if="meta && meta.length"
      v-bind:style="{
        width: 100,
        height: size.height,
        top: modalTop + 'px',
        left: modalLeft + parseInt(size.width, 10) + 10 + 'px',
        borderRadius: size.radius,
      }"
    >
      <li v-for="(m, idx) in meta" :key="idx">
        <div v-if="m.metaID" class="meta-text">
          {{ i18n(cardMetaDefs?.[m.metaID]?.text || '') }}
        </div>
      </li>
    </ul>

    <Modal
      v-if="detailPos === 'center'"
      @hide-modal="mouseOutFromDetail"
      :backdrop="false"
    ></Modal>
  </teleport>
</template>

<style scoped lang="scss">
.container {
  position: relative;
}
.card {
  position: relative;
  box-shadow: 0 5px 5px 5px rgb(0 0 0 / 30%);
}
.card-modal,
.detail-meta-modal {
  position: fixed;
  z-index: 1000;
  animation: fadein 0.4s ease-out forwards;
}
@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.container-text,
.text {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 0px solid transparent;
  overflow-y: auto;
  text-align: left;
  font-size: small;
}
.title {
  position: absolute;
}
.selectable {
  border: 3px solid #00e9eb;
  box-shadow: 0 0 5px 2px #05fdff;
}
.selected {
  border: 3px solid #fffc00;
  box-shadow: 0 0 5px 2px #ffb644;
}
.ghost {
  opacity: 0.67;
}
.detail-meta-mini {
  border-radius: 5px;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.4);
  bottom: 0;
  right: 0;
  border: 1px solid white;
  padding: 2px;
  font-size: x-large;
  pointer-events: none;
}
ul.detail-meta-modal {
  list-style-type: none;
  padding: 0;
  margin: 0;

  > li > div {
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 5px;
    width: 100px;
    text-align: left;
    margin-bottom: 5px;
    padding: 5px;
  }
}
</style>
