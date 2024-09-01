import type { Ref } from 'vue';
import {
  BgaNotification,
  BgaNewRoundNotif,
  BgaPlayCardNotif,
  BgaMoveCardNotif,
  BgaUpdateCardNotif,
  BgaMulliganNotif,
  BgaReincarnateCardNotif,
  BgaScoreNotif,
  BgaEndRoundNotif,
} from '../type/bga-interface.d';
import { objToArray } from '../util/util';

import { GridData } from '../type/grid.d';
import { HandData } from '../type/hand.d';
import { ScoreData, ScoreResult } from '../type/score.d';
import { ReincarnationData } from '../type/reincarnation.d';
import { RoundData } from '../type/round.d';
import { cardDefs } from '../def/card';

//
// Sub handles BGA notifications and apply data accordingly.
//

export class Sub {
  constructor(
    public playerID: Ref<Number>, // public for testing purpose
    private gridData: Ref<GridData>,
    private handData: Ref<HandData>,
    private scoreData: Ref<ScoreData>,
    private reincarnationData: Ref<ReincarnationData>,
    private roundData: Ref<RoundData>,
    private observer: boolean
  ) {}

  public handle(notif: BgaNotification) {
    switch (notif.name) {
      case 'newRound': {
        const arg = notif.args as BgaNewRoundNotif;
        const cards = arg.player_cards;
        const center = arg.center;
        const dayOrNight = arg.day_or_night;
        const roundNum = Number(arg.round);

        // reset score
        this.scoreData.value.centerScore = [];
        this.scoreData.value.myScore = [];
        this.scoreData.value.oppoScore = [];
        this.gridData.value.overlay = [];
        this.gridData.value.cellOverlay = [];

        // update table
        if (!this.gridData || !this.gridData.value.cardIDs) {
          break;
        }
        this.gridData.value.cardIDs = [[], [], []];
        this.gridData.value.cardIDs[0][2] = {
          cid:
            'centerCard' +
            this.getCenterIdx('left', dayOrNight, center.left.controller),
          meta: [],
        };
        this.gridData.value.cardIDs[1][2] = {
          cid:
            'centerCard' +
            this.getCenterIdx('center', dayOrNight, center.center.controller),
          meta: [],
        };
        this.gridData.value.cardIDs[2][2] = {
          cid:
            'centerCard' +
            this.getCenterIdx('right', dayOrNight, center.right.controller),
          meta: [],
        };

        // update hand
        cards.forEach((c) => {
          this.handData.value.cardIDs?.push({
            id: c.id,
            cid: `mainCard${c.type_arg}`,
            meta: !c.meta
              ? []
              : c.meta.split(',').map((m: string) => {
                  return {
                    metaID: m,
                  };
                }),
          });
        });

        // update round
        this.roundData.value.round = roundNum;
        this.roundData.value.side = dayOrNight === 'day' ? 'Day' : 'Night';
        break;
      }

      case 'playCard': {
        const arg = notif.args as BgaPlayCardNotif;
        const gridID = Number(arg.gridID);
        const ignoreActivePlayer = arg.ignoreActivePlayer || false;
        const playerSide = arg.playerSide;
        if (
          ignoreActivePlayer &&
          Number(arg.player_id) === Number(this.playerID.value)
        ) {
          return;
        }
        if (
          (this.observer && playerSide === 'day') ||
          Number(arg.player_id) === Number(this.playerID.value)
        ) {
          this.handData.value.cardIDs = this.handData.value.cardIDs?.filter(
            (ids) => {
              return ids.id !== arg.card.id;
            }
          );
          const row = Math.floor(gridID / 3) + 3;
          const col = gridID % 3;
          if (this.gridData.value.cardIDs) {
            const cid = arg.card.type_arg;
            const hasStealth =
              cardDefs.mainCard.details?.[Number(cid)]?.stealth;
            this.gridData.value.cardIDs[col][row] = {
              cid: `mainCard${arg.card.type_arg}`,
              meta: hasStealth && !this.observer ? [{ metaID: 'stealth' }] : [],
            };
          }
          if (this.gridData.value.ghosts?.[col]?.[row]) {
            this.gridData.value.ghosts[col][row] = false;
          }
        } else {
          const row = 1 - Math.floor(gridID / 3);
          const col = gridID % 3;
          if (this.gridData.value.cardIDs) {
            this.gridData.value.cardIDs[col][row] = {
              cid: `mainCard${arg.card.type_arg}`,
              meta: [],
            };
          }
        }
        break;
      }

      case 'updateCard': {
        // i.e. oracle or watcher
        const arg = notif.args as BgaUpdateCardNotif;
        const gridID = Number(arg.gridID);
        const c = arg.card;
        const playerSide = arg.playerSide;
        let row = 0;
        let col = 0;

        if (
          (this.observer && playerSide === 'day') ||
          Number(arg.player_id) === Number(this.playerID.value)
        ) {
          row = Math.floor(gridID / 3) + 3;
          col = gridID % 3;
        } else {
          row = 1 - Math.floor(gridID / 3);
          col = gridID % 3;
        }

        if (this.gridData.value.cardIDs) {
          this.gridData.value.cardIDs[col][row] = {
            id: c.id,
            cid: `mainCard${arg.card.type_arg}`,
            meta: !c.meta
              ? []
              : c.meta.split(',').map((m: string) => {
                  return {
                    metaID: m,
                  };
                }),
          };
        }
        break;
      }

      case 'moveCard': {
        // i.e. maze
        const arg = notif.args as BgaMoveCardNotif;
        const fromGridID = Number(arg.fromGridID);
        const toGridID = Number(arg.toGridID);
        let fromRow = 0;
        let fromCol = 0;
        let toRow = 0;
        let toCol = 0;

        if (
          Number(arg.player_id) === Number(this.playerID.value) ||
          this.observer
        ) {
          fromRow = Math.floor(fromGridID / 3) + 3;
          fromCol = fromGridID % 3;
          toRow = Math.floor(toGridID / 3) + 3;
          toCol = toGridID % 3;
        } else {
          fromRow = 1 - Math.floor(fromGridID / 3);
          fromCol = fromGridID % 3;
          toRow = 1 - Math.floor(toGridID / 3);
          toCol = toGridID % 3;
        }

        if (this.gridData.value.cardIDs) {
          // if same id exists, remove it
          const c = this.gridData.value.cardIDs[fromCol][fromRow];
          this.gridData.value.cardIDs[fromCol][fromRow] = undefined;
          this.gridData.value.cardIDs[toCol][toRow] = c;
        }
        break;
      }

      case 'mulligan': {
        // i.e. mulligan
        const arg = notif.args as BgaMulliganNotif;
        const c = arg.card;
        const discardedCardID = arg.discardedCardID;

        if (discardedCardID) {
          this.handData.value.cardIDs = this.handData.value.cardIDs?.filter(
            (ids) => {
              return ids.id !== discardedCardID;
            }
          );
        }

        if (c) {
          this.handData.value.cardIDs?.push({
            id: c.id,
            cid: `mainCard${c.type_arg}`,
            meta: !c.meta
              ? []
              : c.meta.split(',').map((m: string) => {
                  return {
                    metaID: m,
                  };
                }),
          });
        }
        break;
      }

      case 'reincarnateCard': {
        // i.e. reincarnation
        const arg = notif.args as BgaReincarnateCardNotif;
        const gridID = Number(arg.gridID);
        const playerID = Number(arg.player_id);
        const c = arg.card;
        const reincarnatedCol = arg.col;
        let row = 0;
        let col = 0;

        if (playerID === Number(this.playerID.value)) {
          row = Math.floor(gridID / 3) + 3;
          col = gridID % 3;
        } else {
          row = 1 - Math.floor(gridID / 3);
          col = gridID % 3;
        }

        if (this.gridData.value.cardIDs) {
          this.gridData.value.cardIDs[col][row] = undefined;
        }

        if (playerID === Number(this.playerID.value) && c) {
          this.handData.value.cardIDs?.push({
            id: c.id,
            cid: `mainCard${c.type_arg}`,
            meta: !c.meta
              ? []
              : c.meta.split(',').map((m: string) => {
                  return {
                    metaID: m,
                  };
                }),
          });
        }

        this.reincarnationData.value.reincarnatedCardID = c?.id || null;
        this.reincarnationData.value.reincarnatedCol =
          reincarnatedCol != null ? Number(reincarnatedCol) : null;

        break;
      }

      case 'score': {
        const arg = notif.args as BgaScoreNotif;
        const wPlayerID = arg.w_player_id;
        const lane = arg.lane;
        if (!this.gridData || !wPlayerID || !lane) {
          break;
        }
        let result: ScoreResult = 'tie';
        if (Number(wPlayerID) === Number(this.playerID.value)) {
          result = 'win';
        }
        if (
          wPlayerID !== 'tie' &&
          Number(wPlayerID) !== Number(this.playerID.value)
        ) {
          result = 'lose';
        }

        if (!this.scoreData.value.result) {
          this.scoreData.value.result = [];
        }
        if (lane === 'left') {
          this.scoreData.value.result[0] = result;
        }
        if (lane === 'center') {
          this.scoreData.value.result[1] = result;
        }
        if (lane === 'right') {
          this.scoreData.value.result[2] = result;
        }
        break;
      }

      case 'endRound': {
        const arg = notif.args as BgaEndRoundNotif;
        const score = arg.score;
        const table = arg.table;
        const center = arg.center;
        const dayOrNight = arg.day_or_night;
        const playerSides = arg.player_sides;

        const isMySide = (pID: string) => {
          const myPID = String(this.playerID.value);
          if (!this.observer && pID === myPID) {
            return true;
          }

          // observer is treated as sun player
          if (this.observer && String(playerSides['day']) === pID) {
            return true;
          }

          return false;
        };

        for (const pID in score) {
          if (pID === 'center') {
            this.scoreData.value.centerScore = objToArray(score[pID]);
          } else if (isMySide(pID)) {
            this.scoreData.value.myScore = objToArray(score[pID]);
          } else {
            this.scoreData.value.oppoScore = objToArray(score[pID]);
          }
        }

        // update table (some might have stealth)
        for (const pID in table) {
          if (isMySide(String(pID))) {
            table[pID].forEach((card) => {
              const gridID = Number(card.location_arg);
              const row = Math.floor(gridID / 3) + 3;
              const col = gridID % 3;
              if (this.gridData.value.cardIDs) {
                this.gridData.value.cardIDs[col][row] = {
                  cid: `mainCard${card.type_arg}`,
                  meta: [],
                };
              }
            });
          } else {
            table[pID].forEach((card) => {
              const gridID = Number(card.location_arg);
              const row = 1 - Math.floor(gridID / 3);
              const col = gridID % 3;
              if (this.gridData.value.cardIDs) {
                this.gridData.value.cardIDs[col][row] = {
                  cid: `mainCard${card.type_arg}`,
                  meta: [],
                };
              }
            });
          }
        }

        // update center
        if (!this.gridData || !this.gridData.value.cardIDs) {
          break;
        }
        setTimeout(() => {
          if (!this.gridData.value.cardIDs) {
            this.gridData.value.cardIDs = [[], [], []];
          }
          this.gridData.value.cardIDs[0][2] = {
            cid:
              'centerCard' +
              this.getCenterIdx('left', dayOrNight, center.left.controller),
            meta: [],
          };
        }, 1000);
        setTimeout(() => {
          if (!this.gridData.value.cardIDs) {
            this.gridData.value.cardIDs = [[], [], []];
          }
          this.gridData.value.cardIDs[1][2] = {
            cid:
              'centerCard' +
              this.getCenterIdx('center', dayOrNight, center.center.controller),
            meta: [],
          };
        }, 2000);
        setTimeout(() => {
          if (!this.gridData.value.cardIDs) {
            this.gridData.value.cardIDs = [[], [], []];
          }
          this.gridData.value.cardIDs[2][2] = {
            cid:
              'centerCard' +
              this.getCenterIdx('right', dayOrNight, center.right.controller),
            meta: [],
          };
        }, 3000);

        break;
      }

      default:
        break;
    }
  }

  public getCenterIdx(
    pos: 'left' | 'center' | 'right',
    dayOrNight: 'day' | 'night',
    controller: string
  ) {
    let idx = 0;
    switch (pos) {
      case 'left':
        idx = 0;
        break;
      case 'center':
        idx = 1;
        break;
      case 'right':
        idx = 2;
        break;
    }
    if (dayOrNight === 'night') {
      idx += 3;
    }
    if (Number(controller) === 0) {
      return idx;
    }
    if (Number(controller) === Number(this.playerID.value)) {
      return idx + 6;
    }
    return (idx += 12);
  }
}
