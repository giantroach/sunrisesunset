import { BarType, CtrlBarData, CtrlBarDef } from '../type/ctrlBar.d';

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
    message:
      'Choose and take stones from the quarry or choose and place a stone from your workshop.',
    buttonTypes: [],
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
