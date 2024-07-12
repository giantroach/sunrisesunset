import { HandDef } from '../type/hand-def.d';
import { HandData, CardID } from '../type/hand.d';

const handDefs: { [cardType: string]: HandDef } = {
  card: {
    size: { width: '138px', height: '120px', radius: '10px' },
  },
};

const handUtil = {
  findFirstSelectedID: (data: HandData): CardID | null => {
    const cardIdx = data.selected?.indexOf(true);
    if (cardIdx === undefined || cardIdx === -1) {
      return null;
    }
    const c = data.cardIDs?.[cardIdx];
    if (!c) {
      return null;
    }
    return c;
  },
};

export { handDefs, handUtil };
