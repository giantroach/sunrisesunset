<script setup lang="ts">
import { Ref, inject, ref } from 'vue';
import { Overlay, GridData } from '../type/grid.d';
import { SizeDef, MarginDef, GridDef } from '../type/grid-def.d';
import { throttle } from '../util/util';

import { gridDef } from '../def/grid';

import GameCard from './GameCard.vue';
import Aura from './Aura.vue';

const props = defineProps<{
  data: GridData;
  type: string;
  active?: boolean;
}>();

const emit = defineEmits(['selectGrid', 'selectCol']);

const i18n: Ref<any> = inject('i18n') || ref('');
const animation: Ref<any> = inject('animation') || ref('');

const data: Ref<GridData> = ref(props.data);
const def: GridDef = gridDef[props.type];

interface OverlayWithPos extends Overlay {
  top: string;
  left: string;
  width: null | string;
}

// const type!: Ref<string> = ref(props.type); // card type
let grid!: number[][];
const size: SizeDef = def.size;
const formatMarginRow = (margin: MarginDef): string => {
  const r = /^(\d+)(.+)/;
  const rm = r.exec(margin?.row) || [null, '0', ''];
  return `${Number(rm[1]) / 2}${rm[2]}`;
};
const marginRow: string = formatMarginRow(def.margin);
const formatMarginCol = (margin: MarginDef): string => {
  const r = /^(\d+)(.+)/;
  const cm = r.exec(margin?.column) || [null, '0', ''];
  return `${Number(cm[1]) / 2}${cm[2]}`;
};
const marginCol: string = formatMarginCol(def.margin);

const colRef = ref([]);

const parseLayoutStr = (layoutStr: string): number[][] => {
  const match = /(\d+)x(\d+)/g.exec(layoutStr);
  if (match === null) {
    throw 'invalid grid layout';
  }
  const x = Number(match[1]);
  const y = Number(match[2]);
  return new Array(x).fill(new Array(y).fill(null));
};

if (typeof def.layout === 'string') {
  grid = parseLayoutStr(def.layout);
} else {
  grid = def.layout;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let throttledSelectGrid: any = null;
const setSelectGrid = (): void => {
  // FIXME: this is triggered twice when you click
  throttledSelectGrid = throttle(
    (idx: number, x: number, y: number) => {
      if (!isSelectable(idx, x, y)) {
        return;
      }

      data.value.selected ||= [];

      if (!data.value.selected[idx]) {
        data.value.selected[idx] = [];
      }

      if (data.value.selected[idx][x] === void 0) {
        data.value.selected[idx][x] = [];
      }

      data.value.selected[idx][x][y] = !data.value.selected[idx][x][y];
      if (data.value.selected[idx][x][y]) {
        if (data.value.exclusiveSelect) {
          selectExcept(idx, x, y);
        }
        emit('selectGrid', { idx, x, y });
      }
    },
    100,
    this
  );
};
setSelectGrid();

const getAuraType = (x: number, y: number): string => {
  if (isSelected(0, x, y)) {
    return 'gridSelected';
  }

  if (isSelected(1, x, y)) {
    return 'gridSelected';
  }

  if (isSelectable(1, x, y)) {
    return 'gridSelectable2';
  }

  if (isSelectable(0, x, y)) {
    return 'gridSelectable1';
  }

  return '';
};

const isSelectable = (idx: number, x: number, y: number): boolean => {
  if (!props.active) {
    return false;
  }
  return data.value.selectable &&
    data.value.selectable[idx] &&
    data.value.selectable[idx][x] &&
    data.value.selectable[idx][x][y]
    ? true
    : false;
};

const getSelectableIdx = (x: number, y: number): number => {
  data.value.selectable ||= [];
  for (let i = data.value.selectable.length; i >= 0; i -= 1) {
    if (isSelectable(i, x, y)) {
      return i;
    }
  }
  return -1;
};

const isSelected = (idx: number, x: number, y: number): boolean => {
  if (!props.active) {
    return false;
  }
  const sel =
    data.value.selected &&
    data.value.selected[idx] &&
    data.value.selected[idx][x] &&
    data.value.selected[idx][x][y]
      ? true
      : false;
  return sel;
};

const isColSelectable = (x: number): boolean => {
  if (!props.active) {
    return false;
  }
  return data.value.selectableCol && data.value.selectableCol[x] ? true : false;
};

const isColSelected = (x: number): boolean => {
  if (!props.active) {
    return false;
  }
  return data.value.selectedCol && data.value.selectedCol[x] ? true : false;
};

const selectExcept = (idx: number, x: number, y: number): void => {
  data.value.selected ||= [];
  data.value.selected[idx].forEach((s, ix) => {
    if (!s) {
      return;
    }
    s.forEach((_t, iy) => {
      if (y === iy && x === ix) {
        return;
      }
      data.value.selected ||= [[[]]];
      data.value.selected[idx][ix][iy] = false;
    });
  });
};

const selectColExcept = (x: number): void => {
  data.value.selectedCol ||= [];
  data.value.selectedCol.forEach((s, i) => {
    if (!s) {
      return;
    }
    if (x === i) {
      return;
    }
    data.value.selectedCol ||= [];
    data.value.selectedCol[i] = false;
  });
};

const selectGrid = (idx: number, x: number, y: number): void => {
  throttledSelectGrid(idx, x, y);
};

const selectCol = (x: number): void => {
  if (!isColSelectable(x)) {
    return;
  }
  if (!data.value.selectedCol?.[x]) {
    data.value.selectedCol = [];
  }
  data.value.selectedCol[x] = !data.value.selectedCol[x];
  if (data.value.selectedCol[x]) {
    if (data.value.exclusiveSelect) {
      selectColExcept(x);
    }
    emit('selectCol', x);
  }
};

const getOverlayPos = (overlay: Overlay[]): OverlayWithPos[] => {
  return overlay.map((o) => {
    const pos = { top: '0px', left: '0px', width: '' };
    // col mode
    if (/^col\.\d\.\w+$/.test(o.pos)) {
      const m = /^col\.(\d+)\.(\w+)$/.exec(o.pos);
      if (m) {
        const i = Number(m[1]);
        const p = m[2];
        if (colRef.value[i]) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const colPos = (colRef.value[i] as any).getBoundingClientRect();
          if (p === 'bottom') {
            pos.top = colPos.bottom + 'px';
            pos.left = colPos.left + 'px';
            pos.width = colPos.width + 'px';
          }
        }
      }
    }
    return Object.assign(pos, o);
  });
};
</script>

<template>
  <ul class="grid">
    <li
      ref="colRef"
      v-for="(gridCol, idx) in grid"
      :key="idx"
      class="grid-col aura"
      :class="{
        selectable: isColSelectable(idx),
        selected: isColSelected(idx),
      }"
      v-bind:style="{
        width: size.width,
        borderRadius: size.radius,
        marginRight: idx === grid.length - 1 ? 0 : marginCol,
        marginLeft: idx === 0 ? 0 : marginCol,
      }"
      @click="selectCol(idx)"
    >
      <Aura
        :active="animation.value && isColSelectable(idx)"
        :type="isColSelected(idx) ? 'colSelected' : 'colSelectable'"
        :radius="size.radius"
      ></Aura>
      <ul>
        <li
          v-for="(gridCell, idy) in gridCol"
          :key="gridCell"
          class="grid-cell aura"
          :class="{
            selectable0: isSelectable(0, idx, idy),
            selected0: isSelected(0, idx, idy),
            selectable1: isSelectable(1, idx, idy),
            selected1: isSelected(1, idx, idy),
          }"
          v-bind:style="{
            width: size.width,
            height: size.height,
            borderRadius: size.radius,
            marginTop: idy === 0 ? 0 : marginRow,
            marginBottom: idy === gridCol.length - 1 ? 0 : marginRow,
          }"
          @click="selectGrid(getSelectableIdx(idx, idy), idx, idy)"
        >
          <template
            v-if="
              data.cellOverlay &&
              data.cellOverlay[idx] &&
              data.cellOverlay[idx][idy] &&
              data.cellOverlay[idx][idy].type === 'text'
            "
          >
            <div
              :class="
                'cellOverlay ' + data.cellOverlay[idx][idy].cssClass || ''
              "
            >
              {{ data.cellOverlay[idx][idy].data }}
            </div>
          </template>
          <Aura
            :active="
              animation.value &&
              (isSelectable(0, idx, idy) ||
                isSelectable(1, idx, idy) ||
                isSelected(0, idx, idy) ||
                isSelected(1, idx, idy))
            "
            :type="getAuraType(idx, idy)"
            :radius="size.radius"
          ></Aura>
          <template
            v-if="
              data.cardIDs &&
              data.cardIDs[idx] &&
              data.cardIDs?.[idx]?.[idy] !== undefined
            "
          >
            <GameCard
              :id="data.cardIDs?.[idx]?.[idy]?.cid"
              :prioritizeMini="true"
              :ghost="data.ghosts && data.ghosts[idx] && data.ghosts[idx][idy]"
              :detailPos="'right'"
              :selectable="
                isSelectable(0, idx, idy) || isSelectable(1, idx, idy)
              "
              :meta="data.cardIDs?.[idx]?.[idy]?.meta"
              @selectCard="selectGrid(getSelectableIdx(idx, idy), idx, idy)"
            ></GameCard>
          </template>
        </li>
      </ul>
    </li>
  </ul>

  <teleport to="body" v-if="data.overlay && data.overlay.length">
    <template v-for="(o, _i) in getOverlayPos(data.overlay)" :key="i">
      <div
        class="overlay"
        :class="o.cssClass || ''"
        v-bind:style="{
          top: o.top,
          left: o.left,
          width: o.width ?? 'initial',
        }"
      >
        {{ i18n(o.data) }}
      </div>
    </template>
  </teleport>
</template>

<style scoped lang="scss">
ul {
  padding: 0;
}
ul.grid {
  display: flex;
  justify-content: center;
}
li {
  list-style-type: none;
}
li.grid-cell {
  border: 3px solid rgba(0, 0, 0, 0.3);
  position: relative;
}
li.aura {
  transition: 0.2s;
  position: relative;
}
ul.grid {
  transform: scale(0.6);
  margin: -120px 0;
}
li.grid-cell.selectable0 {
  border: 3px solid #00e9eb;
  box-shadow: 0 0 5px 5px rgb(0 233 235 / 50%);
}
li.grid-cell.selected0 {
  border: 3px solid #fffc00;
  box-shadow: 0 0 5px 5px rgb(255 252 0 / 50%);
}
li.grid-cell.selectable1 {
  border: 3px solid #00eb7a;
  box-shadow: 0 0 5px 5px rgb(0 235 122 / 50%);
}
li.grid-cell.selected1 {
  border: 3px solid #fffc00;
  box-shadow: 0 0 5px 5px rgb(255 252 0 / 50%);
}
ul.grid > li.grid-col {
  border: 3px solid transparent;
}
ul.grid > li.grid-col.selectable {
  border: 3px solid #00e9eb;
  box-shadow: 0 0 5px 5px rgb(0 233 235 / 50%);
}
ul.grid > li.grid-col.selected {
  border: 3px solid #fffc00;
  box-shadow: 0 0 5px 5px rgb(255 252 0 / 50%);
}
.cellOverlay {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  text-align: center;
  flex: 1 1 auto;
  justify-content: center;
  position: absolute;
  width: 100%;
  z-index: 1;
}
.cellOverlay.largeCenter {
  color: white;
  font-size: 4em;
  font-weight: bolder;
  text-stroke: 2px #000;
  -webkit-text-stroke: 2px #000;
}

.overlay {
  pointer-events: none;
  position: absolute;
}
.overlay.largeCenter {
  text-align: center;
  color: white;
  font-size: 1.5em;
  font-weight: bolder;
  text-shadow: #666 1px 1px 1px, #666 -1px 1px 1px, #666 1px -1px 1px,
    #666 -1px -1px 1px;
  background: linear-gradient(to bottom, transparent, #e9e9e9, transparent);
}
.overlay.success {
  color: #00cd6a;
  text-shadow: #fff 1px 1px 1px, #fff -1px 1px 1px, #fff 1px -1px 1px,
    #fff -1px -1px 1px;
  background: linear-gradient(to bottom, transparent, #ceffe7, transparent);
}
.overlay.danger {
  color: #eb7a00;
  text-shadow: #fff 1px 1px 1px, #fff -1px 1px 1px, #fff 1px -1px 1px,
    #fff -1px -1px 1px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgb(251 235 213),
    transparent
  );
}
</style>
