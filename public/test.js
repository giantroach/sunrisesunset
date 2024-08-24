const testDataBase = {};
const playerID = 2348342;

const testData = [
  {
    current_player_id: '',
    decision: {
      decision_type: '',
    },
    game_result_neutralized: '0',
    gamestate: {
      id: '3',
      active_player: '2348342',
      args: null,
      reflexion: {
        total: {
          2348342: 7774755,
          2348343: '7775308',
        },
        initial: {
          2348342: 7775438,
        },
        initial_ts: {
          2348342: 1657472266076,
        },
      },
      updateGameProgression: 0,
      name: 'playerTurn',
      description: '${actplayer} must play a card',
      descriptionmyturn: '${you} must play a card',
      type: 'activeplayer',
      possibleactions: ['playCard'],
      transitions: {
        nextPlayer: 4,
        zombiePass: 4,
      },
    },
    gamestates: {
      1: {
        name: 'gameSetup',
        description: '',
        type: 'manager',
        action: 'stGameSetup',
        transitions: {
          roundSetup: 2,
        },
      },
      2: {
        name: 'roundSetup',
        type: 'game',
        action: 'stRoundSetup',
        updateGameProgression: true,
        transitions: {
          playerTurn: 3,
        },
      },
      3: {
        name: 'playerTurn',
        description: '${actplayer} must play a card',
        descriptionmyturn: '${you} must play a card',
        type: 'activeplayer',
        possibleactions: ['playCard'],
        transitions: {
          nextPlayer: 4,
          zombiePass: 4,
        },
      },
      4: {
        name: 'nextPlayer',
        type: 'game',
        action: 'stNextPlayer',
        updateGameProgression: true,
        transitions: {
          playerTurn: 3,
          endRound: 10,
        },
      },
      10: {
        name: 'endRound',
        type: 'game',
        action: 'stEndRound',
        updateGameProgression: true,
        transitions: {
          roundSetup: 2,
          endGame: 99,
        },
      },
      99: {
        name: 'gameEnd',
        description: 'End of game',
        type: 'manager',
        action: 'stGameEnd',
        args: 'argGameEnd',
      },
    },
    neutralized_player_id: '0',
    notifications: {
      last_packet_id: '5',
      move_nbr: '3',
    },
    player_cards: [
      {
        id: '999',
        type: 'standard',
        type_arg: '2',
        location: 'hand',
        location_arg: '9999999',
      },
      {
        id: '2',
        type: 'standard',
        type_arg: '8',
        location: 'hand',
        location_arg: '2348342',
      },
      {
        id: '6',
        type: 'standard',
        type_arg: '1',
        location: 'hand',
        location_arg: '2348342',
      },
      {
        id: '10',
        type: 'standard',
        type_arg: '9',
        location: 'hand',
        location_arg: '2348342',
      },
      {
        id: '15',
        type: 'standard',
        type_arg: '6',
        location: 'hand',
        location_arg: '2348342',
      },
    ],
    playerorder: ['2348342', 2348343],
    players: {
      2348342: {
        id: '2348342',
        score: '0',
        cards: 5,
        color: 'ff0000',
        color_back: null,
        name: 'giantroach0',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
      2348343: {
        id: '2348343',
        score: '0',
        cards: 5,
        color: '008000',
        color_back: null,
        name: 'giantroach1',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
    },
    player_table: [
      {
        id: '5',
        type: 'creep',
        type_arg: '14',
        location: 'table2348342',
        location_arg: '1',
        meta: 'oracle,watcher,',
      },
    ],
    oppo_table: [
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348343',
        location_arg: '0',
      },
      {
        id: '1',
        type: 'standard',
        type_arg: '4',
        location: 'table2348343',
        location_arg: '1',
        meta: 'oracle,',
      },
      {
        id: '2',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348343',
        location_arg: '4',
      },
    ],
    tablespeed: '9',
    day_or_night: 'night',
    round: '5',
    center: {
      left: {
        controller: '',
      },
      center: {
        controller: '',
      },
      right: {
        controller: '',
      },
    },
  },

  {
    current_player_id: '',
    decision: {
      decision_type: '',
    },
    game_result_neutralized: '0',
    gamestate: {
      id: '3',
      active_player: '2348342',
      args: null,
      reflexion: {
        total: {
          2348342: 7775941,
          2348343: '7776000',
        },
        initial: {
          2348342: 7775999,
        },
        initial_ts: {
          2348342: 1659895347668,
        },
      },
      updateGameProgression: 0,
      name: 'playerTurn',
      description: '${actplayer} must play a card',
      descriptionmyturn: '${you} must play a card',
      type: 'activeplayer',
      possibleactions: ['playCard'],
      transitions: {
        nextPlayer: 4,
        zombiePass: 4,
      },
    },
    gamestates: {
      1: {
        name: 'gameSetup',
        description: '',
        type: 'manager',
        action: 'stGameSetup',
        transitions: {
          roundSetup: 2,
        },
      },
      2: {
        name: 'roundSetup',
        type: 'game',
        action: 'stRoundSetup',
        updateGameProgression: true,
        transitions: {
          playerTurn: 3,
        },
      },
      3: {
        name: 'playerTurn',
        description: '${actplayer} must play a card',
        descriptionmyturn: '${you} must play a card',
        type: 'activeplayer',
        possibleactions: ['playCard'],
        transitions: {
          nextPlayer: 4,
          zombiePass: 4,
        },
      },
      4: {
        name: 'nextPlayer',
        type: 'game',
        action: 'stNextPlayer',
        updateGameProgression: true,
        transitions: {
          playerTurn: 3,
          endRound: 10,
        },
      },
      10: {
        name: 'endRound',
        type: 'game',
        action: 'stEndRound',
        updateGameProgression: true,
        transitions: {
          roundSetup: 2,
          endGame: 99,
        },
      },
      99: {
        name: 'gameEnd',
        description: 'End of game',
        type: 'manager',
        action: 'stGameEnd',
        args: 'argGameEnd',
      },
    },
    neutralized_player_id: '0',
    notifications: {
      last_packet_id: '3',
      move_nbr: '1',
    },
    player_cards: [
      {
        id: '1',
        type: 'standard',
        type_arg: '6',
        location: 'hand',
        location_arg: '2348342',
      },
      {
        id: '7',
        type: 'standard',
        type_arg: '1',
        location: 'hand',
        location_arg: '2348342',
      },
      {
        id: '10',
        type: 'standard',
        type_arg: '4',
        location: 'hand',
        location_arg: '2348342',
      },
      {
        id: '12',
        type: 'standard',
        type_arg: '13',
        location: 'hand',
        location_arg: '2348342',
      },
      {
        id: '13',
        type: 'standard',
        type_arg: '9',
        location: 'hand',
        location_arg: '2348342',
      },
      {
        id: '14',
        type: 'creep',
        type_arg: '14',
        location: 'hand',
        location_arg: '2348342',
      },
    ],
    playerorder: ['2348342', 2348343],
    players: {
      2348342: {
        id: '2348342',
        score: '0',
        cards: 6,
        color: 'ff0000',
        color_back: null,
        name: 'giantroach0',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
      2348343: {
        id: '2348343',
        score: '0',
        cards: 6,
        color: '008000',
        color_back: null,
        name: 'giantroach1',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
    },
    player_table: [],
    oppo_table: [],
    tablespeed: '9',
  },

  {
    current_player_id: '',
    decision: { decision_type: '' },
    game_result_neutralized: '0',
    gamestate: {
      id: '3',
      active_player: '2348343',
      args: null,
      reflexion: {
        total: { 2348342: '7775997', 2348343: 7775800 },
        initial: { 2348343: 7775988 },
        initial_ts: { 2348343: 1665922138560 },
      },
      updateGameProgression: 0,
      name: 'playerTurn',
      description: '${actplayer} must play a card',
      descriptionmyturn: '${you} must play a card',
      type: 'activeplayer',
      possibleactions: ['playCard'],
      transitions: { nextPlayer: 4, zombiePass: 4 },
    },
    gamestates: {
      1: {
        name: 'gameSetup',
        description: '',
        type: 'manager',
        action: 'stGameSetup',
        transitions: { roundSetup: 2 },
      },
      2: {
        name: 'roundSetup',
        type: 'game',
        action: 'stRoundSetup',
        updateGameProgression: true,
        transitions: { playerTurn: 3 },
      },
      3: {
        name: 'playerTurn',
        description: '${actplayer} must play a card',
        descriptionmyturn: '${you} must play a card',
        type: 'activeplayer',
        possibleactions: ['playCard'],
        transitions: { nextPlayer: 4, zombiePass: 4 },
      },
      4: {
        name: 'nextPlayer',
        type: 'game',
        action: 'stNextPlayer',
        updateGameProgression: true,
        transitions: { playerTurn: 3, endRound: 10 },
      },
      10: {
        name: 'endRound',
        type: 'game',
        action: 'stEndRound',
        updateGameProgression: true,
        transitions: { roundSetup: 2, endGame: 99 },
      },
      99: {
        name: 'gameEnd',
        description: 'End of game',
        type: 'manager',
        action: 'stGameEnd',
        args: 'argGameEnd',
      },
    },
    neutralized_player_id: '0',
    notifications: { last_packet_id: '33', move_nbr: '11' },
    player_cards: [
      {
        id: '8',
        type: 'standard',
        type_arg: '8',
        location: 'hand',
        location_arg: '2348343',
      },
    ],
    playerorder: ['2348343', 2348342],
    players: {
      2348342: {
        id: '2348342',
        score: '0',
        cards: 1,
        color: '008000',
        color_back: null,
        name: 'giantroach0',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
      2348343: {
        id: '2348343',
        score: '0',
        cards: 1,
        color: 'ff0000',
        color_back: null,
        name: 'giantroach1',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
    },
    player_table: [
      {
        id: '7',
        type: 'standard',
        type_arg: '1',
        location: 'table2348343',
        location_arg: '0',
      },
      {
        id: '9',
        type: 'standard',
        type_arg: '9',
        location: 'table2348343',
        location_arg: '2',
      },
      {
        id: '10',
        type: 'standard',
        type_arg: '3',
        location: 'table2348343',
        location_arg: '5',
      },
      {
        id: '11',
        type: 'standard',
        type_arg: '4',
        location: 'table2348343',
        location_arg: '4',
      },
      {
        id: '12',
        type: 'creep',
        type_arg: '13',
        location: 'table2348343',
        location_arg: '1',
      },
    ],
    oppo_table: [
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348342',
        location_arg: '3',
      },
      {
        id: '2',
        type: 'standard',
        type_arg: '2',
        location: 'table2348342',
        location_arg: '0',
      },
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348342',
        location_arg: '1',
      },
      {
        id: '4',
        type: 'standard',
        type_arg: '10',
        location: 'table2348342',
        location_arg: '4',
      },
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348342',
        location_arg: '2',
      },
    ],
    tablespeed: '9',
    day_or_night: 'day',
    center: {
      left: {
        controller: '',
      },
      center: {
        controller: '',
      },
      right: {
        controller: '2348343',
      },
    },
  },

  {
    current_player_id: '',
    decision: {
      decision_type: '',
    },
    game_result_neutralized: '0',
    gamestate: {
      id: '3',
      active_player: '2348342',
      args: null,
      reflexion: {
        total: {
          2348342: 7774755,
          2348343: '7775308',
        },
        initial: {
          2348342: 7775438,
        },
        initial_ts: {
          2348342: 1657472266076,
        },
      },
      updateGameProgression: 0,
      name: 'playerTurn',
      description: '${actplayer} must play a card',
      descriptionmyturn: '${you} must play a card',
      type: 'activeplayer',
      possibleactions: ['playCard'],
      transitions: {
        nextPlayer: 4,
        zombiePass: 4,
      },
    },
    gamestates: {
      1: {
        name: 'gameSetup',
        description: '',
        type: 'manager',
        action: 'stGameSetup',
        transitions: {
          roundSetup: 2,
        },
      },
      2: {
        name: 'roundSetup',
        type: 'game',
        action: 'stRoundSetup',
        updateGameProgression: true,
        transitions: {
          playerTurn: 3,
        },
      },
      3: {
        name: 'playerTurn',
        description: '${actplayer} must play a card',
        descriptionmyturn: '${you} must play a card',
        type: 'activeplayer',
        possibleactions: ['playCard'],
        transitions: {
          nextPlayer: 4,
          zombiePass: 4,
        },
      },
      4: {
        name: 'nextPlayer',
        type: 'game',
        action: 'stNextPlayer',
        updateGameProgression: true,
        transitions: {
          playerTurn: 3,
          endRound: 10,
        },
      },
      10: {
        name: 'endRound',
        type: 'game',
        action: 'stEndRound',
        updateGameProgression: true,
        transitions: {
          roundSetup: 2,
          endGame: 99,
        },
      },
      99: {
        name: 'gameEnd',
        description: 'End of game',
        type: 'manager',
        action: 'stGameEnd',
        args: 'argGameEnd',
      },
    },
    neutralized_player_id: '0',
    notifications: {
      last_packet_id: '5',
      move_nbr: '3',
    },
    player_cards: [
      {
        id: '999',
        type: 'standard',
        type_arg: '2',
        location: 'hand',
        location_arg: '9999999',
      },
      {
        id: '2',
        type: 'standard',
        type_arg: '8',
        location: 'hand',
        location_arg: '2348342',
      },
      {
        id: '6',
        type: 'standard',
        type_arg: '1',
        location: 'hand',
        location_arg: '2348342',
      },
      {
        id: '10',
        type: 'standard',
        type_arg: '9',
        location: 'hand',
        location_arg: '2348342',
      },
      {
        id: '15',
        type: 'standard',
        type_arg: '0',
        location: 'hand',
        location_arg: '2348342',
      },
    ],
    playerorder: ['2348342', 2348343],
    players: {
      2348342: {
        id: '2348342',
        score: '0',
        cards: 5,
        color: 'ff0000',
        color_back: null,
        name: 'giantroach0',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
      2348343: {
        id: '2348343',
        score: '0',
        cards: 5,
        color: '008000',
        color_back: null,
        name: 'giantroach1',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
    },
    player_table: [
      {
        id: '5',
        type: 'creep',
        type_arg: '14',
        location: 'table2348342',
        location_arg: '1',
        meta: 'oracle,watcher,',
      },
    ],
    oppo_table: [
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348343',
        location_arg: '0',
      },
      {
        id: '1',
        type: 'standard',
        type_arg: '4',
        location: 'table2348343',
        location_arg: '1',
        meta: 'oracle,',
      },
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348343',
        location_arg: '2',
      },
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348343',
        location_arg: '3',
      },
      {
        id: '2',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348343',
        location_arg: '4',
      },
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348343',
        location_arg: '5',
      },
    ],
    tablespeed: '9',
    day_or_night: 'night',
    center: {
      left: {
        controller: '',
      },
      center: {
        controller: '',
      },
      right: {
        controller: '2348343',
      },
    },
  },

  {
    current_player_id: '',
    decision: {
      decision_type: '',
    },
    game_result_neutralized: '0',
    gamestate: {
      id: '21',
      active_player: '2348343',
      args: null,
      reflexion: {
        total: {
          2348342: '176',
          2348343: -586,
        },
        initial: {
          2348343: -531,
        },
        initial_ts: {
          2348343: 1682942377996,
        },
      },
      updateGameProgression: 0,
      name: 'playerTurn',
      description: '${actplayer} must play a card.',
      descriptionmyturn: '${you} must play a card.',
      type: 'activeplayer',
      possibleactions: ['playCard'],
      transitions: {
        nextPlayer: 22,
        zombiePass: 22,
        reincarnation: 32,
      },
    },
    gamestates: {
      1: {
        name: 'gameSetup',
        description: '',
        type: 'manager',
        action: 'stGameSetup',
        transitions: {
          roundSetup: 2,
        },
      },
      2: {
        name: 'roundSetup',
        type: 'game',
        action: 'stRoundSetup',
        updateGameProgression: true,
        transitions: {
          mulliganTurn: 11,
        },
      },
      11: {
        name: 'mulliganTurn',
        description: '${actplayer} may discard to draw a new card.',
        descriptionmyturn: '${you} may discard a card to draw a new card.',
        type: 'activeplayer',
        possibleactions: ['mulligan'],
        transitions: {
          mulliganNextPlayer: 12,
          nextPlayer: 22,
          zombiePass: 22,
        },
      },
      12: {
        name: 'mulliganNextPlayer',
        type: 'game',
        action: 'stMulliganNextPlayer',
        updateGameProgression: true,
        transitions: {
          mulliganTurn: 11,
        },
      },
      21: {
        name: 'playerTurn',
        description: '${actplayer} must play a card.',
        descriptionmyturn: '${you} must play a card.',
        type: 'activeplayer',
        possibleactions: ['playCard'],
        transitions: {
          nextPlayer: 22,
          zombiePass: 22,
          reincarnation: 32,
        },
      },
      22: {
        name: 'nextPlayer',
        type: 'game',
        action: 'stNextPlayer',
        updateGameProgression: true,
        transitions: {
          playerTurn: 21,
          endRound: 51,
        },
      },
      31: {
        name: 'reincarnationTurn',
        description: '${actplayer} must play the reincarnated card.',
        descriptionmyturn: '${you} must play the reincarnated card.',
        type: 'activeplayer',
        possibleactions: ['playCard'],
        transitions: {
          nextPlayer: 22,
          zombiePass: 22,
        },
      },
      32: {
        name: 'reincarnation',
        type: 'game',
        action: 'stReincarnationNextPlayer',
        updateGameProgression: true,
        transitions: {
          reincarnationTurn: 31,
        },
      },
      51: {
        name: 'endRound',
        description: '${actplayer} is confirming the result.',
        descriptionmyturn: 'Press "Confirm" to continue.',
        type: 'multipleactiveplayer',
        action: 'stEndRound',
        updateGameProgression: true,
        possibleactions: ['endRoundConfirm'],
        transitions: {
          roundSetup: 2,
          endGame: 99,
        },
      },
      99: {
        name: 'gameEnd',
        description: 'End of game',
        type: 'manager',
        action: 'stGameEnd',
        args: 'argGameEnd',
      },
    },
    neutralized_player_id: '0',
    notifications: {
      last_packet_id: '43',
      move_nbr: '15',
    },
    player_cards: [
      {
        id: '8',
        type: 'standard',
        type_arg: '8',
        location: 'hand',
        location_arg: '2348343',
      },
    ],
    playerorder: ['2348343', 2348342],
    players: {
      2348342: {
        id: '2348342',
        score: '0',
        cards: 0,
        color: 'ff0000',
        color_back: null,
        name: 'giantroach0',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: false,
        ack: 'ack',
      },
      2348343: {
        id: '2348343',
        score: '0',
        cards: 1,
        color: '008000',
        color_back: null,
        name: 'giantroach1',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: false,
        ack: 'ack',
      },
    },
    player_table: [
      {
        id: '3',
        type: 'creep',
        type_arg: '13',
        location: 'table2348343',
        location_arg: '1',
        meta: '',
      },
      {
        id: '5',
        type: 'standard',
        type_arg: '0',
        location: 'table2348343',
        location_arg: '5',
        meta: '',
      },
      {
        id: '6',
        type: 'standard',
        type_arg: '5',
        location: 'table2348343',
        location_arg: '3',
        meta: '',
      },
      {
        id: '7',
        type: 'standard',
        type_arg: '10',
        location: 'table2348343',
        location_arg: '2',
        meta: '',
      },
      {
        id: '11',
        type: 'standard',
        type_arg: '6',
        location: 'table2348343',
        location_arg: '0',
        meta: '',
      },
    ],
    oppo_table: [
      {
        id: '1',
        type: 'standard',
        type_arg: '4',
        location: 'table2348342',
        location_arg: '4',
        meta: '',
      },
      {
        id: '2',
        type: 'standard',
        type_arg: '7',
        location: 'table2348342',
        location_arg: '5',
        meta: 'watcher,',
      },
      {
        id: '4',
        type: 'standard',
        type_arg: '3',
        location: 'table2348342',
        location_arg: '1',
        meta: '',
      },
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348342',
        location_arg: '3',
      },
      {
        id: '12',
        type: 'standard',
        type_arg: '11',
        location: 'table2348342',
        location_arg: '2',
        meta: 'oracle,',
      },
      {
        id: '15',
        type: 'standard',
        type_arg: '9',
        location: 'table2348342',
        location_arg: '0',
        meta: '',
      },
    ],
    tablespeed: '1',
    day_or_night: 'day',
    round: '1',
    center: {
      left: {
        location: 'left',
        controller: '0',
      },
      center: {
        location: 'center',
        controller: '0',
      },
      right: {
        location: 'right',
        controller: '0',
      },
    },
    reincarnated_card_id: null,
  },

  {
    current_player_id: '',
    decision: {
      decision_type: '',
    },
    game_result_neutralized: '0',
    gamestate: {
      id: '3',
      active_player: '2348342',
      args: null,
      reflexion: {
        total: {
          2348342: 7774755,
          2348343: '7775308',
        },
        initial: {
          2348342: 7775438,
        },
        initial_ts: {
          2348342: 1657472266076,
        },
      },
      updateGameProgression: 0,
      name: 'playerTurn',
      description: '${actplayer} must play a card',
      descriptionmyturn: '${you} must play a card',
      type: 'activeplayer',
      possibleactions: ['playCard'],
      transitions: {
        nextPlayer: 4,
        zombiePass: 4,
      },
    },
    gamestates: {
      1: {
        name: 'gameSetup',
        description: '',
        type: 'manager',
        action: 'stGameSetup',
        transitions: {
          roundSetup: 2,
        },
      },
      2: {
        name: 'roundSetup',
        type: 'game',
        action: 'stRoundSetup',
        updateGameProgression: true,
        transitions: {
          playerTurn: 3,
        },
      },
      3: {
        name: 'playerTurn',
        description: '${actplayer} must play a card',
        descriptionmyturn: '${you} must play a card',
        type: 'activeplayer',
        possibleactions: ['playCard'],
        transitions: {
          nextPlayer: 4,
          zombiePass: 4,
        },
      },
      4: {
        name: 'nextPlayer',
        type: 'game',
        action: 'stNextPlayer',
        updateGameProgression: true,
        transitions: {
          playerTurn: 3,
          endRound: 10,
        },
      },
      10: {
        name: 'endRound',
        type: 'game',
        action: 'stEndRound',
        updateGameProgression: true,
        transitions: {
          roundSetup: 2,
          endGame: 99,
        },
      },
      99: {
        name: 'gameEnd',
        description: 'End of game',
        type: 'manager',
        action: 'stGameEnd',
        args: 'argGameEnd',
      },
    },
    neutralized_player_id: '0',
    notifications: {
      last_packet_id: '5',
      move_nbr: '3',
    },
    player_cards: [],
    playerorder: ['2348342', 2348343],
    players: {
      2348342: {
        id: '2348342',
        score: '0',
        cards: 5,
        color: 'ff0000',
        color_back: null,
        name: 'giantroach0',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
      2348343: {
        id: '2348343',
        score: '0',
        cards: 5,
        color: '008000',
        color_back: null,
        name: 'giantroach1',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
    },
    player_table: [
      {
        id: '5',
        type: 'creep',
        type_arg: '14',
        location: 'table2348342',
        location_arg: '1',
        meta: 'oracle,watcher,',
      },
      {
        id: '999',
        type: 'standard',
        type_arg: '2',
        location: 'table2348342',
        location_arg: '2',
      },
      {
        id: '2',
        type: 'standard',
        type_arg: '8',
        location: 'table2348342',
        location_arg: '3',
      },
      {
        id: '6',
        type: 'standard',
        type_arg: '1',
        location: 'table2348342',
        location_arg: '4',
      },
      {
        id: '10',
        type: 'standard',
        type_arg: '9',
        location: 'table2348342',
        location_arg: '5',
      },
      {
        id: '15',
        type: 'standard',
        type_arg: '0',
        location: 'table2348342',
        location_arg: '0',
      },
    ],
    oppo_table: [
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348343',
        location_arg: '0',
      },
      {
        id: '1',
        type: 'standard',
        type_arg: '4',
        location: 'table2348343',
        location_arg: '1',
        meta: 'oracle,',
      },
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348343',
        location_arg: '2',
      },
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348343',
        location_arg: '3',
      },
      {
        id: '2',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348343',
        location_arg: '4',
      },
      {
        id: '0',
        type: 'stealth',
        type_arg: '17',
        location: 'table2348343',
        location_arg: '5',
      },
    ],
    score: {
      2348342: {
        0: 4,
        1: 5,
        2: 1,
        3: 6,
        4: 3,
        5: 9,
      },
      2348343: {
        0: 3,
        1: 5,
        2: 2,
        3: 4,
        4: 7,
        5: 1,
      },
      center: [2, 3, 6],
    },
    tablespeed: '9',
    day_or_night: 'night',
    center: {
      left: {
        controller: '',
      },
      center: {
        controller: '',
      },
      right: {
        controller: '2348343',
      },
    },
  },

  {
    players: {
      2348342: {
        id: '2348342',
        score: '0',
        cards: 2,
        color: 'ff0000',
        color_back: null,
        name: 'giantroach0',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
      2348343: {
        id: '2348343',
        score: '0',
        cards: 2,
        color: '008000',
        color_back: null,
        name: 'giantroach1',
        avatar: '000000',
        zombie: 0,
        eliminated: 0,
        is_ai: '0',
        beginner: true,
        ack: 'ack',
      },
    },
    player_cards: [
      {
        id: '10',
        type: 'standard',
        type_arg: '1',
        location: 'hand',
        location_arg: '2348342',
      },
      {
        id: '11',
        type: 'standard',
        type_arg: '5',
        location: 'hand',
        location_arg: '2348342',
      },
    ],
    player_table: [
      {
        id: '1',
        type: 'creep',
        type_arg: '14',
        location: 'table2348342',
        location_arg: '0',
        meta: '',
      },
      {
        id: '3',
        type: 'standard',
        type_arg: '11',
        location: 'table2348342',
        location_arg: '3',
        meta: '',
      },
      {
        id: '4',
        type: 'standard',
        type_arg: '7',
        location: 'table2348342',
        location_arg: '2',
        meta: '',
      },
      {
        id: '13',
        type: 'standard',
        type_arg: '0',
        location: 'table2348342',
        location_arg: '5',
        meta: '',
      },
    ],
    oppo_table: [
      {
        id: '2',
        type: 'standard',
        type_arg: '4',
        location: 'table2348343',
        location_arg: '2',
        meta: 'oracle,',
      },
      {
        id: '9',
        type: 'standard',
        type_arg: '9',
        location: 'table2348343',
        location_arg: '5',
        meta: '',
      },
      {
        id: '12',
        type: 'standard',
        type_arg: '8',
        location: 'table2348343',
        location_arg: '1',
        meta: '',
      },
      {
        id: '15',
        type: 'standard',
        type_arg: '10',
        location: 'table2348343',
        location_arg: '0',
        meta: '',
      },
    ],
    day_or_night: 'day',
    round: '1',
    center: {
      left: {
        location: 'left',
        controller: '0',
      },
      center: {
        location: 'center',
        controller: '0',
      },
      right: {
        location: 'right',
        controller: '0',
      },
    },
    player_side: 'sun',
    player_id: 2348342,
    gamestate: {
      id: '21',
      active_player: '2348342',
      args: null,
      reflexion: {
        total: {
          2348342: 92,
          2348343: '-256',
        },
        initial: {
          2348342: 113,
        },
        initial_ts: {
          2348342: 1724236875781,
        },
      },
      updateGameProgression: 0,
      name: 'playerTurn',
      description: '${actplayer} must play a card.',
      descriptionmyturn: '${you} must play a card.',
      type: 'activeplayer',
      possibleactions: ['playCard'],
      transitions: {
        nextPlayer: 22,
        zombiePass: 22,
        reincarnation: 32,
      },
    },
    tablespeed: '1',
    game_result_neutralized: '0',
    neutralized_player_id: '0',
    playerorder: ['2348342', 2348343],
    gamestates: {
      1: {
        name: 'gameSetup',
        description: '',
        type: 'manager',
        action: 'stGameSetup',
        transitions: {
          roundSetup: 2,
        },
      },
      2: {
        name: 'roundSetup',
        type: 'game',
        action: 'stRoundSetup',
        updateGameProgression: true,
        transitions: {
          mulliganTurn: 11,
        },
      },
      11: {
        name: 'mulliganTurn',
        description: '${actplayer} may discard to draw a new card.',
        descriptionmyturn: '${you} may discard a card to draw a new card.',
        type: 'activeplayer',
        possibleactions: ['mulligan'],
        transitions: {
          mulliganNextPlayer: 12,
          nextPlayer: 22,
          zombiePass: 22,
        },
      },
      12: {
        name: 'mulliganNextPlayer',
        type: 'game',
        action: 'stMulliganNextPlayer',
        updateGameProgression: true,
        transitions: {
          mulliganTurn: 11,
        },
      },
      21: {
        name: 'playerTurn',
        description: '${actplayer} must play a card.',
        descriptionmyturn: '${you} must play a card.',
        type: 'activeplayer',
        possibleactions: ['playCard'],
        transitions: {
          nextPlayer: 22,
          zombiePass: 22,
          reincarnation: 32,
        },
      },
      22: {
        name: 'nextPlayer',
        type: 'game',
        action: 'stNextPlayer',
        updateGameProgression: true,
        transitions: {
          playerTurn: 21,
          endRound: 51,
        },
      },
      31: {
        name: 'reincarnationTurn',
        description: '${actplayer} must play the newly drawn card.',
        descriptionmyturn: '${you} must play the newly drawn card.',
        type: 'activeplayer',
        possibleactions: ['playCard'],
        transitions: {
          nextPlayer: 22,
          zombiePass: 22,
        },
      },
      32: {
        name: 'reincarnation',
        type: 'game',
        action: 'stReincarnationNextPlayer',
        updateGameProgression: true,
        transitions: {
          reincarnationTurn: 31,
        },
      },
      51: {
        name: 'endRound',
        description: '${actplayer} is confirming the result.',
        descriptionmyturn: 'Press "Confirm" to continue.',
        type: 'multipleactiveplayer',
        action: 'stEndRound',
        updateGameProgression: true,
        possibleactions: ['endRoundConfirm'],
        transitions: {
          roundSetup: 2,
          endGame: 99,
        },
      },
      99: {
        name: 'gameEnd',
        description: 'End of game',
        type: 'manager',
        action: 'stGameEnd',
        args: 'argGameEnd',
      },
    },
    notifications: {
      last_packet_id: '35',
      move_nbr: '11',
    },
    decision: {
      decision_type: 'none',
    },
  },
];

function loadTestData(idx = 0) {
  const vue = window.vue;
  vue.playerID = playerID;
  vue.gamedata = testData[idx];
  // vue.restore();
  vue.state.current = 'playerTurn:init';
  // vue.state.refresh();
}

const testEvent = [
  {
    name: 'newRound',
    args: [
      {
        uid: '669d0877420c9',
        type: 'newRound',
        log: 'New round started',
        args: { round: 1 },
        synchro: 1,
      },
    ],
  },
  {
    name: 'endRound',
    args: {
      score: {
        2348342: {
          0: 4,
          1: 5,
          2: 1,
          3: 6,
          4: 3,
          5: 9,
        },
        2348343: {
          0: 3,
          1: 5,
          2: 2,
          3: 4,
          4: 7,
          5: 1,
        },
        center: [2, 3, 6],
      },
      table: {
        2348342: [
          {
            id: '0',
            type: 'standard',
            type_arg: '0',
            location: 'table2348342',
            location_arg: '0',
          },
          {
            id: '1',
            type: 'standard',
            type_arg: '1',
            location: 'table2348342',
            location_arg: '1',
          },
          {
            id: '2',
            type: 'standard',
            type_arg: '2',
            location: 'table2348342',
            location_arg: '2',
          },
          {
            id: '0',
            type: 'standard',
            type_arg: '3',
            location: 'table2348342',
            location_arg: '3',
          },
          {
            id: '1',
            type: 'standard',
            type_arg: '4',
            location: 'table2348342',
            location_arg: '4',
          },
          {
            id: '2',
            type: 'standard',
            type_arg: '14',
            location: 'table2348342',
            location_arg: '5',
          },
        ],
        2348343: [
          {
            id: '0',
            type: 'standard',
            type_arg: '6',
            location: 'table2348343',
            location_arg: '0',
          },
          {
            id: '1',
            type: 'standard',
            type_arg: '7',
            location: 'table2348343',
            location_arg: '1',
          },
          {
            id: '2',
            type: 'standard',
            type_arg: '8',
            location: 'table2348343',
            location_arg: '2',
          },
          {
            id: '3',
            type: 'standard',
            type_arg: '9',
            location: 'table2348343',
            location_arg: '3',
          },
          {
            id: '4',
            type: 'standard',
            type_arg: '10',
            location: 'table2348343',
            location_arg: '4',
          },
          {
            id: '5',
            type: 'standard',
            type_arg: '13',
            location: 'table2348343',
            location_arg: '5',
          },
        ],
      },
      center: {
        center: { location: 'center', controller: '2348342' },
        left: { location: 'left', controller: '0' },
        right: { location: 'right', controller: '2348343' },
      },
      day_or_night: 'day',
    },
  },
  {
    name: 'newRound',
    args: {
      player_cards: [],
      center: {
        center: { location: 'center', controller: '2348342' },
        left: { location: 'left', controller: '0' },
        right: { location: 'right', controller: '2348343' },
      },
      day_or_night: 'night',
    },
  },
  {
    name: 'playCard',
    args: {
      player_id: 2348342,
      player_name:
        '<!--PNS--><span class="playername" style="color:#ff0000;">giantroach0</span><!--PNE-->',
      card: {
        id: '15',
        type: 'standard',
        type_arg: '13',
        location: 'hand',
        location_arg: '2348342',
        meta: '',
      },
      cards: '3',
      gridID: '0',
    },
  },
  {
    name: 'score + endRound1',
    seqEvts: [
      {
        name: 'score',
        args: {
          lane: 'left',
          scoreA: 9,
          scoreB: 4,
          wPlayerName: null,
          w_player_id: 'tie',
        },
      },
      {
        name: 'score',
        args: {
          lane: 'center',
          scoreA: 4,
          scoreB: 8,
          wPlayerName: 'giantroach1',
          w_player_id: 2348343,
        },
      },
      {
        name: 'score',
        args: {
          lane: 'right',
          scoreA: 25,
          scoreB: 16,
          wPlayerName: 'giantroach1',
          w_player_id: 2348343,
        },
      },
      {
        name: 'endRound',
        args: {
          score: {
            2348342: {
              0: 2,
              1: 1,
              2: 14,
              3: 2,
              4: 7,
              5: 2,
            },
            2348343: {
              0: 5,
              1: 3,
              2: 4,
              3: 4,
              4: 1,
              5: 21,
            },
            center: [2, 0, 7],
          },
          table: {
            2348342: [
              {
                id: '1',
                type: 'standard',
                type_arg: '4',
                location: 'table2348342',
                location_arg: '0',
                meta: 'oracle,',
              },
              {
                id: '2',
                type: 'standard',
                type_arg: '7',
                location: 'table2348342',
                location_arg: '3',
                meta: '',
              },
              {
                id: '4',
                type: 'creep',
                type_arg: '13',
                location: 'table2348342',
                location_arg: '1',
                meta: '',
              },
              {
                id: '8',
                type: 'standard',
                type_arg: '10',
                location: 'table2348342',
                location_arg: '4',
                meta: '',
              },
              {
                id: '12',
                type: 'standard',
                type_arg: '2',
                location: 'table2348342',
                location_arg: '2',
                meta: '',
              },
              {
                id: '15',
                type: 'standard',
                type_arg: '11',
                location: 'table2348342',
                location_arg: '5',
                meta: '',
              },
            ],
            2348343: [
              {
                id: '3',
                type: 'standard',
                type_arg: '5',
                location: 'table2348343',
                location_arg: '0',
                meta: '',
              },
              {
                id: '6',
                type: 'standard',
                type_arg: '0',
                location: 'table2348343',
                location_arg: '3',
                meta: '',
              },
              {
                id: '7',
                type: 'standard',
                type_arg: '9',
                location: 'table2348343',
                location_arg: '1',
                meta: '',
              },
              {
                id: '11',
                type: 'creep',
                type_arg: '14',
                location: 'table2348343',
                location_arg: '4',
                meta: '',
              },
              {
                id: '13',
                type: 'standard',
                type_arg: '8',
                location: 'table2348343',
                location_arg: '2',
                meta: '',
              },
              {
                id: '14',
                type: 'standard',
                type_arg: '3',
                location: 'table2348343',
                location_arg: '5',
                meta: '',
              },
            ],
          },
          center: {
            left: {
              location: 'left',
              controller: '0',
            },
            center: {
              location: 'center',
              controller: '2348343',
            },
            right: {
              location: 'right',
              controller: '2348343',
            },
          },
          day_or_night: 'day',
        },
      },
    ],
  },
  {
    name: 'score + endRound2',
    seqEvts: [
      {
        "name": "score",
        "args": {
          "i18n": [
            "lane"
          ],
          "lane": "right"
        }
      },
      {
        "name": "score",
        "args": {
          "i18n": [
            "lane"
          ],
          "lane": "left"
        }
      },
      {
        name: 'score',
        args: {
          i18n: ['lane'],
          lane: 'left',
          scoreA: 8,
          scoreB: 3,
          wPlayerName: 'giantroach1',
          w_player_id: 2348343,
        },
      },
      {
        name: 'score',
        args: {
          i18n: ['lane'],
          lane: 'center',
          scoreA: 5,
          scoreB: 11,
          wPlayerName: null,
          w_player_id: 'tie',
        },
      },
      {
        name: 'score',
        args: {
          i18n: ['lane'],
          lane: 'right',
          scoreA: 17,
          scoreB: 9,
          wPlayerName: 'giantroach0',
          w_player_id: 2348342,
        },
      },
      {
        name: 'endRound',
        args: {
          score: {
            2348342: {
              0: 7,
              1: 1,
              2: 5,
              3: 1,
              4: 4,
              5: 12,
            },
            2348343: {
              0: 0,
              1: 7,
              2: 8,
              3: 3,
              4: 4,
              5: 1,
            },
            center: [0, 4, 6],
          },
          table: {
            2348342: [
              {
                id: '1',
                type: 'standard',
                type_arg: '2',
                location: 'table2348342',
                location_arg: '5',
                meta: '',
              },
              {
                id: '5',
                type: 'standard',
                type_arg: '10',
                location: 'table2348342',
                location_arg: '0',
                meta: '',
              },
              {
                id: '7',
                type: 'creep',
                type_arg: '14',
                location: 'table2348342',
                location_arg: '1',
                meta: 'watcher,',
              },
              {
                id: '8',
                type: 'standard',
                type_arg: '12',
                location: 'table2348342',
                location_arg: '2',
                meta: 'oracle,',
              },
              {
                id: '12',
                type: 'standard',
                type_arg: '1',
                location: 'table2348342',
                location_arg: '3',
                meta: '',
              },
              {
                id: '15',
                type: 'standard',
                type_arg: '8',
                location: 'table2348342',
                location_arg: '4',
                meta: '',
              },
            ],
            2348343: [
              {
                id: '4',
                type: 'standard',
                type_arg: '5',
                location: 'table2348343',
                location_arg: '1',
                meta: '',
              },
              {
                id: '6',
                type: 'standard',
                type_arg: '3',
                location: 'table2348343',
                location_arg: '0',
                meta: '',
              },
              {
                id: '10',
                type: 'standard',
                type_arg: '9',
                location: 'table2348343',
                location_arg: '3',
                meta: '',
              },
              {
                id: '11',
                type: 'creep',
                type_arg: '13',
                location: 'table2348343',
                location_arg: '5',
                meta: '',
              },
              {
                id: '13',
                type: 'standard',
                type_arg: '7',
                location: 'table2348343',
                location_arg: '4',
                meta: '',
              },
              {
                id: '14',
                type: 'standard',
                type_arg: '0',
                location: 'table2348343',
                location_arg: '2',
                meta: '',
              },
            ],
          },
          center: {
            left: {
              location: 'left',
              controller: '2348343',
            },
            center: {
              location: 'center',
              controller: '2348342',
            },
            right: {
              location: 'right',
              controller: '2348342',
            },
          },
          day_or_night: 'night',
        },
      },
    ],
  },
];

function loadTestEvent(idx = 0) {
  const vue = window.vue;
  if (testEvent[idx].seqEvts) {
    testEvent[idx].seqEvts.forEach((evt) => {
      vue.bgaNotifications.push(evt);
    });
    return;
  }
  vue.bgaNotifications.push(testEvent[idx]);
}

function setState(state) {
  const vue = window.vue;
  vue.bgaStates.push(state);
}

// append UI
const base = document.createElement('div');
base.innerHTML = `
<div>
<select id="test-data-idx">
</select>
<button
onclick="loadTestData(Number(document.getElementById('test-data-idx').value))"
  >
  Load test data
</button>
<select id="test-event-idx">
</select>
<button
onclick="loadTestEvent(Number(document.getElementById('test-event-idx').value))"
  >
  Load test event
</button>
<select id="test-state">
<option value="roundSetup">roundSetup</option>
<option value="mulligan:init">mulligan</option>
<option value="playerTurn:init">playerTurn</option>
<option value="reincarnationTurn:init">reincarnationTurn</option>
<option value="endRound:init">endRound</option>
</select>
<button
onclick="setState(document.getElementById('test-state').value)">
  Load state
</button>
</div>
`;
document.body.prepend(base);
const sel1 = document.getElementById('test-data-idx');
testData.forEach((d, idx) => {
  const opt = document.createElement('option');
  opt.value = idx;
  opt.innerText = idx;
  sel1.appendChild(opt);
});
const sel2 = document.getElementById('test-event-idx');
testEvent.forEach((d, idx) => {
  const opt = document.createElement('option');
  opt.value = idx;
  opt.innerText = `${idx}: ${d.name}`;
  sel2.appendChild(opt);
});
