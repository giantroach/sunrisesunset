import type { Ref } from 'vue';
import { GridData, CellOverlay } from '../type/grid.d';
import { HandData } from '../type/hand.d';
import { ScoreData } from '../type/score.d';
import { ReincarnationData } from '../type/reincarnation.d';
import { CtrlBarData } from '../type/ctrl-bar.d';
import { watch } from 'vue';
import { cardUtil } from '../def/card';
import { gridUtil } from '../def/grid';
import { handUtil } from '../def/hand';
import { throttle } from '../util/util';

type CurrentState =
  | 'init'
  | 'roundSetup'
  | 'waitingForOtherPlayer'
  | 'mulligan:init'
  | 'mulligan:beforeCardSelect'
  | 'mulligan:afterCardSelect'
  | 'mulligan:submit'
  | 'mulligan:submitNoMulligan'
  | 'mulligan:afterSubmit'
  | 'playerTurn:init'
  | 'playerTurn:beforeCardSelect'
  | 'playerTurn:afterCardSelect'
  | 'playerTurn:beforeGridSelect'
  | 'playerTurn:afterGridSelect'
  | 'playerTurn:beforeTargetSelect'
  | 'playerTurn:beforeTargetSelect2'
  | 'playerTurn:afterTargetSelect'
  | 'playerTurn:submit'
  | 'playerTurn:afterSubmit'
  | 'reincarnationTurn:init'
  | 'reincarnationTurn:beforeCardSelect'
  | 'reincarnationTurn:afterCardSelect'
  | 'reincarnationTurn:beforeGridSelect'
  | 'reincarnationTurn:afterGridSelect'
  | 'reincarnationTurn:beforeTargetSelect'
  | 'reincarnationTurn:beforeTargetSelect2'
  | 'reincarnationTurn:afterTargetSelect'
  | 'reincarnationTurn:submit'
  | 'reincarnationTurn:afterSubmit'
  | 'endRound:init'
  | 'endRound:submit'
  | 'endRound:afterAnim'
  | 'endRound:afterSubmit'
  | 'otherPlayerTurn';

type SubState =
  | 'init'
  | 'beforeCardSelect'
  | 'afterCardSelect'
  | 'beforeGridSelect'
  | 'afterGridSelect'
  | 'beforeTargetSelect'
  | 'beforeTargetSelect2'
  | 'afterTargetSelect'
  | 'submit'
  | 'afterAnim'
  | 'afterSubmit';

type BoardSide = 'player' | 'oppo';

//
// State handles data changes / local state changes
//

class State {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private request: any,
    private gridData: Ref<GridData>,
    private handData: Ref<HandData>,
    private scoreData: Ref<ScoreData>,
    private reincarnationData: Ref<ReincarnationData>,
    private ctrlBarData: Ref<CtrlBarData>
  ) {
    this.throttledRefresh = throttle(this.refresh, 100, this);
    watch(
      [this.gridData, this.handData, this.scoreData],
      () => {
        // FIXME: there are too many of refresh calls
        this.throttledRefresh();
      },
      { deep: true }
    );
  }

  public current: CurrentState = 'waitingForOtherPlayer';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public throttledRefresh: any;

  public refresh() {
    console.log(`this.current`, this.current);
    switch (this.current) {
      case 'waitingForOtherPlayer':
        this.assign(this.handData, 'active', false);
        this.assign(this.handData, 'selected', []);
        this.assign(this.gridData, 'active', false);
        this.assign(this.gridData, 'selected', []);
        this.assign(this.gridData, 'ghosts', []);
        this.assign(this.ctrlBarData, 'type', 'waitingOppo');
        break;

      case 'mulligan:init': {
        this.assign(this.handData, 'active', true);
        this.assign(this.handData, 'selected', []);
        // filter 13 / 14 (the Creeps)
        this.handData.value.cardIDs?.forEach((c, idx) => {
          // FIXME: push does not work. just replace it
          if (!this.handData.value.selectable) {
            this.handData.value.selectable = [];
          }
          this.handData.value.selectable[idx] =
            c.cid !== 'mainCard13' && c.cid !== 'mainCard14';
        });
        this.setSubState('beforeCardSelect');
        this.assign(this.ctrlBarData, 'type', 'mulligan');
        break;
      }

      case 'playerTurn:init':
        this.assign(this.handData, 'active', true);
        this.assign(this.handData, 'selected', []);
        this.assign(
          this.handData,
          'selectable',
          new Array(this.handData.value.cardIDs?.length || 0).fill(true)
        );
        this.assign(this.gridData, 'selected', []);
        this.assign(this.gridData, 'selectable', []);
        this.assign(this.gridData, 'selectedCol', []);
        this.assign(this.gridData, 'selectableCol', []);
        this.assign(this.gridData, 'ghosts', []);
        this.setSubState('beforeCardSelect');
        this.assign(this.ctrlBarData, 'type', 'turnInit');
        break;

      case 'reincarnationTurn:init': {
        this.assign(this.handData, 'active', true);
        this.assign(this.handData, 'selected', []);
        const selectable = new Array(
          this.handData.value.cardIDs?.length || 0
        ).fill(false);
        // here we should select only the reincarnated card id
        this.handData.value.cardIDs?.forEach((c, idx) => {
          if (
            Number(c.id) ===
            Number(this.reincarnationData.value.reincarnatedCardID)
          ) {
            selectable[idx] = true;
          }
        });
        this.assign(this.handData, 'selectable', selectable);
        this.assign(this.gridData, 'selected', []);
        this.assign(this.gridData, 'selectable', []);
        this.assign(this.gridData, 'selectedCol', []);
        this.assign(this.gridData, 'selectableCol', []);
        this.assign(this.gridData, 'ghosts', []);
        this.setSubState('beforeCardSelect');
        break;
      }

      case 'mulligan:beforeCardSelect':
      case 'playerTurn:beforeCardSelect':
      case 'reincarnationTurn:beforeCardSelect':
        if (this.handData.value.selected?.includes(true)) {
          this.setSubState('afterCardSelect');
          break;
        }
        break;

      case 'mulligan:afterCardSelect':
        if (!this.handData.value.selected?.includes(true)) {
          this.setSubState('beforeCardSelect');
          break;
        }
        this.assign(this.ctrlBarData, 'type', 'mulligan');
        break;

      case 'playerTurn:afterCardSelect':
      case 'reincarnationTurn:afterCardSelect':
        this.setSubState('beforeGridSelect');
        break;

      case 'playerTurn:beforeGridSelect':
      case 'reincarnationTurn:beforeGridSelect':
        if (!this.handData.value.selected?.includes(true)) {
          this.assign(this.gridData, 'active', false);
          this.assign(this.gridData, 'selected', []);
          this.setSubState('beforeCardSelect');
          break;
        }
        if (
          this.gridData.value.selected?.[0]?.find((row) => {
            return row?.includes(true);
          })
        ) {
          this.setSubState('afterGridSelect');
          break;
        }
        this.assign(this.gridData, 'active', true);
        this.setPlayerGridSelectable();
        this.assign(this.ctrlBarData, 'type', 'chooseGrid');
        break;

      case 'playerTurn:afterGridSelect':
      case 'reincarnationTurn:afterGridSelect': {
        const c = handUtil.findFirstSelectedID(this.handData.value);
        if (!c) {
          this.current = 'playerTurn:afterCardSelect';
          throw 'invalid state';
        }
        const idx = gridUtil.getFirstSelectedIdx(this.gridData.value, 0);
        const ghosts: Array<Array<boolean>> = [[]];
        ghosts[idx.x] = [];
        ghosts[idx.x][idx.y] = true;
        let cardIDs = this.gridData.value.cardIDs;
        if (cardIDs === undefined) {
          cardIDs = [[], [], []];
        }
        if (!cardIDs[idx.x] === undefined) {
          cardIDs[idx.x] = [];
        }
        cardIDs[idx.x][idx.y] = { cid: c.cid, meta: [] };

        this.assign(this.gridData, 'cardIDs', cardIDs);
        this.assign(this.gridData, 'ghosts', ghosts);
        this.assign(this.gridData, 'selectable', []);
        this.assign(this.handData, 'selectable', []);
        this.setSubState('beforeTargetSelect');
        break;
      }

      case 'playerTurn:beforeTargetSelect':
      case 'reincarnationTurn:beforeTargetSelect': {
        const cardIdx = this.handData.value.selected?.indexOf(true);
        if (cardIdx === undefined) {
          throw 'unexpected state';
        }
        const c = this.handData.value.cardIDs?.[cardIdx];
        if (!c) {
          throw 'unexpected state';
        }

        const def = cardUtil.getCard(c.cid);
        if (!def) {
          this.setSubState('beforeGridSelect');
          break;
        }
        if (!def.onPlay) {
          this.setSubState('afterTargetSelect');
          break;
        }

        const selected: boolean[][] = this.gridData.value.selected?.[1] || [];
        const targetSelected = selected.some((s: boolean[]) => {
          return (s || []).includes(true);
        });
        if (targetSelected) {
          if (def.onPlay === 'TargetSameLaneToAnother:Maze') {
            this.assign(this.ctrlBarData, 'type', 'chooseTargetHeka2');
            this.setSubState('beforeTargetSelect2');
            break;
          } else {
            this.setSubState('afterTargetSelect');
            break;
          }
        }

        const [x, y] = this.getSelectedCoordinate(0);

        switch (def.onPlay) {
          case 'TargetSameLane:Silence': {
            this.assign(this.ctrlBarData, 'type', 'chooseTargetAnubis');
            if (!this.setTargetSameLane(x)) {
              this.setSubState('afterTargetSelect');
              break;
            }
            break;
          }
          case 'TargetNonStealthSameLane:Reincanate': {
            this.assign(this.ctrlBarData, 'type', 'chooseTargetIsis');
            if (!this.setTargetSameLaneNonStealth(x, y)) {
              this.setSubState('afterTargetSelect');
              break;
            }
            break;
          }
          case 'TargetAnyStealth:Reveal': {
            this.assign(this.ctrlBarData, 'type', 'chooseTargetRa');
            if (!this.setTargetAnyStealth()) {
              this.setSubState('afterTargetSelect');
              break;
            }
            break;
          }
          case 'TargetSameLaneToAnother:Maze': {
            this.assign(this.ctrlBarData, 'type', 'chooseTargetHeka1');
            if (!this.setTargetSameLaneStealth(x)) {
              this.setSubState('afterTargetSelect');
              break;
            }
            break;
          }
          default: {
            this.setSubState('afterTargetSelect');
            break;
          }
        }
        break;
      }

      case 'playerTurn:beforeTargetSelect2':
      case 'reincarnationTurn:beforeTargetSelect2': {
        const [x, y] = this.getSelectedCoordinate(1);
        const laneSelectable = this.setTargetAnotherLane(x, y);
        this.assign(this.gridData, 'selectable', []);
        if (!laneSelectable) {
          this.setSubState('afterTargetSelect');
          break;
        }
        if (this.gridData.value.selectedCol?.includes(true)) {
          this.setSubState('afterTargetSelect');
          break;
        }
        break;
      }

      case 'playerTurn:afterTargetSelect':
      case 'reincarnationTurn:afterTargetSelect': {
        const cardIdx = this.handData.value.selected?.indexOf(true);
        if (cardIdx === undefined) {
          throw 'unexpected state';
        }
        const c = this.handData.value.cardIDs?.[cardIdx];
        if (!c) {
          throw 'unexpected state';
        }

        this.assign(this.ctrlBarData, 'type', 'submitActionConfirm');
        this.assign(this.gridData, 'selectable', []);
        break;
      }

      case 'mulligan:submit': {
        const cardIdx = this.handData.value.selected?.indexOf(true);
        if (cardIdx === undefined) {
          throw 'unexpected state';
        }
        const c = this.handData.value.cardIDs?.[cardIdx];
        if (!c) {
          throw 'unexpected state';
        }
        this.assign(this.handData, 'active', false);

        this.request('mulligan', {
          card: c.id,
        });
        this.setSubState('afterSubmit');
        break;
      }

      case 'mulligan:submitNoMulligan': {
        this.assign(this.handData, 'active', false);

        this.request('mulligan', {});
        this.setSubState('afterSubmit');
        break;
      }

      case 'playerTurn:submit':
      case 'reincarnationTurn:submit': {
        const cardIdx = this.handData.value.selected?.indexOf(true);
        if (cardIdx === undefined) {
          throw 'unexpected state';
        }
        const c = this.handData.value.cardIDs?.[cardIdx];
        if (!c) {
          throw 'unexpected state';
        }
        this.assign(this.handData, 'active', false);
        this.assign(this.gridData, 'active', false);

        const gridID = this.getSelectedGrid(0).id;
        const targetGrid = this.getSelectedGrid(1);
        const targetCol = this.getSelectedCol();

        this.request('playCard', {
          card: c.id,
          gridID: gridID,
          targetGridID: targetGrid.id,
          targetGridSide: targetGrid.side,
          targetCol: targetCol,
        });
        this.setSubState('afterSubmit');
        break;
      }

      case 'mulligan:afterSubmit':
        this.assign(this.handData, 'selected', []);
        break;

      case 'playerTurn:afterSubmit': {
        break;
      }

      case 'reincarnationTurn:afterSubmit': {
        this.reincarnationData.value.reincarnatedCardID = null;
        this.reincarnationData.value.reincarnatedCol = null;
        break;
      }

      case 'endRound:init': {
        if (
          !this.scoreData.value.myScore.length ||
          !this.scoreData.value.oppoScore.length
        ) {
          return;
        }
        this.setScore();
        this.setSubState('afterAnim');
        break;
      }

      case 'endRound:afterAnim': {
        this.assign(this.ctrlBarData, 'type', 'submitScoreConfirm');
        break;
      }

      case 'endRound:submit': {
        this.request('endRoundConfirm', {});
        this.setSubState('afterSubmit');
        break;
      }

      case 'endRound:afterSubmit': {
        this.assign(this.handData, 'selected', []);
        this.assign(this.ctrlBarData, 'type', 'waitingOppo');
        break;
      }
    }
  }

  public setState(state: CurrentState): void {
    this.current = state;
    this.throttledRefresh();
  }

  public setSubState(subState: SubState): void {
    this.current = this.current.replace(/:.+/, `:${subState}`) as CurrentState;
    this.throttledRefresh();
  }

  public cancelState(): void {
    this.assign(this.ctrlBarData, 'type', '');

    if (/^playerTurn/.test(this.current)) {
      this.current = 'playerTurn:init';
      this.undoPlayedCard();
      this.throttledRefresh();
    }
    if (/^reincarnationTurn/.test(this.current)) {
      this.current = 'reincarnationTurn:init';
      this.undoPlayedCard();
      this.throttledRefresh();
    }
  }

  public submitState(mode?: string): void {
    this.assign(this.ctrlBarData, 'type', '');

    if (/^mulligan/.test(this.current)) {
      if (mode === 'submit') {
        this.current = 'mulligan:submit';
      } else {
        this.current = 'mulligan:submitNoMulligan';
      }
      this.throttledRefresh();
    }
    if (/^playerTurn/.test(this.current)) {
      this.current = 'playerTurn:submit';
      this.throttledRefresh();
    }
    if (/^reincarnationTurn/.test(this.current)) {
      this.current = 'reincarnationTurn:submit';
      this.throttledRefresh();
    }
    if (/^endRound/.test(this.current)) {
      this.current = 'endRound:submit';
      this.throttledRefresh();
    }
  }

  private setPlayerGridSelectable(): void {
    const selectable: boolean[][][] = [[[], [], []]];
    for (let i = 0; i < 3; i += 1) {
      if (
        this.reincarnationData.value.reincarnatedCol !== null &&
        this.reincarnationData.value.reincarnatedCol !== i
      ) {
        continue;
      }
      if (!this.gridData?.value.cardIDs?.[i][3]) {
        selectable[0][i][3] = true;
      } else if (!this.gridData?.value.cardIDs[i][4]) {
        selectable[0][i][4] = true;
      }
    }
    this.assign(this.gridData, 'selectable', selectable);
  }

  private setTargetSameLane(x: number): boolean {
    const selectable: boolean[][] = [[], [], []];
    let result = false;
    for (let iy = 0; iy < 5; iy += 1) {
      if (iy !== 2) {
        if (this.gridData?.value.cardIDs?.[x][iy]) {
          selectable[x][iy] = true;
          result = true;
        }
        if (this.gridData?.value.ghosts?.[x][iy]) {
          selectable[x][iy] = true;
          result = true;
        }
      }
    }
    if (!this.gridData.value.selectable) {
      this.assign(this.gridData, 'selectable', [[], []]);
    }
    this.assign(this.gridData, ['selectable', 1], selectable);
    return result;
  }

  private setTargetSameLaneNonStealth(x: number, y: number): boolean {
    const selectable: boolean[][] = [[], [], []];
    let result = false;
    for (let iy = 0; iy < 5; iy += 1) {
      if (iy !== 2) {
        const isStealth = this.isStealth(x, iy);
        if (isStealth !== null && isStealth !== true) {
          selectable[x][iy] = true;
          result = true;
        }
        if (this.gridData?.value.ghosts?.[x][y]) {
          selectable[x][y] = true;
          result = true;
        }
      }
    }
    if (!this.gridData.value.selectable) {
      this.assign(this.gridData, 'selectable', [[], []]);
    }
    this.assign(this.gridData, ['selectable', 1], selectable);
    return result;
  }

  private setTargetAnyStealth(): boolean {
    const selectable: boolean[][] = [[], [], []];
    let result = false;
    for (let ix = 0; ix < 3; ix += 1) {
      for (let iy = 0; iy < 5; iy += 1) {
        if (iy !== 2) {
          if (this.isStealth(ix, iy)) {
            selectable[ix][iy] = true;
            result = true;
          }
        }
      }
    }
    if (!this.gridData.value.selectable) {
      this.assign(this.gridData, 'selectable', [[], []]);
    }
    this.assign(this.gridData, ['selectable', 1], selectable);
    return result;
  }

  private setTargetSameLaneStealth(x: number): boolean {
    const selectable: boolean[][] = [[], [], []];
    let result = false;
    if (!this.hasAnotherLaneToSelect(x)) {
      this.assign(this.gridData, 'selectable', [[], []]);
      return false;
    }
    for (let iy = 0; iy < 5; iy += 1) {
      if (iy !== 2) {
        if (this.isStealth(x, iy)) {
          selectable[x][iy] = true;
          result = true;
        }
      }
    }
    if (!this.gridData.value.selectable) {
      this.assign(this.gridData, 'selectable', [[], []]);
    }
    this.assign(this.gridData, ['selectable', 1], selectable);
    return result;
  }

  private hasAnotherLaneToSelect(x: number): boolean {
    const selectableCol = [
      [false, false, false],
      [false, false, false],
    ];

    // oppo
    let hasOppoStealth = false;
    for (let y = 0; y < 2; y += 1) {
      if (this.isStealth(x, y)) {
        hasOppoStealth = true;
        break;
      }
    }

    // player
    let hasPlayerStealth = false;
    for (let y = 3; y < 5; y += 1) {
      if (this.isStealth(x, y)) {
        hasPlayerStealth = true;
        break;
      }
    }

    for (let ix = 0; ix < 3; ix += 1) {
      if (ix === x) {
        continue;
      }
      if (hasOppoStealth) {
        if (!this.gridData.value.cardIDs?.[ix]?.[0]) {
          selectableCol[0][ix] = true;
        }
      }
      if (hasPlayerStealth) {
        if (!this.gridData.value.cardIDs?.[ix]?.[4]) {
          selectableCol[1][ix] = true;
        }
      }
    }

    return selectableCol[0].includes(true) || selectableCol[1].includes(true);
  }

  private isStealth(x: number, y: number): boolean | null {
    const c = this.gridData?.value.cardIDs?.[x][y];
    const cid = c?.cid;
    if (!cid) {
      return null;
    }
    const cDetail = cardUtil.getCard(cid);
    if (cDetail.stealth) {
      if (c.meta?.length) {
        if (c.meta[0].metaID === 'stealth') {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  private setTargetAnotherLane(x: number, y: number): boolean {
    if (x === -1) {
      // this.gridData.value.selectableCol = [false, false, false];
      return false;
    }
    const selectableCol = [true, true, true];
    selectableCol[x] = false;

    for (let ix = 0; ix < 3; ix += 1) {
      if (ix === x) {
        continue;
      }
      let ymax = 4;
      if (y < 2) {
        ymax = 0;
      }
      if (this.gridData.value.cardIDs?.[ix]?.[ymax]) {
        selectableCol[ix] = false;
      }
    }

    this.assign(this.gridData, 'selectableCol', selectableCol);
    return selectableCol.includes(true);
  }

  private undoPlayedCard(): void {
    const id = handUtil.findFirstSelectedID(this.handData.value);
    if (!id) {
      return;
    }
    const idx = gridUtil.getIdxFromCid(this.gridData.value, id.cid);
    if (idx.x === -1 || idx.y === -1) {
      return;
    }
    const ghosts: Array<Array<boolean>> = [[]];
    ghosts[idx.x] = [];
    ghosts[idx.x][idx.y] = true;
    this.assign(this.gridData, 'ghosts', ghosts);
    if (this.gridData.value.cardIDs) {
      this.assign(this.gridData, ['cardIDs', idx.x, idx.y], undefined);
    }
  }

  private getSelectedCoordinate(idx: number): [number, number] {
    let y = -1;
    const x = this.gridData.value.selected?.[idx]?.findIndex((col) => {
      y = (col || []).findIndex((row) => {
        return row;
      });
      return y !== -1;
    });
    return [x !== undefined ? x : -1, y !== undefined ? y : -1];
  }

  private setScore() {
    const cellOverlay: CellOverlay[][] = [];
    this.scoreData.value.oppoScore.forEach((score, idx) => {
      const cs = this.getCoodinateFromIdx(idx, 'oppo');
      if (!cellOverlay[cs[0]]) {
        cellOverlay[cs[0]] = [];
      }
      cellOverlay[cs[0]][cs[1]] = {
        type: 'text',
        data: score,
        cssClass: 'largeCenter',
      };
    });
    this.scoreData.value.myScore.forEach((score, idx) => {
      const cs = this.getCoodinateFromIdx(idx, 'me');
      if (!cellOverlay[cs[0]]) {
        cellOverlay[cs[0]] = [];
      }
      cellOverlay[cs[0]][cs[1]] = {
        type: 'text',
        data: score,
        cssClass: 'largeCenter',
      };
    });
    this.scoreData.value.centerScore.forEach((score, idx) => {
      const cs = this.getCoodinateFromIdx(idx, 'center');
      if (!cellOverlay[cs[0]]) {
        cellOverlay[cs[0]] = [];
      }
      cellOverlay[cs[0]][cs[1]] = {
        type: 'text',
        data: score,
        cssClass: 'largeCenter',
      };
    });

    // Show Animation
    const emptyOverlay = [[], [], []] as CellOverlay[][];
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 5; j += 1) {
        emptyOverlay[i][j] = {
          type: 'text',
          data: '',
          cssClass: 'largeCenter',
        };
      }
    }
    // how many sec per a column,
    const duration = 1000;
    // how much step / a column
    const steps = 10;
    const stepDuration = duration / steps;
    const prog = [[], [], []] as string[][];
    const anim = (p: Promise<void>, progress: number): void => {
      p.then(() => {
        const idx = Math.floor(progress / steps);
        const step = (progress % steps) + 1;

        if (idx > 0 && step === 1) {
          // show who won first
          if (!this.scoreData.value.result) {
            // Do not use assign here, we know it changes + TS2532
            // this.assign(this.scoreData, 'result', []);
            this.scoreData.value.result = [];
          }
          if (!this.gridData.value.overlay) {
            // Do not use assign here, we know it changes + TS2532
            // this.assign(this.gridData, 'overlay', []);
            this.gridData.value.overlay = [];
          }
          const result = this.scoreData.value.result[idx - 1];
          if (result === 'win') {
            this.gridData.value.overlay[idx - 1] = {
              type: 'text',
              data: 'Win!',
              pos: `col.${idx - 1}.bottom`,
              cssClass: 'largeCenter success',
            };
          }
          if (result === 'lose') {
            this.gridData.value.overlay[idx - 1] = {
              type: 'text',
              data: 'Lose..',
              pos: `col.${idx - 1}.bottom`,
              cssClass: 'largeCenter danger',
            };
          }
          if (result === 'tie') {
            this.gridData.value.overlay[idx - 1] = {
              type: 'text',
              data: 'Tie',
              pos: `col.${idx - 1}.bottom`,
              cssClass: 'largeCenter',
            };
          }
        }

        if (idx > 2) {
          return;
        }

        prog[idx] = [
          String(Math.floor((Number(cellOverlay[idx][0].data) * step) / steps)),
          String(Math.floor((Number(cellOverlay[idx][1].data) * step) / steps)),
          String(Math.floor((Number(cellOverlay[idx][2].data) * step) / steps)),
          String(Math.floor((Number(cellOverlay[idx][3].data) * step) / steps)),
          String(Math.floor((Number(cellOverlay[idx][4].data) * step) / steps)),
        ];
        // console.log("prog", prog);
        // this.assign(this.gridData, "overlay", prog);
        if (this.gridData?.value.cellOverlay?.[idx]) {
          for (let i = 0; i < 5; i += 1) {
            this.gridData.value.cellOverlay[idx][i].data = prog[idx][i];
          }
        } else {
          // this.assign(this.gridData, "cellOverlay", prog);
        }

        anim(
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, stepDuration);
          }),
          progress + 1
        );
      });
    };
    this.assign(this.gridData, 'cellOverlay', emptyOverlay);
    anim(Promise.resolve(), 0);
  }

  // NOTE: this idx is 0 - 5
  private getCoodinateFromIdx(
    idx: number,
    player: 'me' | 'oppo' | 'center'
  ): [number, number] {
    const x = idx % 3;
    const y = Math.floor(idx / 3);

    if (player === 'oppo') {
      // 3 - 4 - 5
      // 0 - 1 - 2
      return [x, 1 - y];
    }

    if (player === 'center') {
      return [x, 2];
    }

    // 0 - 1 - 2
    // 3 - 4 - 5
    return [x, y + 3];
  }

  private getSelectedGrid(gridIdx: number): {
    id: number | null;
    side: BoardSide;
  } {
    let gridID = null;
    const result = {
      id: null,
      side: 'player' as BoardSide,
    };
    this.gridData.value.selected?.[gridIdx]?.find((row, colIdx) => {
      const rowIdx = row?.indexOf(true);
      if (rowIdx === undefined || rowIdx === -1) {
        return false;
      }
      // 0 - 1 - 2
      // 3 - 4 - 5
      gridID = colIdx + (rowIdx - 3) * 3;
      if (gridID < 0) {
        // opponent side (possible when gridIdx > 1+)
        // 3 - 4 - 5
        // 0 - 1 - 2
        gridID = colIdx + (1 - rowIdx) * 3;
        result.side = 'oppo' as BoardSide;
      }
    });
    result.id = gridID;
    return result;
  }

  private getSelectedCol(): number | null {
    const idx = (this.gridData.value.selectedCol || []).findIndex((col) => {
      if (!col) {
        return false;
      }
      return true;
    });

    if (idx < 0) {
      return null;
    }

    return idx;
    // return (
    //   this.gridData.value.selectedCol?.findIndex((col, colIdx) => {
    //     if (col) {
    //       return false;
    //     }
    //     return true;
    //   }) ?? null
    // );
  }

  // avoid unnecessary update
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private assign(
    obj: any,
    key: string | number | Array<string | number>,
    val: any
  ): void {
    let v1 = '';
    const v2 = JSON.stringify(val);

    if (typeof key === 'object') {
      v1 = JSON.stringify(
        key.reduce((acc, cur) => {
          return acc[cur];
        }, obj.value)
      );
    } else {
      v1 = JSON.stringify(obj.value[key]);
    }

    if (v1 !== v2) {
      if (typeof key === 'object') {
        key.reduce((acc, cur, idx) => {
          if (idx === key.length - 1) {
            acc[cur] = val;
          }
          return acc[cur];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, obj.value as any);
      } else {
        obj.value[key] = val;
      }
    }
  }
}

export { State };
export type { CurrentState };
