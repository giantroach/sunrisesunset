import { CardID } from './card.d';

type OverlayType = 'text';
type OverlayClass = 'largeCenter';

interface CellOverlay {
  type: OverlayType;
  data: string;
  cssClass?: OverlayClass;
}

interface Overlay {
  type: OverlayType;
  data: string;
  pos: string;
  cssClass?: string;
}

interface GridData {
  cardIDs?: Array<Array<CardID | undefined>> | undefined;
  selectable?: boolean[][][];
  selected?: boolean[][][];
  highlighted?: boolean[][];
  selectableCol?: boolean[];
  selectedCol?: boolean[];
  overlay?: Overlay[];
  cellOverlay?: CellOverlay[][];
  exclusiveSelect?: boolean;
  ghosts?: boolean[][] | undefined;
  active?: boolean;
}

export { GridData, Overlay, CellOverlay };
