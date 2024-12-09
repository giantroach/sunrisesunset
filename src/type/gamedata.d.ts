/**
 * Sunrise Sunset interfaces
 */

import { Player, Gamestate } from './framework.d';

interface Card {
  id: string; // num str
  location: string;
  location_arg: string; // num str
  type: string; // num str
  type_arg: string; // num str
  meta?: string;
}

interface Score {
  [playerId: string]: string[];
}

interface Center {
  controller: string;
}

interface Gamedata {
  current_player_id: string;
  decision: { decision_type: string };
  game_result_neutralized: string;
  gamestate: Gamestate;
  gamestates: { [gamestateId: number]: Gamestate };
  neutralized_player_id: string;
  notifications: { last_packet_id: string; move_nbr: string };
  playerorder: (string | number)[];
  players: { [playerId: number]: Player };
  tablespeed: string;

  // Add here variables you set up in getAllDatas
  player_cards: Card[];
  player_table: Card[];
  oppo_table: Card[];
  discarded: Card[];
  day_or_night: 'day' | 'night';
  round: string;
  center: {
    left: Center;
    center: Center;
    right: Center;
  };
  reincarnated_card_id?: string | null;
  reincarnated_col?: string | null;
  score?: {
    [playerId: number | 'center']: number[];
  };
  winner?: string[];
  player_side?: 'day' | 'night';
  is_observer: boolean;
  player_sides: {
    day: string;
    night: string;
  };
}

export { CardMeta, Card, Score, Gamedata };
