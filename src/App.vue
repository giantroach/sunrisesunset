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
import Hand from './components/Hand.vue';
import Grid from './components/Grid.vue';
import CtrlBar from './components/CtrlBar.vue';
import { objToArray } from './util/util';
import cardsetImgUrl from './assets/cardset.png';
import { defaultCtrlBarData } from './def/ctrlBar';
import { cardDefs } from './def/card';

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
});

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
  ctrlBarData
);

const restore = () => {
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
    handData.value.selectable?.push(true);
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
      if (cardDefs.mainCard.details?.[Number(cardType)]?.stealth) {
        return [{metaID: 'stealth'}];
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

  // restore score
  if (gamedata.value.score) {
    const score = gamedata.value.score;
    for (const pID in score) {
      if (pID === 'center') {
        scoreData.value.centerScore = objToArray(score[pID]);
      } else if (pID === String(playerID.value)) {
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
      } else if (Number(winner) === Number(playerID.value)) {
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

  state.refresh();
  sub = new Sub(
    playerID,
    gridData,
    handData,
    scoreData,
    reincarnationData,
    roundData
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
  ready,
});
</script>

<template>
  <link rel="preload" as="image" :href="urlBase + cardsetImgUrl" />

  <div>
    <div id="common_table" class="whiteblock">
      <div class="card-header">
        <h3 id="ontable_header">
          <span>{{ i18n('On Table') }}:</span>
        </h3>
        <div class="round-info">{{ i18n('Round') }}:{{ roundData.round }}</div>
      </div>

      <Grid ref="grid" type="table" :data="gridData" :active="gridData.active">
      </Grid>
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

    <div id="player_hand" class="whiteblock">
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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

.whiteblock {
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 10px;
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
    margin: 5px;
    color: #555;
    font-weight: bold;
  }
}
</style>
