const testDataBase = {};

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
];

function loadTestData(idx = 0) {
  const vue = window.vue;
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
];

function loadTestEvent(idx = 0) {
  const vue = window.vue;
  vue.bgaNotifications.push(testEvent[idx]);
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
