import { GridDef } from '../type/grid-def.d';
import { GridData } from '../type/grid.d';

// const isGridSelectable = (
//   x: number,
//   y: number,
//   cardIDs: string[][],
// ): boolean => {
//   if (y < 3) {
//     return false;
//   }
//   if (cardIDs[y][x]) {
//     return false;
//   }
//   if (!cardIDs[y - 1][x]) {
//     return false;
//   }
//   return true;
// };

const gridDef: { [cardType: string]: GridDef } = {
  table: {
    type: 'square',
    layout: '3x5',
    size: { width: '138px', height: '120px', radius: '10px' },
    margin: { row: '10px', column: '10px' },
  },
};

const gridUtil = {
  // generally works only exclusiveSelect mode
  getFirstSelectedIdx: (
    gridData: GridData,
    idx: number
  ): { x: number; y: number } => {
    let x = -1;
    let y = -1;
    if (gridData.selected) {
      x = gridData.selected?.[idx].findIndex((col) => {
        y = (col || []).findIndex((row) => {
          return row;
        });
        return y !== -1;
      });
    }
    return { x, y };
  },

  getIdxFromCid: (
    gridData: GridData,
    cid: string
  ): { x: number; y: number } => {
    let x = -1;
    let y = -1;
    if (gridData.cardIDs) {
      x = gridData.cardIDs.findIndex((col) => {
        y = (col || []).findIndex((row) => {
          return row?.cid === cid;
        });
        return y !== -1;
      });
    }
    return { x, y };
  },
};

export { gridDef, gridUtil };
