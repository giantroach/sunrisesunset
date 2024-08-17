import { CtrlButtonData, ButtonType } from './ctrlButton.d';

type BarType =
  | ''
  | 'cancelable'
  | 'turnInit'
  | 'mulligan'
  | 'noValidTarget'
  | 'chooseGrid'
  | 'chooseTargetAnubis'
  | 'chooseTargetIsis'
  | 'chooseTargetRa'
  | 'chooseTargetHeka1'
  | 'chooseTargetHeka2'
  | 'submitActionConfirm'
  | 'submitScoreConfirm';

interface CtrlBarDef {
  message: string;
  buttonTypes: ButtonType[];
}

interface CtrlBarDefs {
  [BarType: string]: CtrlBarDef;
}

interface CtrlBarData {
  type: BarType;
}

export { BarType, CtrlBarDef, CtrlBarDefs, CtrlBarData };
