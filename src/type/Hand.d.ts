import { CardMeta } from 'bga_src/client/type/gamedata.d';
import { CardID } from './card.d';

interface HandData {
  cardIDs: CardID[];
  selectable?: boolean[];
  selected?: boolean[];
  exclusiveSelect?: boolean;
  active?: boolean;
}

export { HandData, CardID };
