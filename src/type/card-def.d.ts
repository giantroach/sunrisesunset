interface SizeDef {
  width: string;
  height: string;
  radius: string;
}

interface TextPlaceholder {
  regexp: RegExp;
  img: string;
}

interface TextLayoutDef {
  offsetY: string;
  offsetX?: string;
  paddingSide: string;
  paddingBottom: string;
}

type OnPlay =
  | 'TargetSameLane:Silence'
  | 'TargetNonStealthSameLane:Reincanate'
  | 'TargeAnytStealth:Reveal'
  | 'TargetSameLaneToAnother:Maze';
type OnResolution =
  | 'IncleaseCenterBy1'
  | 'Receive1OnLose'
  | 'Becomes15OnCenter0or6'
  | 'ChangeCenterTo0'
  | 'LowerWins'
  | 'TiesOn4+'
  | 'Deal1OnWin'
  | 'ReducesCenterBy2';

interface CardDetail {
  name: string;
  text: string;
  power: {
    fixed: number;
    center: 0 | 1 | 2 | 3;
  };
  onPlay?: OnPlay;
  onResolution?: OnResolution;
  stealth: boolean;
  onlyMini?: boolean;
}

interface CardDef {
  image: string;
  sprite: string;
  size: SizeDef;
  textDef?: TextLayoutDef;
  minModalTop?: number;
  details?: {
    [id: number]: CardDetail;
  };
  miniDef?: MiniDef;
  placeholder?: PlaceholderDef;
}

interface PlaceholderDef {
  // FIXME: should use sprites
  defs: TextPlaceholder[];
  size: SizeDef;
}

interface MiniDef {
  image: string;
  sprite: string;
  size: SizeDef;
}

interface CardMetaDef {
  text: string;
  type: 'warn' | 'info';
}

export { SizeDef, TextPlaceholder, TextLayoutDef, CardDetail, CardDef, MiniDef, CardMetaDef };
