import { BarType, CtrlBarData, CtrlBarDef } from '../type/ctrl-bar.d';

const ctrlBarDefs: { [barType in BarType]: CtrlBarDef } = {
  '': {
    message: '',
    buttonTypes: [],
  },
  cancelable: {
    message: '',
    buttonTypes: ['cancel'],
  },
  turnInit: {
    message: 'Choose a card to play.',
    buttonTypes: [],
  },
  mulligan: {
    message: 'You may discard a card to draw a new card.',
    buttonTypes: ['mulligan', 'noMulligan'],
  },
  noValidTarget: {
    message: 'No valid target.',
    buttonTypes: ['noValidTarget'],
  },
  chooseGrid: {
    message: 'Choose a lane to place.',
    buttonTypes: ['cancel'],
  },
  chooseTargetAnubis: {
    message: 'Choose a unit to disable stealth and ability.',
    buttonTypes: ['cancel'],
  },
  chooseTargetIsis: {
    message: 'Choose a unit to discard.',
    buttonTypes: ['cancel'],
  },
  chooseTargetRa: {
    message: 'Choose a unit to disable stealth.',
    buttonTypes: ['cancel'],
  },
  chooseTargetHeka1: {
    message: 'Choose a stealth unit to move.',
    buttonTypes: ['cancel'],
  },
  chooseTargetHeka2: {
    message: 'Choose a lane to move.',
    buttonTypes: ['cancel'],
  },
  submitActionConfirm: {
    message: "Press 'Submit' to confirm.",
    buttonTypes: ['submit', 'cancel'],
  },
};

const defaultCtrlBarData: CtrlBarData = {
  type: '',
};

export { ctrlBarDefs, defaultCtrlBarData };
