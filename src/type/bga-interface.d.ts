import { Card, Score, Center } from './gamedata';
import { StoneType } from './stone.d';

type BgaNotifyName =
  | 'newRound'
  | 'newHand'
  | 'playCard'
  | 'moveCard'
  | 'updateCard'
  | 'mulligan'
  | 'reincarnateCard'
  | 'score'
  | 'endRound';

interface BgaRequest {
  name: string;
  args: any;
}

interface BgaNotification {
  name: BgaNotifyName;
  args:
    | BgaNewRoundNotif
    | BgaNewHandNotif
    | BgaPlayCardNotif
    | BgaMoveCardNotif
    | BgaUpdateCardNotif
    | BgaReincarnateCardNotif
    | BgaScoreNotif
    | BgaEndRoundNotif;
}

interface BgaNewRoundNotif {
  // players: {
  //   { [playerId: number]: Player };
  // };
  center: {
    left: Center;
    center: Center;
    right: Center;
  };
  day_or_night: 'day' | 'night';
  round: string;
}

interface BgaNewHandNotif {
  player_cards: Card[];
}

interface BgaPlayCardNotif {
  player_id: string; // num string
  player_name: string;
  card: Card;
  cards: string; // number of cards
  gridID: string;
  ignoreActivePlayer?: boolean;
  playerSide: 'day' | 'night';
}

interface BgaMoveCardNotif {
  player_id: string; // num string
  player_name: string;
  fromGridID: string;
  toGridID: string;
}

interface BgaUpdateCardNotif {
  player_id: string; // num string
  player_name: string;
  card: Card;
  gridID: string;
  playerSide: 'day' | 'night';
}

interface BgaMulliganNotif {
  card?: Card;
  discardedCardID?: string;
}

interface BgaReincarnateCardNotif {
  player_id: string; // num string
  player_name: string;
  card?: Card;
  col?: string;
  gridID: string;
}

interface BgaScoreNotif {
  lane: string;
  w_player_id: string;
}

interface BgaEndRoundNotif {
  score: Score;
  table: {
    [playerId: string]: Card[];
  };
  center: {
    left: Center;
    center: Center;
    right: Center;
  };
  day_or_night: 'day' | 'night';
  player_sides: {
    day: string;
    night: string;
  };
}

export {
  BgaRequest,
  BgaConfirm,
  BgaNotification,
  BgaNewRoundNotif,
  BgaNewHandNotif,
  BgaPlayCardNotif,
  BgaMoveCardNotif,
  BgaUpdateCardNotif,
  BgaDrawCardNotif,
  BgaMulliganNotif,
  BgaReincarnateCardNotif,
  BgaScoreNotif,
  BgaEndRoundNotif,
};
