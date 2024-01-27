import { watch } from 'vue';
import { throttle } from '../util/util';

import type { Ref } from 'vue';
import { PlayerData } from '../type/player.d';
import { CtrlBarData } from '../type/ctrlBar.d';

type CurrentState =
  | 'init'
  | 'playerTurn:init'
  | 'playerTurn:submit'
  | 'playerTurn:afterSubmit'
  | 'waitingForOtherPlayer'
  | 'otherPlayerTurn';

type SubState = 'init' | 'submit' | 'afterSubmit' | 'beforeStoneSelect';

//
// State handles data changes / local state changes
//

class State {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private request: any,
    private playerData: Ref<PlayerData>,
    private ctrlBarData: Ref<CtrlBarData>
  ) {
    this.throttledRefresh = throttle(this.refresh, 100, this);
    watch(
      [this.ctrlBarData],
      () => {
        this.throttledRefresh();
      },
      { deep: true }
    );
  }

  public current: CurrentState = 'waitingForOtherPlayer';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public throttledRefresh: any;

  public refresh() {
    switch (this.current) {
      case 'waitingForOtherPlayer':
        this.reset();
        break;

      case 'playerTurn:init':
        this.reset();
        this.setSubState('afterSubmit');
        break;

      case 'playerTurn:submit':
        this.request('fixme', {});
        this.setSubState('afterSubmit');
        break;

      case 'playerTurn:afterSubmit':
        this.everythingNotSelectable();
        this.assign(this.ctrlBarData.value, 'type', '');
        break;
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
    if (/^playerTurn/.test(this.current)) {
      this.current = 'playerTurn:init';
      this.throttledRefresh();
    }
  }

  public submitState(): void {
    if (/^playerTurn/.test(this.current)) {
      if (/beforeSubmit$/.test(this.current)) {
        this.current = 'playerTurn:submit';
        this.throttledRefresh();
      }
    }
  }

  public resetSelectable(): void {}

  public reset() {
    this.resetSelectable();

    this.assign(this.ctrlBarData.value, 'type', '');
  }

  public everythingNotSelectable() {}

  // avoid unnecessary update
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private assign(obj: any, key: string, val: any): void {
    const v1 = JSON.stringify(obj[key]);
    const v2 = JSON.stringify(val);
    if (v1 !== v2) {
      // console.log(key, v1, v2);
      obj[key] = val;
    }
  }
}

export { State };
export type { CurrentState };
