import { Card, Score, Center } from './gamedata';
import { StoneType } from './stone.d';

type BgaNotifyName =
  | 'fixme';

interface BgaRequest {
  name: string;
  args: any;
}

interface BgaNotification {
  name: BgaNotifyName;
  args:
    | BgaPlaceholderNotif;
}

interface BgaPlaceholderNotif {
  player_name: string;
}

export {
  BgaRequest,
  BgaNotification,
  BgaTakeStoneNotif,
};
