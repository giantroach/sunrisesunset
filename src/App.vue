<script setup lang="ts">
import { watch, onMounted, provide, ref } from 'vue';
import type { Ref } from 'vue';
import CtrlBar from './components/CtrlBar.vue';

import { State, CurrentState } from './logic/state';
import { Sub } from './logic/sub';

import { Gamedata } from './type/gamedata.d';
import { BgaRequest, BgaNotification } from './type/bga-interface.d';
import { CtrlBarData } from './type/ctrlBar.d';
import { PlayerData } from './type/player.d';
import { objToArray } from './util/util';

import { defaultCtrlBarData } from './def/ctrlBar';

let bgaRequest: Ref<BgaRequest> = ref({
  name: '',
  args: {},
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bgaRequestPromise: Promise<any> = Promise.resolve();
const bgaNotifications: Ref<BgaNotification[]> = ref([]);
const bgaStates: Ref<CurrentState[]> = ref([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bgaNotifQueue: Promise<any> = Promise.resolve();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bgaStateQueue: Promise<any> = Promise.resolve();

let gamedata: Ref<Gamedata> = ref({
  current_player_id: '',
  decision: { decision_type: '' },
  gameMode: 'standard',
  game_result_neutralized: '',
  gamestate: null,
  gamestates: {},
  neutralized_player_id: '',
  notifications: { last_packet_id: '', move_nbr: '' },
  playerorder: [],
  players: {},
  tablespeed: '',
  mainBoard: {},
  workshop: {},
  quarry: {},
  ornament: {},
  playerSide: 'white',
});

let playerID = ref(-1);
let sub: null | Sub = null;

const ctrlBarData: Ref<CtrlBarData> = ref(structuredClone(defaultCtrlBarData));

const playerData: Ref<PlayerData> = ref({ playerSide: 'black' });

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
  playerData,
  ctrlBarData
);

const restore = () => {
  // restore all the data based on gamedata

  // player side
  playerData.value.playerSide = gamedata.value.playerSide;

  // restore board
  // const mb = boardData.value;
  // const mba = objToArray(gamedata.value.board);

  state.refresh();
  sub = new Sub();
};

const initBgaNotification = (): void => {
  // this is where magic happens
  watch(
    // @ts-ignore
    vue.bgaNotifications,
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

const submitState = () => {
  state?.submitState();
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
  ready,
});
</script>

<template>
  <div class="layout" v-if="ready">
    FIXME:
    <div class="center">
      <CtrlBar
        :type="ctrlBarData.type"
        @cancel="cancelState()"
        @submit="submitState()"
      >
      </CtrlBar>
    </div>
  </div>
  <div id="modals"></div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  align-items: center;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
