<script setup lang="ts">
import { onMounted, provide, ref, inject } from 'vue';
import { Ref } from 'vue';
import { watch } from 'vue';
import { Gamedata } from './type/gamedata.d';
import { BgaRequest, BgaNotification } from './type/bga-interface.d';
import { GridData } from './type/grid.d';
import { HandData } from './type/hand.d';
import { ScoreData } from './type/score.d';
import { ReincarnationData } from './type/reincarnation.d';
import { RoundData } from './type/round.d';
import { CtrlBarData } from './type/ctrl-bar.d';
import { CardMeta } from './type/card.d';
import { State, CurrentState } from './logic/state';
import { Sub } from './logic/sub';
import Hand from './components/hand.vue';
import Grid from './components/grid.vue';
import CtrlBar from './components/ctrl-bar.vue';
import { objToArray } from './util/util';
import cardsetImgUrl from './assets/cardset.png';
import { defaultCtrlBarData } from './def/ctrl-bar';
import { cardDefs } from './def/card';
import { LayoutGrid, Trash2 } from 'lucide-vue-next';

let bgaRequest: Ref<BgaRequest> = ref({
  name: '',
  args: {},
});

const i18n: Ref<any> = inject('i18n') || ref('');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bgaRequestPromise: Promise<any> = Promise.resolve();
const bgaNotifications: Ref<BgaNotification[]> = ref([]);
const bgaStates: Ref<CurrentState[]> = ref([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bgaNotifQueue: Promise<any> = Promise.resolve();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bgaStateQueue: Promise<any> = Promise.resolve();

const gridData: Ref<GridData> = ref({
  cardIDs: [],
  ghosts: [],
  selectable: [],
  selected: [],
  highlighted: [],
  selectableCol: [],
  selectedCol: [],
  exclusiveSelect: true,
  overlay: [],
  cellOverlay: [],
  active: false,
});

const gridDataDiscard: Ref<GridData> = ref({
  cardIDs: [],
  ghosts: [],
  selectable: [],
  selected: [],
  highlighted: [],
  selectableCol: [],
  selectedCol: [],
  exclusiveSelect: true,
  overlay: [],
  cellOverlay: [],
  active: false,
});

const handData: Ref<HandData> = ref({
  cardIDs: [],
  selectable: [],
  selected: [],
  active: false,
});

const scoreData: Ref<ScoreData> = ref({
  centerScore: [],
  oppoScore: [],
  myScore: [],
  result: [],
});

const reincarnationData: Ref<ReincarnationData> = ref({
  reincarnatedCardID: null,
});

const roundData: Ref<RoundData> = ref({
  round: 0,
  side: 'Day',
});

const ctrlBarData: Ref<CtrlBarData> = ref(structuredClone(defaultCtrlBarData));

const gamedata: Ref<Gamedata> = ref({
  current_player_id: '',
  decision: { decision_type: '' },
  game_result_neutralized: '',
  gamestate: null,
  gamestates: {},
  neutralized_player_id: '',
  notifications: { last_packet_id: '', move_nbr: '' },
  player_cards: [],
  playerorder: [],
  players: {},
  player_table: [],
  oppo_table: [],
  discarded: [],
  tablespeed: '',
  day_or_night: 'day',
  round: '0',
  center: {
    left: {
      controller: '',
    },
    center: {
      controller: '',
    },
    right: {
      controller: '',
    },
  },
  reincarnated_card_id: null,
  is_observer: false,
  player_sides: {
    day: '',
    night: '',
  },
});

const tab: Ref<string> = ref('table');

let playerID = ref(-1);
let sub: null | Sub = null;

// const ctrlBarData: Ref<CtrlBarData> = ref(structuredClone(defaultCtrlBarData));

const urlBase = ref('');
provide('urlBase', urlBase);

const ready: Ref<boolean> = ref(false);

onMounted(() => {
  // this must be done after the mount
  setTimeout(() => {
    initBgaNotification();
    initBgaState();
  });

  const unwatch = watch(gamedata, () => {
    unwatch();
    ready.value = true;
    setTimeout(() => {
      restore();
    }, 100);
  });
});

const request = (name: string, args: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    // this is where magic happens
    // @ts-ignore
    window.vue.bgaRequest = {
      name: name,
      args: args,
    };
    setTimeout(() => {
      bgaRequestPromise
        .then((reply) => {
          resolve(reply);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

const state: State = new State(
  request,
  gridData,
  handData,
  scoreData,
  reincarnationData,
  ctrlBarData,
  true
);

const restore = () => {
  const isObserver = gamedata.value.is_observer;
  const playerSides = gamedata.value.player_sides;

  state.observer = isObserver;

  // restore all the data based on gamedata
  handData.value.cardIDs = [];
  handData.value.selectable = [];
  gamedata.value.player_cards.forEach((c) => {
    handData.value.cardIDs?.push({
      id: c.id,
      cid: `mainCard${c.type_arg}`,
      meta: !c.meta
        ? []
        : c.meta.split(',').map((m) => {
            return {
              metaID: m,
            };
          }),
    });
    handData.value.selectable?.push(false);
  });

  // init grid data
  if (gamedata.value.day_or_night === 'night') {
    gridData.value.cardIDs = [
      [undefined, undefined, { cid: 'centerCard3', meta: [] }],
      [undefined, undefined, { cid: 'centerCard4', meta: [] }],
      [undefined, undefined, { cid: 'centerCard5', meta: [] }],
    ];
  } else {
    gridData.value.cardIDs = [
      [undefined, undefined, { cid: 'centerCard0', meta: [] }],
      [undefined, undefined, { cid: 'centerCard1', meta: [] }],
      [undefined, undefined, { cid: 'centerCard2', meta: [] }],
    ];
  }

  const getMeta = (meta: string | undefined, cardType: string): CardMeta[] => {
    if (!meta) {
      if (
        !isObserver &&
        cardDefs.mainCard.details?.[Number(cardType)]?.stealth
      ) {
        return [{ metaID: 'stealth' }];
      }
      return [];
    }

    return meta.split(',').map((m) => {
      return {
        metaID: m,
      };
    });
  };

  gamedata.value.player_table.forEach((c) => {
    const gridID = Number(c.location_arg);
    const row = Math.floor(gridID / 3) + 3;
    const col = gridID % 3;
    if (!gridData.value.cardIDs) {
      throw 'invalid state';
    }
    gridData.value.cardIDs[col][row] = {
      id: c.id,
      cid: `mainCard${c.type_arg}`,
      meta: getMeta(c.meta, c.type_arg),
    };
  });
  gamedata.value.oppo_table.forEach((c) => {
    const gridID = Number(c.location_arg);
    const row = 1 - Math.floor(gridID / 3);
    const col = gridID % 3;
    if (!gridData.value.cardIDs) {
      throw 'invalid state';
    }
    gridData.value.cardIDs[col][row] = {
      id: c.id,
      cid: `mainCard${c.type_arg}`,
      meta: !c.meta
        ? []
        : c.meta.split(',').map((m) => {
            return {
              metaID: m,
            };
          }),
    };
  });

  gamedata.value.discarded.forEach((c) => {
    if (!gridDataDiscard.value.cardIDs?.length) {
      gridDataDiscard.value.cardIDs = [];
    }
    gridDataDiscard.value.cardIDs?.push([
      {
        id: c.id,
        cid: `mainCard${c.type_arg}`,
        meta: [],
      },
    ]);
  });

  const isMySide = (pID: string) => {
    const myPID = String(playerID.value);
    if (!isObserver && pID === myPID) {
      return true;
    }

    // observer is treated as sun player
    if (isObserver && String(playerSides['day']) === pID) {
      return true;
    }

    return false;
  };

  // restore score
  if (gamedata.value.score) {
    const score = gamedata.value.score;
    for (const pID in score) {
      if (pID === 'center') {
        scoreData.value.centerScore = objToArray(score[pID]);
      } else if (isMySide(String(pID))) {
        scoreData.value.myScore = objToArray(score[pID]);
      } else {
        scoreData.value.oppoScore = objToArray(score[pID]);
      }
    }
  }
  if (gamedata.value.winner) {
    gamedata.value.winner.forEach((winner, idx: number) => {
      if (!scoreData.value.result) {
        scoreData.value.result = [];
      }
      if (Number(winner) === 0) {
        scoreData.value.result[idx] = 'tie';
      } else if (isMySide(String(winner))) {
        scoreData.value.result[idx] = 'win';
      } else {
        scoreData.value.result[idx] = 'lose';
      }
    });
  }

  roundData.value = {
    round: Number(gamedata.value.round),
    side: gamedata.value.day_or_night === 'day' ? 'Day' : 'Night',
  };

  reincarnationData.value.reincarnatedCardID =
    gamedata.value.reincarnated_card_id || null;

  reincarnationData.value.reincarnatedCol =
    gamedata.value.reincarnated_col != null
      ? Number(gamedata.value.reincarnated_col)
      : null;

  if (state.hasMainState(['mulligan', 'playerTurn', 'reincarnationTurn'])) {
    state.setSubState('init');
  } else {
    state.refresh();
  }
  sub = new Sub(
    playerID,
    gridData,
    gridDataDiscard,
    handData,
    scoreData,
    reincarnationData,
    roundData,
    gamedata.value.is_observer
  );

  // update center controller
  const dayOrNight = gamedata.value.day_or_night;
  const center = gamedata.value.center;
  gridData.value.cardIDs[0][2] = {
    cid:
      'centerCard' +
      sub.getCenterIdx('left', dayOrNight, center.left.controller),
    meta: [],
  };
  gridData.value.cardIDs[1][2] = {
    cid:
      'centerCard' +
      sub.getCenterIdx('center', dayOrNight, center.center.controller),
    meta: [],
  };
  gridData.value.cardIDs[2][2] = {
    cid:
      'centerCard' +
      sub.getCenterIdx('right', dayOrNight, center.right.controller),
    meta: [],
  };
};

const initBgaNotification = (): void => {
  // this is where magic happens
  watch(
    // @ts-ignore
    window.vue.bgaNotifications,
    (notifs: BgaNotification[]) => {
      // TODO: make this suspendable
      const notif = notifs.shift();
      if (!notif) {
        return;
      }

      bgaNotifQueue = bgaNotifQueue.then(() => {
        return new Promise<void>((resolve) => {
          switch (notif.name) {
            case 'score':
              sub?.handle(notif);
              resolve();
              break;
            default:
              sub?.handle(notif);
              setTimeout(() => {
                // secure the least time gap
                resolve();
              }, 1000);
              break;
          }
        });
      });
    },
    { immediate: true }
  );
};

const initBgaState = (): void => {
  watch(
    // @ts-ignore
    vue.bgaStates,
    (states: CurrentState[]) => {
      const s = states.shift();
      if (!s) {
        return;
      }
      bgaStateQueue = bgaStateQueue.then(() => {
        return new Promise<void>((resolve) => {
          switch (s) {
            default:
              state?.setState(s);
              setTimeout(() => {
                // secure the least time gap
                resolve();
              }, 1000);
              break;
          }
        });
      });
    },
    { immediate: true }
  );
};

const cancelState = () => {
  state?.cancelState();
};

const submitState = (mode?: string) => {
  state?.submitState(mode);
};

const selectTab = (dst: string) => {
  tab.value = dst;
};

defineExpose({
  playerID,
  bgaStates,
  bgaNotifications,
  bgaRequest,
  bgaRequestPromise,
  urlBase,
  gamedata,
  state,
  // init method
  restore,
  // game data
  ctrlBarData,
  handData,
  gridData,
  roundData,
  scoreData,
  reincarnationData,
  ready,
});
</script>

<template>
  <link rel="preload" as="image" :href="urlBase + cardsetImgUrl" />

  <div id="app-root">
    <div
      id="common_table"
      class="board"
      :class="{
        day: roundData.round % 2 !== 0,
        night: roundData.round % 2 === 0,
      }"
    >
      <div class="card-header">
        <ul class="tabs">
          <li
            @click="selectTab('table')"
            :class="{
              selected: tab === 'table',
            }"
          >
            <h3 id="ontable_header">
              <LayoutGrid :size="16" />
              <span>{{ i18n('On Table') }}</span>
            </h3>
          </li>
          <li
            @click="selectTab('discard')"
            :class="{
              selected: tab === 'discard',
            }"
          >
            <h3 id="discard_header">
              <Trash2 :size="16" />
              <span>{{ i18n('Discarded') }}</span>
            </h3>
          </li>
        </ul>
        <div class="round-info">{{ i18n('Round') }}:{{ roundData.round }}</div>
      </div>

      <div
        v-bind:style="{
          display: tab === 'table' ? '' : 'none',
        }"
      >
        <Grid
          ref="grid"
          type="table"
          :data="gridData"
          :active="gridData.active"
          :round="roundData.round"
        >
        </Grid>
      </div>

      <div
        v-bind:style="{
          display: tab === 'discard' ? '' : 'none',
        }"
      >
        <Grid
          ref="grid2"
          type="discard"
          :data="gridDataDiscard"
          :active="false"
          :round="roundData.round"
        >
        </Grid>
      </div>
    </div>

    <div id="ctrl_buttons">
      <CtrlBar
        :type="ctrlBarData.type"
        @cancel="cancelState()"
        @submit="submitState()"
        @mulligan="submitState('submit')"
        @noMulligan="submitState()"
        @confirm="submitState()"
      >
      </CtrlBar>
    </div>

    <div id="player_hand" v-if="!gamedata.is_observer">
      <div class="card-header">
        <h3 id="inhand_header">
          <span>{{ i18n('Your Hand') }}:</span>
        </h3>
      </div>

      <Hand
        ref="hand"
        type="card"
        :cardIDs="handData.cardIDs"
        :selectable="handData.selectable || []"
        :selected="handData.selected || []"
        :exclusiveSelect="true"
        :active="handData.active"
      >
      </Hand>
    </div>
  </div>
  <div id="modals"></div>
</template>

<style scoped>
#preload {
  position: fixed;
  top: -10000px;
  left: -10000px;
}
#app-root {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
}
#player_hand > h3,
#common_table > h3 {
  text-align: left;
}
#ctrl_buttons {
  height: 72px;
  display: flex;
  justify-content: center;
}
#ctrl_buttons > * {
  margin: 0;
}

.whiteblock,
.board,
#player_hand {
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 10px;
  transition:
    background-color 1s linear,
    color 1s linear;
}

#player_hand,
.board.day {
  background-color: rgba(255, 255, 255, 0.7);
  .card-header {
    color: #222;
  }
}

.board.night {
  background-color: rgba(0, 0, 0, 0.3);
  .card-header {
    color: #eee;
  }
}

.card-header {
  display: flex;

  > h3 {
    flex: 1 1 auto;
    text-align: left;
    margin: 0;
  }

  > .round-info {
    flex: 1 1 auto;
    text-align: right;
    padding: 5px;
    font-weight: bold;
  }
}

.tabs {
  display: flex
  ;
  list-style: none;
  margin: 0;
  padding: 0;
}
.tabs > li {
  border: 1px solid transparent;
  padding: 5px 10px;
  border-radius: 5px 5px 0 0;
  cursor: pointer;
}
.tabs h3 {
  margin: 0;
}
.tabs h3 svg {
  margin-right: 5px;
}
.card-header .round-info,
.card-header li:not(.selected) {
  border-bottom: 1px solid #aaa;
}
.card-header li.selected {
  border: 1px solid #aaa;
  border-bottom: 1px transparent;
}
 .day .card-header li:not(.selected) {
   color: #888;
 }
 .night .card-header li:not(.selected) {
   color: #ccc;
 }
</style>
