<?php

/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * SunriseSunset implementation : © Tomoki Motohashi <tomoki.motohashi@takoashi.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * sunrisesunset.game.php
 *
 * This is the main file for your game logic.
 *
 * In this PHP file, you are going to defines the rules of the game.
 *
 */

require_once APP_GAMEMODULE_PATH . 'module/table/table.game.php';

class SunriseSunset extends Table
{
  function __construct()
  {
    // Your global variables labels:
    //  Here, you can assign labels to global variables you are using for this game.
    //  You can use any number of global variables with IDs between 10 and 99.
    //  If your game has options (variants), you also have to associate here a label to
    //  the corresponding ID in gameoptions.inc.php.
    // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
    parent::__construct();

    self::initGameStateLabels([
      //    "my_first_global_variable" => 10,
      //    "my_second_global_variable" => 11,
      //      ...
      //    "my_first_game_variant" => 100,
      //    "my_second_game_variant" => 101,
      //      ...
      'max_score' => 100,
    ]);

    // create instance specifying card module
    $this->cards = self::getNew('module.common.deck');
    $this->cards->init('cards'); // specify cards table and init
  }

  protected function getGameName()
  {
    // Used for translations and stuff. Please do not modify.
    return 'sunrisesunset';
  }

  /*
        setupNewGame:

        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
  protected function setupNewGame($players, $options = [])
  {
    // Set the colors of the players with HTML color code
    // The default below is red/green/blue/orange/brown
    // The number of colors defined here must correspond to the maximum number of players allowed for the gams
    $gameinfos = self::getGameinfos();
    $default_colors = $gameinfos['player_colors'];

    // Create players
    // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
    $sql =
      'INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ';
    $values = [];
    foreach ($players as $player_id => $player) {
      $color = array_shift($default_colors);
      $values[] =
        "('" .
        $player_id .
        "','$color','" .
        $player['player_canal'] .
        "','" .
        addslashes($player['player_name']) .
        "','" .
        addslashes($player['player_avatar']) .
        "')";
    }
    // php8 order
    $sql .= implode(',', $values);
    self::DbQuery($sql);
    self::reattributeColorsBasedOnPreferences(
      $players,
      $gameinfos['player_colors']
    );
    self::reloadPlayersBasicInfos();

    /************ Start the game initialization *****/

    // Init global values with their initial values
    //self::setGameStateInitialValue( 'my_first_global_variable', 0 );

    // Init game statistics
    // (note: statistics used in this file must be defined in your stats.inc.php file)
    //self::initStat( 'table', 'table_teststat1', 0 );    // Init a table statistics
    //self::initStat( 'player', 'player_teststat1', 0 );  // Init a player statistics (for all players)

    // TODO: setup the initial game situation here
    $cards = [];

    $players = self::getCollectionFromDb('SELECT player_id id FROM player');
    $numOfCards = 12;

    for ($cardNo = 0; $cardNo <= $numOfCards; $cardNo++) {
      $cards[] = [
        'type' => 'standard',
        'type_arg' => $cardNo,
        'nbr' => 1,
      ];
    }
    $cards[] = [
      'type' => 'creep',
      'type_arg' => 13,
      'nbr' => 1,
    ];
    $cards[] = [
      'type' => 'creep',
      'type_arg' => 14,
      'nbr' => 1,
    ];

    $this->cards->createCards($cards, 'deck');
    $this->cards->shuffle('deck');

    // set day and night
    $sql =
      "INSERT INTO round (round_id, round_side, round_num) VALUES (1, '', 0)";
    self::DbQuery($sql);

    // set center data
    self::DbQuery(
      "INSERT INTO center (center_id, center_location, center_controller) VALUES (1, 'left', 0)"
    );
    self::DbQuery(
      "INSERT INTO center (center_id, center_location, center_controller) VALUES (2, 'center', 0)"
    );
    self::DbQuery(
      "INSERT INTO center (center_id, center_location, center_controller) VALUES (3, 'right', 0)"
    );

    // just for translation purpose
    clienttranslate('center');
    clienttranslate('right');
    clienttranslate('left');

    $this->gamestate->nextState('roundSetup');

    /************ End of the game initialization *****/
  }

  /*
        getAllDatas:

        Gather all informations about current game situation (visible by the current player).

        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
  protected function getAllDatas()
  {
    $result = [];
    $isObserver = $this->isObserver();
    $result['is_observer'] = $isObserver;

    // !! We must only return informations visible by this player !!
    $current_player_id = self::getCurrentPlayerId();

    // Get information about players
    // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
    $sql = 'SELECT player_id id, player_score score FROM player ';
    $result['players'] = self::getCollectionFromDb($sql);

    // TODO: Gather all information about current game situation (visible by player $current_player_id).
    // return number of cards in the hand
    foreach ($result['players'] as $key => $value) {
      $player_id = $key;
      $count = count($this->cards->getCardsInLocation('hand', $player_id));
      $result['players'][$key]['cards'] = $count;
    }

    // Current player === currently logged in player
    if (!$isObserver) {
      $result['player_cards'] = array_values(
        $this->cards->getCardsInLocation('hand', $current_player_id)
      );

      // Hide enemy stealth units
      $result['player_table'] = $this->getCardsInLocation(
        'table' . $current_player_id
      );

      $sql =
        "SELECT player_id id FROM player WHERE player_id<>'" .
        $current_player_id .
        "'";
      $oppo_id = self::getUniqueValueFromDB($sql);
      $result['oppo_table'] = [];

      foreach ($this->getCardsInLocation('table' . $oppo_id) as $card) {
        $c = $this->card_types[intval($card['type_arg'])];
        // return raw card at the end of round
        if (
          $c->stealth &&
          !$card['meta'] &&
          $this->getStateName() !== 'endRound' &&
          $this->getStateName() !== 'gameEnd'
        ) {
          $result['oppo_table'][] = [
            'id' => '0',
            'type' => 'stealth',
            'type_arg' => '17',
            'location' => $card['location'],
            'location_arg' => $card['location_arg'],
          ];
        } else {
          $result['oppo_table'][] = $card;
        }
      }
    } else {
      // Observer: all the stealth must not be visible
      $result['player_cards'] = [];
      $result['player_table'] = [];
      $result['oppo_table'] = [];

      $sql = 'SELECT player_id FROM player ORDER BY player_no ASC';
      $ps = self::getObjectListFromDB($sql);
      $p1 = $ps[0]['player_id'];
      $p2 = $ps[1]['player_id'];
      $this->dump('$p1', $p1);
      $this->dump('$p2', $p2);
      $tables = [];
      $tables[$p1] = [];
      $tables[$p2] = [];

      foreach ([$p1, $p2] as $pid) {
        foreach ($this->getCardsInLocation('table' . $pid) as $card) {
          $this->dump('$pid', $pid);
          $c = $this->card_types[intval($card['type_arg'])];
          // return raw card at the end of round
          if (
            $c->stealth &&
            !$card['meta'] &&
            $this->getStateName() !== 'endRound' &&
            $this->getStateName() !== 'gameEnd'
          ) {
            $tables[$pid][] = [
              'id' => '0',
              'type' => 'stealth',
              'type_arg' => '17',
              'location' => $card['location'],
              'location_arg' => $card['location_arg'],
            ];
          } else {
            $tables[$pid][] = $card;
          }
        }
      }

      $this->dump('$tables', $tables);
      $this->dump('$p1', $p1);
      $this->dump('$p2', $p2);
      $this->dump('$tables[$p1]', $tables[$p1]);
      $this->dump('$tables[$p2]', $tables[$p2]);
      $result['player_table'] = $tables[$p1];
      $result['oppo_table'] = $tables[$p2];
    }

    $sql = 'SELECT round_side, round_num FROM round';
    $round = self::getObjectFromDB($sql);
    $result['day_or_night'] = $round['round_side'];
    $result['round'] = $round['round_num'];

    // return center controller data
    $sql =
      'SELECT center_location location, center_controller controller FROM center';
    $center = self::getCollectionFromDb($sql);
    $result['center'] = $center;

    // return only when current player is matched
    $sql =
      'SELECT reincarnation_card_id card_id, reincarnation_col col, reincarnation_current_player current_player FROM reincarnation';
    $reincarnation = self::getObjectFromDB($sql);
    if (
      $reincarnation &&
      intval($reincarnation['current_player']) === intval($current_player_id)
    ) {
      $result['reincarnated_card_id'] = $reincarnation['card_id'];
      $result['reincarnated_col'] = $reincarnation['col'];
    }

    // return this only end of the round
    if (
      $this->getStateName() === 'endRound' ||
      $this->getStateName() === 'gameEnd'
    ) {
      $sql =
        'SELECT ' .
        'score_round round, ' .
        'score_center_list center_list, ' .
        'score_day_list day_list, ' .
        'score_night_list night_list, ' .
        'score_winner winner' .
        ' FROM score ORDER BY score_round DESC LIMIT 1';
      $scores = self::getObjectFromDB($sql);
      if ($scores) {
        $result['score'] = [];
        $dayPlayerID = $this->getDayPlayerID();
        $nightPlayerID = $this->getNightPlayerID();
        $result['score']['center'] = explode(',', $scores['center_list']);
        $result['score'][$dayPlayerID] = explode(',', $scores['day_list']);
        $result['score'][$nightPlayerID] = explode(',', $scores['night_list']);
        $result['winner'] = explode(',', $scores['winner']);
      }
    }

    // return discard
    $discard = [];
    foreach ($this->getCardsInLocation('discard') as $card) {
      $location_arg = intval($card['location_arg']);
      if ($location_arg !== 0 && $location_arg !== intval($current_player_id)) {
        $discard[] = [
          'id' => '0',
          'type' => 'stealth',
          'type_arg' => '17',
          'location' => 'discard',
          'location_arg' => '0',
        ];
      } else {
        $discard[] = $card;
      }
    }
    $result['discarded'] = $discard;

    // identifier
    $result['player_side'] = $this->getPlayerSide($current_player_id);
    $result['player_id'] = intval($current_player_id);

    // player sides for observer
    $result['player_sides'] = [];
    foreach ($result['players'] as $playerID => $player) {
      $side = $this->getPlayerSide($playerID);
      $result['player_sides'][$side] = $playerID;
    }

    return $result;
  }

  /*
        getGameProgression:

        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).

        This method is called each time we are in a game state with the "updateGameProgression" property set to true
        (see states.inc.php)
    */
  function getGameProgression()
  {
    // sum up score / (number of players * (number of max score - 1) + 1)
    $sql = 'SELECT player_id id, player_score score FROM player ';
    $players = self::getCollectionFromDb($sql);
    $numOfPlayers = count($players);

    $maxScore = intval($this->getGameStateValue('max_score'));

    $totalScore = 0;
    foreach ($players as $k => $v) {
      $totalScore += intval($v['score']);
    }
    $pct = $totalScore / ($numOfPlayers * ($maxScore - 1) + 1);

    // use sqrt to adjust the progress
    $adjustedPct = sqrt($pct);
    $progress = $adjustedPct * 100;
    return $progress;
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////// Utility functions
  ////////////

  /*
        In this space, you can put any utility methods useful for your game logic
    */

  public function getStateName()
  {
    $state = $this->gamestate->state();
    return $state['name'];
  }

  function getDayPlayerID()
  {
    $players = self::getCollectionFromDb(
      'SELECT player_id id, player_no FROM player'
    );
    foreach ($players as $playerID => $player) {
      if ($player['player_no'] == 1) {
        return $player['id'];
      }
    }
  }

  function getNightPlayerID()
  {
    $players = self::getCollectionFromDb(
      'SELECT player_id id, player_no FROM player'
    );
    foreach ($players as $playerID => $player) {
      if ($player['player_no'] == 2) {
        return $player['id'];
      }
    }
  }

  function getPlayerSide($playerID)
  {
    $sql = "SELECT player_no from player where player_id='" . $playerID . "'";
    $playerNo = self::getUniqueValueFromDB($sql);

    if ($playerNo == 1) {
      return 'day';
    }
    if ($playerNo == 2) {
      return 'night';
    }

    // but actually an observer
    return 'day';
  }

  function getOppoID($playerID)
  {
    $sql =
      "SELECT player_id id FROM player WHERE player_id<>'" . $playerID . "'";
    $oppoID = self::getUniqueValueFromDB($sql);
    return $oppoID;
  }

  function getPlayerName($playerID)
  {
    return self::getUniqueValueFromDB(
      "SELECT player_name FROM player WHERE player_id='" . $playerID . "'"
    );
  }

  function isEnabledCard($card, $id)
  {
    if (str_contains($card['meta'], 'oracle')) {
      return false;
    }
    if (intval($card['type_arg']) === $id) {
      return true;
    }
    return false;
  }

  function accumulateTmpCenter($c, $lane, &$tmpCenter)
  {
    // 9: plague is the highest priority
    if ($this->isEnabledCard($c, 9)) {
      self::notifyAllPlayers(
        'score',
        clienttranslate(
          '[${lane_name} lane] location number is set to 0 by "La Plaga".'
        ),
        [
          'i18n' => ['lane_name'],
          'lane' => $lane,
          'lane_name' => $lane,
        ]
      );
      $tmpCenter['set0'] = true;
    }
    // 2: Justice
    if ($this->isEnabledCard($c, 2)) {
      self::notifyAllPlayers(
        'score',
        clienttranslate(
          '[${lane_name} lane] location number is increased by 1 by "Maat".'
        ),
        [
          'i18n' => ['lane_name'],
          'lane' => $lane,
          'lane_name' => $lane,
        ]
      );
      $tmpCenter['adjust'] += 1;
    }
    // 12: Shadow
    if ($this->isEnabledCard($c, 12)) {
      self::notifyAllPlayers(
        'score',
        clienttranslate(
          '[${lane_name} lane] location number is decreased by 2 by "El Libro de los Muertos".'
        ),
        [
          'i18n' => ['lane_name'],
          'lane' => $lane,
          'lane_name' => $lane,
        ]
      );
      $tmpCenter['adjust'] -= 2;
    }
  }

  function getNewCenterValue($tmpCenter)
  {
    $center = $tmpCenter['orig'];
    if ($tmpCenter['set0']) {
      $center = 0;
    }
    return $center + $tmpCenter['adjust'];
  }

  function getPower($c, $center, $lane)
  {
    $cardInfo = $this->card_types[intval($c['type_arg'])];

    $powerFixed = $cardInfo->powerFixed;
    $powerCenter = $cardInfo->powerCenter;

    if ($this->isEnabledCard($c, 4) && ($center >= 6 || $center <= 0)) {
      self::notifyAllPlayers(
        'score',
        clienttranslate(
          '[${lane_name} lane] "Apis" became power 15 since location is ${center}.'
        ),
        [
          'i18n' => ['lane_name'],
          'lane' => $lane,
          'lane_name' => $lane,
          'center' => $center,
        ]
      );
      return 15;
    }

    return $powerFixed + $powerCenter * $center;
  }

  // return true if game ended
  function addScore($playerID)
  {
    $playerName = $this->getPlayerName($playerID);

    $score = intval(
      self::getUniqueValueFromDB(
        "SELECT player_score score FROM player WHERE player_id='" .
          $playerID .
          "'"
      )
    );
    $updatedScore = $score + 1;
    self::DbQuery(
      "UPDATE player SET player_score='" .
        $updatedScore .
        "' WHERE player_id='" .
        $playerID .
        "'"
    );

    // notify to update the score
    self::notifyAllPlayers(
      'updateScore',
      clienttranslate('${playerName} dealt a damage.'),
      [
        'playerID' => $playerID,
        'playerName' => $playerName,
      ]
    );

    // check game end condition
    $maxScore = intval($this->getGameStateValue('max_score'));
    if ($updatedScore >= $maxScore) {
      return true;
    }

    return false;
  }

  function setLaneController($playerID, $lane)
  {
    $sql =
      "UPDATE center SET center_controller='" .
      $playerID .
      "' WHERE center_location='" .
      $lane .
      "'";
    self::DbQuery($sql);
  }

  // return true if game ended
  function hndlEvilAndAgent(
    int $wPlayerID,
    int $lPlayerID,
    int $hasEvil,
    int $hasAgent
  ) {
    if ($hasEvil) {
      if ($lPlayerID === $hasEvil) {
        // deal one damage!
        $playerName = $this->getPlayerName($lPlayerID);
        self::notifyAllPlayers(
          'score',
          clienttranslate('"Apofis" dealt 1 damage to ${playerName}.'),
          [
            'playerName' => $playerName,
          ]
        );
        if ($this->addScore($wPlayerID)) {
          return true;
        }
      }
    }
    if ($hasAgent) {
      if ($wPlayerID === $hasAgent) {
        // scores!
        $playerName = $this->getPlayerName($lPlayerID);
        self::notifyAllPlayers(
          'score',
          clienttranslate('"Bastet" dealt 1 damage to ${playerName}.'),
          [
            'playerName' => $playerName,
          ]
        );
        if ($this->addScore($wPlayerID)) {
          return true;
        }
      }
    }
    return false;
  }

  function getCardsInLocation($location)
  {
    $sql = 'SELECT ';
    $sql .= 'card_id id, ';
    $sql .= 'card_type type, ';
    $sql .= 'card_type_arg type_arg, ';
    $sql .= 'card_location location, ';
    $sql .= 'card_location_arg location_arg, ';
    $sql .= 'card_meta meta from cards ';
    $sql .= "WHERE card_location='" . $location . "'";
    return self::getObjectListFromDB($sql);
  }

  function getCard($cardID)
  {
    $sql = 'SELECT ';
    $sql .= 'card_id id, ';
    $sql .= 'card_type type, ';
    $sql .= 'card_type_arg type_arg, ';
    $sql .= 'card_location location, ';
    $sql .= 'card_location_arg location_arg, ';
    $sql .= 'card_meta meta from cards ';
    $sql .= "WHERE card_id='" . $cardID . "'";
    return self::getObjectFromDB($sql);
  }

  function getLaneFromGridID($gridID)
  {
    $col = intval($gridID) % 3;
    switch ($col) {
      case 0:
        return 'left';
      case 1:
        return 'center';
      case 2:
        return 'right';
    }
    return '';
  }

  function isValidPlayGrid($gridID, $playerID)
  {
    $sql =
      'SELECT count(*) FROM cards ' .
      "WHERE card_location='table" .
      $playerID .
      "' AND card_location_arg='" .
      $gridID .
      "'";
    $cnt = intval(self::getUniqueValueFromDB($sql));
    if ($cnt > 0) {
      return false;
    }
    // check reincarnation col
    $sql = 'SELECT reincarnation_col FROM reincarnation';
    $reincarnationCol = self::getUniqueValueFromDB($sql);
    if ($reincarnationCol != null) {
      $reincarnationCol = intval($reincarnationCol);
      if (intval($gridID) % 3 !== $reincarnationCol) {
        return false;
      }
    }
    return true;
  }

  function applyWatcherEffect(
    $cardName,
    $playerID,
    $oppoID,
    $targetGridID,
    $targetGridSide
  ) {
    if ($targetGridID === null) {
      // allow only if there is no valid target
      $sql = "SELECT card_type_arg type_arg FROM cards WHERE card_meta=''";
      $types = self::getObjectListFromDB($sql);
      foreach ($types as $t) {
        $cardInfo = $this->card_types[intval($t)];
        if ($cardInfo->stealth) {
          self::notifyPlayer($playerID, 'logError', '', [
            'message' => clienttranslate(
              'Invalid target selection! You must select a target.'
            ),
          ]);
          return false;
        }
      }
      return true;
    }

    // target player
    $targetPlayerID = $playerID;
    if ($targetGridSide != 'player') {
      $targetPlayerID = $oppoID;
    }

    // check if the target is valid = not disabled stealth
    $sql =
      "SELECT card_type_arg type_arg, card_meta meta FROM cards WHERE card_location_arg='" .
      $targetGridID .
      "' AND card_location='table" .
      $targetPlayerID .
      "'";
    $tc = self::getObjectFromDB($sql);
    if (!$this->card_types[intval($tc['type_arg'])]->stealth || $tc['meta']) {
      self::notifyPlayer($playerID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid target selection! You cannot choose non stealth target.'
        ),
      ]);
      return false;
    }

    $this->applyMetaChange(
      $cardName,
      $playerID,
      $oppoID,
      $targetGridID,
      $targetGridSide
    );

    return true;
  }

  // resolve effect of oracle / eclipse
  function applyOracleEffect(
    $cardName,
    $playerID,
    $oppoID,
    $gridID,
    $targetGridID,
    $targetGridSide
  ) {
    if ($targetGridID === null) {
      // oracle never has no target
      self::notifyPlayer($playerID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid target selection! You must select a target.'
        ),
      ]);
      return false;
    }

    // check if target is in the same lane
    if (intval($gridID) % 3 !== intval($targetGridID) % 3) {
      self::notifyPlayer($playerID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid target selection! You cannot select a target in differen lane.'
        ),
      ]);
      return false;
    }

    $this->applyMetaChange(
      $cardName,
      $playerID,
      $oppoID,
      $targetGridID,
      $targetGridSide
    );

    return true;
  }

  function applyMetaChange(
    $cardName,
    $playerID,
    $oppoID,
    $targetGridID,
    $targetGridSide
  ) {
    // target player
    $targetPlayerID = $playerID;
    if ($targetGridSide != 'player') {
      $targetPlayerID = $oppoID;
    }

    // get card info
    $sql =
      "SELECT card_id FROM cards WHERE card_location_arg='" .
      intval($targetGridID) .
      "' AND card_location='table" .
      $targetPlayerID .
      "'";
    // query fails when oracle targeted itself since it is not yet on table
    $targetCardID = self::getUniqueValueFromDB($sql);
    if (!$targetCardID && $cardName === 'oracle') {
      $sql = 'SELECT card_id FROM cards WHERE card_type_arg=0';
      $targetCardID = self::getUniqueValueFromDB($sql);
    }
    $targetCardInfo = $this->getCard($targetCardID);

    // append meta
    $sql = "SELECT card_meta FROM cards WHERE card_id='" . $targetCardID . "'";
    $meta = self::getUniqueValueFromDB($sql);
    $meta .= $cardName . ',';
    $sql =
      "UPDATE cards SET card_meta='" .
      $meta .
      "' WHERE card_id='" .
      $targetCardID .
      "'";
    self::DbQuery($sql);
    $targetCardInfo['meta'] = $meta;

    // reveal notification
    $msg = clienttranslate(
      '"Anubis" disabled stealth and ability of "${card_name}".'
    );
    if ($cardName === 'watcher') {
      $msg = clienttranslate('"Ra" disabled stealth of "${card_name}".');
    }
    $cardDef = $this->card_types[intval($targetCardInfo['type_arg'])];
    self::notifyAllPlayers('updateCard', $msg, [
      'i18n' => ['card_name'],
      'player_id' => $targetPlayerID,
      'player_name' => $this->getPlayerName($targetPlayerID),
      'card' => $targetCardInfo,
      'card_name' => $cardDef->name,
      'gridID' => intval($targetGridID),
      'playerSide' => $this->getPlayerSide($targetPlayerID),
    ]);
  }

  function applyMazeEffect(
    $playerID,
    $oppoID,
    $gridID,
    $targetGridID,
    $targetGridSide,
    $targetCol
  ) {
    if ($targetGridID === null || $targetCol === null) {
      // allow if there is no stealth unit (without meta)
      $loc1 = intval($targetGridID);
      $loc2 = $loc1 > 2 ? $loc1 + 3 : $loc1 - 3;
      $sql =
        "SELECT card_type_arg type_arg FROM cards WHERE card_meta='' AND (card_location_arg='" .
        $loc1 .
        "' OR card_location_arg='" .
        $loc2 .
        "')";
      $types = self::getObjectListFromDB($sql);
      foreach ($types as $t) {
        $cardInfo = $this->card_types[intval($t)];
        if ($cardInfo->stealth) {
          self::notifyPlayer($playerID, 'logError', '', [
            'message' => clienttranslate(
              'Invalid target selection! You must select a target / target column.'
            ),
          ]);
          return false;
        }
      }
      return true;
    }

    // target player
    $targetPlayerID = $playerID;
    if ($targetGridSide != 'player') {
      $targetPlayerID = $oppoID;
    }

    // check if target is in the same lane
    if (intval($gridID) % 3 !== intval($targetGridID) % 3) {
      self::notifyPlayer($playerID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid target selection! You cannot select a target in a different lane.'
        ),
      ]);
      return false;
    }

    // check if the target is valid = not disabled stealth
    $sql =
      "SELECT card_type_arg type_arg, card_meta meta FROM cards WHERE card_location_arg='" .
      $targetGridID .
      "' AND card_location='table" .
      $targetPlayerID .
      "'";
    $tc = self::getObjectFromDB($sql);
    if (!$this->card_types[intval($tc['type_arg'])]->stealth || $tc['meta']) {
      self::notifyPlayer($playerID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid target selection! You cannot choose non stealth target.'
        ),
      ]);
      return false;
    }

    // get card info
    $sql =
      "SELECT card_id FROM cards WHERE card_location_arg='" .
      intval($targetGridID) .
      "' AND card_location='table" .
      $targetPlayerID .
      "'";
    $targetCardID = self::getUniqueValueFromDB($sql);
    $targetCardInfo = $this->getCard($targetCardID);

    // find the grid ID
    $lID1 = $targetCol;
    $lID2 = $targetCol + 3;
    $sql =
      "SELECT count(*) FROM cards WHERE (card_location_arg='" .
      $lID1 .
      "' OR card_location_arg='" .
      $lID2 .
      "') AND card_location='table" .
      $targetPlayerID .
      "'";
    $numOfCards = intval(self::getUniqueValueFromDB($sql));
    if ($numOfCards > 1) {
      self::notifyPlayer($playerID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid destination! You cannot select this column.'
        ),
      ]);
      return;
    }
    $gridID = $targetCol + $numOfCards * 3;

    // move card
    $this->cards->moveCard($targetCardID, 'table' . $targetPlayerID, $gridID);
    $targetCardInfo['location_arg'] = $gridID;

    // move notification
    $msg = clienttranslate('"Heka" moved a stealth card from ${from_lane_name} lane to ${to_lane_name} lane.');
    self::notifyAllPlayers('moveCard', $msg, [
      'i18n' => ['from_lane_name', 'to_lane_name'],
      'player_id' => $targetPlayerID,
      'player_name' => $this->getPlayerName($targetPlayerID),
      'fromGridID' => $targetGridID,
      'toGridID' => $gridID,
      'from_lane_name' => $this->getLaneFromGridID($targetGridID),
      'to_lane_name' => $this->getLaneFromGridID($gridID),
    ]);

    return true;
  }

  function applyReincarnationEffect(
    $playerID,
    $oppoID,
    $gridID,
    $targetGridID,
    $targetGridSide
  ) {
    if ($targetGridID === null) {
      // reincarnation never has no target
      self::notifyPlayer($playerID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid target selection! You must select a target.'
        ),
      ]);
      return false;
    }

    // check if target is in the same lane
    if (intval($gridID) % 3 !== intval($targetGridID) % 3) {
      self::notifyPlayer($playerID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid target selection! You cannot select a target in differen lane.'
        ),
      ]);
      return false;
    }

    // target player
    $targetPlayerID = $playerID;
    $nonTargetPlayerID = $playerID;
    if ($targetGridSide != 'player') {
      $targetPlayerID = $oppoID;
    } else {
      $nonTargetPlayerID = $oppoID;
    }

    // check if target is valid = non-stealth / disabled stealth
    $sql =
      "SELECT card_type_arg type_arg, card_meta meta FROM cards WHERE card_location_arg='" .
      $targetGridID .
      "' AND card_location='table" .
      $targetPlayerID .
      "'";
    $tc = self::getObjectFromDB($sql);
    if ($this->card_types[intval($tc['type_arg'])]->stealth && !$tc['meta']) {
      self::notifyPlayer($playerID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid target selection! You cannot choose stealth target.'
        ),
      ]);
      return false;
    }

    // target col
    $targetCol = intval($targetGridID);
    if ($targetCol > 2) {
      $targetCol = $targetCol - 3;
    }

    // Check if the card in the grid is non-stealth
    $sql =
      "SELECT card_id id, card_type_arg type_arg, card_meta meta FROM cards WHERE card_location='table" .
      $targetPlayerID .
      "' AND card_location_arg='" .
      $targetGridID .
      "'";
    $targetCard = self::getObjectFromDB($sql);
    $targetCardInfo = $this->card_types[intval($targetCard['type_arg'])];
    if (!$targetCard['meta'] && $targetCardInfo->stealth) {
      self::notifyPlayer($playerID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid target selection! You cannot select a stealth unit.'
        ),
      ]);
      return false;
    }

    // remove card from a table
    $this->cards->moveCard($targetCard['id'], 'discard', 0);
    $oldCard = $this->getCard($targetCard['id']);
    $newCard = $this->cards->pickCard('deck', $targetPlayerID);
    $msg = clienttranslate('"Isis" removed "${card_name}".');
    // this cannot be AllPlayers
    self::notifyPlayer($targetPlayerID, 'reincarnateCard', $msg, [
      'i18n' => ['card_name'],
      'player_id' => $targetPlayerID,
      'player_name' => $this->getPlayerName($targetPlayerID),
      'gridID' => $targetGridID,
      'col' => $targetCol,
      'card_name' => $targetCardInfo->name,
      'card' => $newCard,
      'discarded' => $oldCard,
    ]);
    self::notifyPlayer($nonTargetPlayerID, 'reincarnateCard', $msg, [
      'i18n' => ['card_name'],
      'player_id' => $targetPlayerID,
      'player_name' => $this->getPlayerName($targetPlayerID),
      'gridID' => $targetGridID,
      'card_name' => $targetCardInfo->name,
      'discarded' => $oldCard,
    ]);

    // Update reincarnation table
    $currentPlayerID = $playerID;
    $nextPlayerID = $oppoID;
    if (intval($playerID) !== intval($targetPlayerID)) {
      $currentPlayerID = $oppoID;
    }
    $sql =
      'INSERT INTO reincarnation (' .
      'reincarnation_card_id, reincarnation_col, reincarnation_current_player, reincarnation_next_player' .
      ") VALUES ('" .
      $newCard['id'] .
      "', '" .
      $targetCol .
      "', '" .
      $currentPlayerID .
      "', '" .
      $nextPlayerID .
      "');";
    self::DbQuery($sql);
    return true;
  }

  function notifyScore($msg, $lane, $scores, $wPlayerID)
  {
    $p1 = self::getActivePlayerId();
    $p1Name = $this->getPlayerName($p1);
    $p2 = $this->getOppoID($p1);
    $p2Name = $this->getPlayerName($p2);
    $wPlayerName = null;
    if (intval($wPlayerID) === intval($p1)) {
      $wPlayerName = $p1Name;
    }
    if (intval($wPlayerID) === intval($p2)) {
      $wPlayerName = $p2Name;
    }

    self::notifyPlayer($p1, 'score', $msg, [
      'i18n' => ['lane_name'],
      'lane' => $lane,
      'lane_name' => $lane,
      'scoreA' => $scores[$p2],
      'scoreB' => $scores[$p1],
      'wPlayerName' => $wPlayerName,
      'w_player_id' => $wPlayerID,
    ]);

    self::notifyPlayer($p2, 'score', $msg, [
      'i18n' => ['lane_name'],
      'lane' => $lane,
      'lane_name' => $lane,
      'scoreA' => $scores[$p1],
      'scoreB' => $scores[$p2],
      'wPlayerName' => $wPlayerName,
      'w_player_id' => $wPlayerID,
    ]);
  }

  function isObserver()
  {
    $playerID = $this->getCurrentPlayerId();
    $sql = "SELECT count(*) FROM player where player_id='" . $playerID . "'";
    $cnt = intval(self::getUniqueValueFromDB($sql));
    if ($cnt === 0) {
      return true;
    }
    return false;
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////// Player actions
  ////////////

  /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in sunrisesunset.action.php)
    */

  function mulligan($cardID)
  {
    self::checkAction('mulligan');

    $playerID = intval(self::getActivePlayerId());

    $sql = 'SELECT round_side FROM round';
    $round_side = self::getUniqueValueFromDB($sql);

    // day
    $sql = 'SELECT card_location_arg FROM cards WHERE card_type_arg=14';
    $dayPlayerID = intval(self::getUniqueValueFromDB($sql));

    // night
    $sql = 'SELECT card_location_arg FROM cards WHERE card_type_arg=13';
    $nightPlayerID = intval(self::getUniqueValueFromDB($sql));

    // something is wrong around here
    $oppoID = $playerID !== $dayPlayerID ? $dayPlayerID : $nightPlayerID;

    if (!$cardID) {
      self::notifyAllPlayers(
        'mulligan',
        clienttranslate('${player_name} chose not to discard a card.'),
        [
          'player_name' => self::getActivePlayerName(),
        ]
      );
    } else {
      $sql = 'SELECT round_num FROM round';
      $round_num = intval(self::getUniqueValueFromDB($sql));
      $cardInfo = $this->getCard($cardID);
      $cardDef = $this->card_types[intval($cardInfo['type_arg'])];

      // check if it is creeps
      if (
        intval($cardInfo['type_arg']) === 13 ||
        intval($cardInfo['type_arg']) === 14
      ) {
        self::notifyPlayer(
          $playerID,
          'logError',
          clienttranslate('"Horus/Seth" cannot be discarded.'),
          []
        );
        return;
      }

      // check if it is in the hand
      $sql =
        "SELECT count(*) FROM cards WHERE card_location='hand' AND card_location_arg='" .
        $playerID .
        "'";
      if (!intval(self::getUniqueValueFromDB($sql))) {
        self::notifyPlayer(
          $playerID,
          'logError',
          clienttranslate(
            'The chosen card is not in your hand, reload the page.'
          ),
          []
        );
        return;
      }

      // discard and draw a card
      $newCard = $this->cards->pickCard('deck', $playerID);
      if ($round_num === 1 && $playerID === $dayPlayerID) {
        $this->cards->moveCard($cardID, 'discard', $playerID);
      } else {
        $this->cards->moveCard($cardID, 'discard', 0);
      }
      $oldCard = $this->getCard($cardID);

      if ($round_num === 1 && $playerID === $dayPlayerID) {
        // for the first round of day player, do not reveal the card
        self::notifyPlayer(
          $playerID,
          'mulligan',
          clienttranslate('${player_name} discarded "${card_name}" face down.'),
          [
            'i18n' => ['card_name'],
            'player_name' => self::getActivePlayerName(),
            'card_name' => $cardDef->name,
            'card' => $newCard,
            'discarded' => $oldCard,
          ]
        );
        self::notifyPlayer(
          $oppoID,
          'mulligan',
          clienttranslate('${player_name} discarded a card face down.'),
          [
            'player_name' => self::getActivePlayerName(),
            'discarded' => [
              'id' => '0',
              'type' => 'stealth',
              'type_arg' => '17',
              'location' => 'discard',
            ],
          ]
        );
      } else {
        self::notifyPlayer(
          $playerID,
          'mulligan',
          clienttranslate('${player_name} discarded "${card_name}".'),
          [
            'i18n' => ['card_name'],
            'player_name' => self::getActivePlayerName(),
            'card_name' => $cardDef->name,
            'card' => $newCard,
            'discarded' => $oldCard,
          ]
        );
        self::notifyPlayer(
          $oppoID,
          'mulligan',
          clienttranslate('${player_name} discarded "${card_name}".'),
          [
            'i18n' => ['card_name'],
            'player_name' => self::getActivePlayerName(),
            'card_name' => $cardDef->name,
            'discarded' => $oldCard,
          ]
        );
      }
    }

    if (
      ($round_side === 'day' && $playerID !== $dayPlayerID) ||
      ($round_side === 'night' && $playerID !== $nightPlayerID)
    ) {
      $this->gamestate->nextState('nextPlayer');
      return;
    }

    $this->gamestate->nextState('mulliganNextPlayer');
    return;
  }

  function playCard(
    $cardID,
    $gridID,
    $targetGridID,
    $targetGridSide,
    $targetCol
  ) {
    self::checkAction('playCard');

    $cardInfo = $this->getCard($cardID);
    $actorID = self::getActivePlayerId();
    $oppoID = $this->getOppoID($actorID);

    if (!$cardInfo) {
      self::notifyPlayer($actorID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid card selection! You cannot choose it.'
        ),
      ]);
      return;
    }

    if (
      $cardInfo['location'] != 'hand' ||
      $cardInfo['location_arg'] != $actorID
    ) {
      self::notifyPlayer($actorID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid card selection! You cannot choose it.'
        ),
      ]);
      return;
    }

    // check if the card is playable
    if (!$this->isValidPlayGrid($gridID, $actorID)) {
      self::notifyPlayer($actorID, 'logError', '', [
        'message' => clienttranslate(
          'Invalid card selection! You cannot choose it.'
        ),
      ]);
      return;
    }

    // oracle
    if (intval($cardInfo['type_arg']) === 0) {
      if (
        !$this->applyOracleEffect(
          'oracle',
          $actorID,
          $oppoID,
          $gridID,
          $targetGridID,
          $targetGridSide
        )
      ) {
        // invalid target
        return;
      }
    }

    // watcher
    if (intval($cardInfo['type_arg']) === 5) {
      if (
        !$this->applyWatcherEffect(
          'watcher',
          $actorID,
          $oppoID,
          $targetGridID,
          $targetGridSide
        )
      ) {
        // invalid target
        return;
      }
    }

    // maze
    if (intval($cardInfo['type_arg']) === 8) {
      if (
        !$this->applyMazeEffect(
          $actorID,
          $oppoID,
          $gridID,
          $targetGridID,
          $targetGridSide,
          $targetCol
        )
      ) {
        // invalid target
        return;
      }
    }

    $this->cards->moveCard($cardID, 'table' . $actorID, $gridID);

    $numberOfcards = $this->cards->countCardInLocation('hand', $actorID);

    $c = $this->card_types[intval($cardInfo['type_arg'])];
    if ($c->stealth) {
      self::notifyPlayer(
        $actorID,
        'playCard',
        clienttranslate(
          '${player_name} played "${card_name}" (stealth) at ${lane_name} lane.'
        ),
        [
          'i18n' => ['lane_name'],
          'player_id' => $actorID,
          'player_name' => self::getActivePlayerName(),
          'card' => $cardInfo,
          'card_name' => $c->name,
          'cards' => $numberOfcards,
          'gridID' => $gridID,
          'ignoreActivePlayer' => false,
          'lane' => $this->getLaneFromGridID($gridID),
          'lane_name' => $this->getLaneFromGridID($gridID),
        ]
      );

      self::notifyAllPlayers(
        'playCard',
        clienttranslate(
          '${player_name} played a stealth card at ${lane_name} lane.'
        ),
        [
          'i18n' => ['lane_name'],
          'player_id' => $actorID,
          'player_name' => self::getActivePlayerName(),
          'card' => [
            'id' => '0',
            'type' => 'stealth',
            'type_arg' => '17',
            'location' => $cardInfo['location'],
            'location_arg' => $cardInfo['location_arg'],
          ],
          'cards' => $numberOfcards,
          'gridID' => $gridID,
          'ignoreActivePlayer' => true,
          'playerSide' => $this->getPlayerSide($actorID),
          'lane' => $this->getLaneFromGridID($gridID),
          'lane_name' => $this->getLaneFromGridID($gridID),
        ]
      );
    } else {
      self::notifyAllPlayers(
        'playCard',
        clienttranslate(
          '${player_name} played "${card_name}" at ${lane_name} lane.'
        ),
        [
          'i18n' => ['lane_name'],
          'player_id' => $actorID,
          'player_name' => self::getActivePlayerName(),
          'card' => $cardInfo,
          'card_name' => $c->name,
          'cards' => $numberOfcards,
          'gridID' => $gridID,
          'ignoreActivePlayer' => false,
          'playerSide' => $this->getPlayerSide($actorID),
          'lane' => $this->getLaneFromGridID($gridID),
          'lane_name' => $this->getLaneFromGridID($gridID),
        ]
      );
    }

    // reincarnation
    if (intval($cardInfo['type_arg']) === 1) {
      if (
        !$this->applyReincarnationEffect(
          $actorID,
          $oppoID,
          $gridID,
          $targetGridID,
          $targetGridSide
        )
      ) {
        // invalid target (suppose not happen)
        return;
      }
      $this->gamestate->nextState('reincarnation');
      return;
    }

    $this->gamestate->nextState('nextPlayer');
  }

  function endRoundConfirm()
  {
    self::checkAction('endRoundConfirm');
    $this->gamestate->setPlayerNonMultiactive(
      $this->getCurrentPlayerId(),
      'roundSetup'
    );
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////// Game state arguments
  ////////////

  /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

  //////////////////////////////////////////////////////////////////////////////
  //////////// Game state actions
  ////////////

  /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */

  function stRoundSetup()
  {
    $sql = 'SELECT round_side, round_num FROM round';
    $round = self::getObjectFromDB($sql);
    $round_side = $round['round_side'];
    $round_num = intval($round['round_num']) + 1;

    if ($round_side != 'day') {
      // either day or '' (initial)
      self::DbQuery(
        "UPDATE round SET round_side='day', round_num=" . $round_num
      );
      $round_side = 'day';
    } else {
      self::DbQuery(
        "UPDATE round SET round_side='night', round_num=" . $round_num
      );
      $round_side = 'night';
    }

    // this is needed for new round (not the initial)
    $this->cards->moveAllCardsInLocation(null, 'deck');
    $this->cards->shuffle('deck');

    // clear card meta
    $sql = "UPDATE cards SET card_meta = ''";
    self::DbQuery($sql);

    $players = self::getCollectionFromDb(
      'SELECT player_id id, player_no FROM player'
    );
    // deal appropriate creep
    $allCards = array_values($this->cards->getCardsInLocation('deck'));

    $creepDay = null;
    $creepNgt = null;
    foreach ($allCards as $val) {
      if ($val['type_arg'] == 13) {
        $creepNgt = $val;
      }
      if ($val['type_arg'] == 14) {
        $creepDay = $val;
      }
    }
    foreach ($players as $playerID => $player) {
      if ($player['player_no'] == 1) {
        $this->cards->moveCard($creepDay['id'], 'hand', $playerID);
      }
      if ($player['player_no'] == 2) {
        $this->cards->moveCard($creepNgt['id'], 'hand', $playerID);
      }
    }

    foreach ($players as $playerID => $value) {
      $this->cards->pickCards(5, 'deck', $playerID);
    }

    // return number of cards in the hand
    foreach ($players as $key => $value) {
      $player_id = $key;
      $count = count($this->cards->getCardsInLocation('hand', $player_id));
      $players[$key]['cards'] = $count;
    }

    // return center controller data
    $sql =
      'SELECT center_location location, center_controller controller FROM center';
    $center = self::getCollectionFromDb($sql);

    self::notifyAllPlayers('newRound', clienttranslate('New round started'), [
      'players' => $players,
      'day_or_night' => $round_side,
      'center' => $center,
      'round' => $round_num,
    ]);

    foreach ($players as $key => $value) {
      $player_id = $key;
      $player_cards = array_values(
        $this->cards->getCardsInLocation('hand', $player_id)
      );

      self::notifyPlayer(
        $player_id,
        'newHand',
        clienttranslate('Received new hand'),
        [
          'player_cards' => $player_cards,
        ]
      );
    }

    $actorID = self::getActivePlayerId();
    if (!$actorID) {
      $this->activeNextPlayer();
    } else {
      # activate day / night based player
      // 13 (night) / 14 (day)
      $creep = 14;
      if ($round_side === 'night') {
        $creep = 13;
      }
      $sql =
        'SELECT card_location_arg active_player FROM cards WHERE card_type_arg=' .
        $creep;
      $active_player = self::getUniqueValueFromDB($sql);
      $this->gamestate->changeActivePlayer($active_player);
      $this->gamestate->nextState('mulliganTurn');
    }
  }

  function stNextPlayer()
  {
    $allData = self::getAllDatas();

    foreach ($allData['players'] as $playerID => $player) {
      // if any player has a card, go next player
      if ($this->cards->countCardInLocation('hand', $playerID) > 0) {
        // clear reincarnation table
        $sql =
          'SELECT reincarnation_next_player next_player FROM reincarnation';
        $nextPlayer = self::getUniqueValueFromDB($sql);
        if ($nextPlayer) {
          $sql = 'DELETE FROM reincarnation';
          self::DbQuery($sql);
          $this->gamestate->changeActivePlayer($nextPlayer);
          self::giveExtraTime($nextPlayer);
          $this->gamestate->nextState('playerTurn');
        } else {
          $playerID = self::activeNextPlayer();
          self::giveExtraTime($playerID);
          $this->gamestate->nextState('playerTurn');
        }

        return;
      }
    }

    // clear reincarnation table
    $sql = 'DELETE FROM reincarnation';
    self::DbQuery($sql);

    $this->gamestate->nextState('endRound');
  }

  function stReincarnationNextPlayer()
  {
    $sql =
      'select reincarnation_current_player current_player, reincarnation_next_player next_player from reincarnation';
    $reincarnation = self::getObjectFromDB($sql);
    $this->gamestate->changeActivePlayer($reincarnation['current_player']);
    self::giveExtraTime($reincarnation['current_player']);
    $this->gamestate->nextState('reincarnationTurn');
  }

  function stMulliganNextPlayer()
  {
    $playerID = self::activeNextPlayer();
    $this->gamestate->nextState('mulliganTurn');
  }

  function stEndRound()
  {
    $allData = self::getAllDatas();

    $result = [
      'score' => [],
      'table' => [],
    ];

    // set default center value
    $result['score']['center'] = [2, 3, 6];
    $sql = 'SELECT round_side FROM round';
    $round_side = self::getUniqueValueFromDB($sql);
    if ($round_side == 'night') {
      $result['score']['center'] = [1, 4, 5];
    }

    // get the controller (player) for each center
    $sql =
      'SELECT center_location location, center_controller controller FROM center';
    $centerCtrler = self::getCollectionFromDb($sql);

    // get all cards on table
    $tableCards = [];
    foreach ($allData['players'] as $playerID => $player) {
      $tableCards[$playerID] = array_values(
        $this->getCardsInLocation('table' . $playerID)
      );
    }

    // update center value
    $tmpCenters = [
      [
        'orig' => $result['score']['center'][0],
        'set0' => false,
        'adjust' => 0,
      ],
      [
        'orig' => $result['score']['center'][1],
        'set0' => false,
        'adjust' => 0,
      ],
      [
        'orig' => $result['score']['center'][2],
        'set0' => false,
        'adjust' => 0,
      ],
    ];
    foreach ($allData['players'] as $playerID => $player) {
      foreach ($tableCards[$playerID] as $c) {
        $posID = $c['location_arg'];

        switch ($posID) {
          case 0:
            $this->accumulateTmpCenter($c, 'left', $tmpCenters[0]);
            break;
          case 1:
            $this->accumulateTmpCenter($c, 'center', $tmpCenters[1]);
            break;
          case 2:
            $this->accumulateTmpCenter($c, 'right', $tmpCenters[2]);
            break;
          case 3:
            $this->accumulateTmpCenter($c, 'left', $tmpCenters[0]);
            break;
          case 4:
            $this->accumulateTmpCenter($c, 'center', $tmpCenters[1]);
            break;
          case 5:
            $this->accumulateTmpCenter($c, 'right', $tmpCenters[2]);
            break;
        }
      }
    }
    $result['score']['center'][0] = $this->getNewCenterValue($tmpCenters[0]);
    $result['score']['center'][1] = $this->getNewCenterValue($tmpCenters[1]);
    $result['score']['center'][2] = $this->getNewCenterValue($tmpCenters[2]);

    // lane data (total score for each lane)
    $laneScore = [];
    $hasEclipse = [false, false, false];
    $hasTitan = [false, false, false];
    $hasEvil = [0, 0, 0];
    $hasAgent = [0, 0, 0];

    foreach ($allData['players'] as $playerID => $player) {
      $tmpResult = [];

      foreach ($tableCards[$playerID] as $c) {
        $posID = $c['location_arg'];

        // 0 - 1 - 2
        // 3 - 4 - 5
        switch ($posID) {
          case 0:
            $center = $result['score']['center'][0];
            $tmpResult[$posID] = $this->getPower($c, $center, 'left');
            $hasEclipse[0] = $hasEclipse[0] || $this->isEnabledCard($c, 7);
            $hasTitan[0] = $hasTitan[0] || $this->isEnabledCard($c, 10);
            if (!$hasEvil[0]) {
              $hasEvil[0] = $this->isEnabledCard($c, 3) ? $playerID : false;
            }
            if (!$hasAgent[0]) {
              $hasAgent[0] = $this->isEnabledCard($c, 11) ? $playerID : false;
            }
            break;
          case 1:
            $center = $result['score']['center'][1];
            $tmpResult[$posID] = $this->getPower($c, $center, 'center');
            $hasEclipse[1] = $hasEclipse[1] || $this->isEnabledCard($c, 7);
            $hasTitan[1] = $hasTitan[1] || $this->isEnabledCard($c, 10);
            if (!$hasEvil[1]) {
              $hasEvil[1] = $this->isEnabledCard($c, 3) ? $playerID : false;
            }
            if (!$hasAgent[1]) {
              $hasAgent[1] = $this->isEnabledCard($c, 11) ? $playerID : false;
            }
            break;
          case 2:
            $center = $result['score']['center'][2];
            $tmpResult[$posID] = $this->getPower($c, $center, 'right');
            $hasEclipse[2] = $hasEclipse[2] || $this->isEnabledCard($c, 7);
            $hasTitan[2] = $hasTitan[2] || $this->isEnabledCard($c, 10);
            if (!$hasEvil[2]) {
              $hasEvil[2] = $this->isEnabledCard($c, 3) ? $playerID : false;
            }
            if (!$hasAgent[2]) {
              $hasAgent[2] = $this->isEnabledCard($c, 11) ? $playerID : false;
            }
            break;
          case 3:
            $center = $result['score']['center'][0];
            $tmpResult[$posID] = $this->getPower($c, $center, 'left');
            $hasEclipse[0] = $hasEclipse[0] || $this->isEnabledCard($c, 7);
            $hasTitan[0] = $hasTitan[0] || $this->isEnabledCard($c, 10);
            if (!$hasEvil[0]) {
              $hasEvil[0] = $this->isEnabledCard($c, 3) ? $playerID : false;
            }
            if (!$hasAgent[0]) {
              $hasAgent[0] = $this->isEnabledCard($c, 11) ? $playerID : false;
            }
            break;
          case 4:
            $center = $result['score']['center'][1];
            $tmpResult[$posID] = $this->getPower($c, $center, 'center');
            $hasEclipse[1] = $hasEclipse[1] || $this->isEnabledCard($c, 7);
            $hasTitan[1] = $hasTitan[1] || $this->isEnabledCard($c, 10);
            if (!$hasEvil[1]) {
              $hasEvil[1] = $this->isEnabledCard($c, 3) ? $playerID : false;
            }
            if (!$hasAgent[1]) {
              $hasAgent[1] = $this->isEnabledCard($c, 11) ? $playerID : false;
            }
            break;
          case 5:
            $center = $result['score']['center'][2];
            $tmpResult[$posID] = $this->getPower($c, $center, 'right');
            $hasEclipse[2] = $hasEclipse[2] || $this->isEnabledCard($c, 7);
            $hasTitan[2] = $hasTitan[2] || $this->isEnabledCard($c, 10);
            if (!$hasEvil[2]) {
              $hasEvil[2] = $this->isEnabledCard($c, 3) ? $playerID : false;
            }
            if (!$hasAgent[2]) {
              $hasAgent[2] = $this->isEnabledCard($c, 11) ? $playerID : false;
            }
            break;
        }
      }
      $result['score'][$playerID] = $tmpResult;
      $result['table'][$playerID] = array_values(
        $this->getCardsInLocation('table' . $playerID)
      );

      // update center controller
      $gameEnded = false;
      $winLose = [];
      if (count($laneScore) == 0) {
        $laneScore[0] = $tmpResult[0] + $tmpResult[3];
        $laneScore[1] = $tmpResult[1] + $tmpResult[4];
        $laneScore[2] = $tmpResult[2] + $tmpResult[5];
        $laneScore['player'] = $playerID;
      } else {
        $playerID2 = $laneScore['player'];
        foreach ($laneScore as $pos => $score2) {
          if ($pos === 'player') {
            continue;
          }

          $lane = 'left';
          if ($pos == 1) {
            $lane = 'center';
          }
          if ($pos == 2) {
            $lane = 'right';
          }

          $score1 = $tmpResult[$pos] + $tmpResult[$pos + 3];
          $scores = [];
          $scores[$playerID] = $score1;
          $scores[$playerID2] = $score2;

          if ($score2 == $score1) {
            $this->notifyScore(
              clienttranslate('[${lane_name} lane] ${scoreA} vs ${scoreB}. Drawn.'),
              $lane,
              $scores,
              'tie'
            );
            $winLose[$pos] = 0;
            continue;
          }

          if ($hasEclipse[$pos] && abs($score2 - $score1) >= 4) {
            $this->notifyScore(
              clienttranslate(
                '[${lane_name} lane] ${scoreA} vs ${scoreB}. Drawn (drawn by "Eclipse").'
              ),
              $lane,
              $scores,
              'tie'
            );
            $winLose[$pos] = 0;
            continue;
          }

          if (
            (!$hasTitan[$pos] && $score2 < $score1) ||
            ($hasTitan[$pos] && $score2 > $score1)
          ) {
            if ($hasTitan[$pos]) {
              $this->notifyScore(
                clienttranslate(
                  '[${lane_name} lane] ${scoreA} vs ${scoreB}. ${wPlayerName} won. (lower won due to "Osiris").'
                ),
                $lane,
                $scores,
                $playerID
              );
              $winLose[$pos] = $playerID;
            } else {
              $this->notifyScore(
                clienttranslate(
                  '[${lane_name} lane] ${scoreA} vs ${scoreB}. ${wPlayerName} won.'
                ),
                $lane,
                $scores,
                $playerID
              );
              $winLose[$pos] = $playerID;
            }
            if (
              $this->hndlEvilAndAgent(
                $playerID,
                $playerID2,
                $hasEvil[$pos],
                $hasAgent[$pos]
              )
            ) {
              $gameEnded = true;
              break;
            }
            if (intval($centerCtrler[$lane]['controller']) === $playerID) {
              if ($this->addScore($playerID)) {
                $gameEnded = true;
                break;
              }
            } else {
              $this->setLaneController($playerID, $lane);
            }
          }

          if (
            (!$hasTitan[$pos] && $score2 > $score1) ||
            ($hasTitan[$pos] && $score2 < $score1)
          ) {
            if ($hasTitan[$pos]) {
              $this->notifyScore(
                clienttranslate(
                  '[${lane_name} lane] ${scoreA} vs ${scoreB}. ${wPlayerName} won (lower won due to "Osiris").'
                ),
                $lane,
                $scores,
                $playerID2
              );
              $winLose[$pos] = $playerID2;
            } else {
              $this->notifyScore(
                clienttranslate(
                  '[${lane_name} lane] ${scoreA} vs ${scoreB}. ${wPlayerName} won.'
                ),
                $lane,
                $scores,
                $playerID2
              );
              $winLose[$pos] = $playerID2;
            }
            if (
              $this->hndlEvilAndAgent(
                $playerID2,
                $playerID,
                $hasEvil[$pos],
                $hasAgent[$pos]
              )
            ) {
              $gameEnded = true;
              break;
            }
            if (
              intval($centerCtrler[$lane]['controller']) ===
              $laneScore['player']
            ) {
              if ($this->addScore($laneScore['player'])) {
                $gameEnded = true;
                break;
              }
            } else {
              $this->setLaneController($laneScore['player'], $lane);
            }
          }
        }
      }
    }

    $sql =
      'SELECT center_location location, center_controller controller FROM center';
    $result['center'] = self::getCollectionFromDb($sql);

    // day or night
    $sql = 'SELECT round_side FROM round';
    $result['day_or_night'] = self::getUniqueValueFromDB($sql);

    // player sides for observer
    $result['player_sides'] = [];
    foreach ($allData['players'] as $playerID => $player) {
      $side = $this->getPlayerSide($playerID);
      $result['player_sides'][$side] = $playerID;
    }

    self::notifyAllPlayers(
      'endRound',
      clienttranslate('Round Ended.'),
      $result
    );

    // update score table
    ksort($result['score']['center'], SORT_NUMERIC);
    $centerScore = implode(',', $result['score']['center']);
    ksort($result['score'][$this->getDayPlayerID()], SORT_NUMERIC);
    $dayScore = implode(',', $result['score'][$this->getDayPlayerID()]);
    ksort($result['score'][$this->getNightPlayerID()], SORT_NUMERIC);
    $nightScore = implode(',', $result['score'][$this->getNightPlayerID()]);
    ksort($winLose, SORT_NUMERIC);
    $winner = implode(',', $winLose);

    $sql =
      'INSERT INTO score (' .
      'score_center_list, ' .
      'score_day_list, ' .
      'score_night_list, ' .
      'score_winner' .
      ") VALUES ('" .
      $centerScore .
      "','" .
      $dayScore .
      "','" .
      $nightScore .
      "','" .
      $winner .
      "')";
    self::DbQuery($sql);

    if ($gameEnded) {
      $this->gamestate->nextState('endGame');
    } else {
      $this->gamestate->setAllPlayersMultiactive();
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////// Zombie
  ////////////

  /*
        zombieTurn:

        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).

        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message.
    */

  function zombieTurn($state, $active_player)
  {
    $statename = $state['name'];

    if ($state['type'] === 'activeplayer') {
      switch ($statename) {
        default:
          $this->gamestate->nextState('zombiePass');
          break;
      }

      return;
    }

    if ($state['type'] === 'multipleactiveplayer') {
      // Make sure player is in a non blocking status for role turn
      $this->gamestate->setPlayerNonMultiactive($active_player, '');

      return;
    }

    throw new feException(
      'Zombie mode not supported at this game state: ' . $statename
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////:
  ////////// DB upgrade
  //////////

  /*
        upgradeTableDb:

        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.

    */

  function upgradeTableDb($from_version)
  {
    // $from_version is the current version of this game database, in numerical form.
    // For example, if the game was running with a release of your game named "140430-1345",
    // $from_version is equal to 1404301345

    // Example:
    //        if( $from_version <= 1404301345 )
    //        {
    //            // ! important ! Use DBPREFIX_<table_name> for all tables
    //
    //            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
    //            self::applyDbUpgradeToAllDB( $sql );
    //        }
    //        if( $from_version <= 1405061421 )
    //        {
    //            // ! important ! Use DBPREFIX_<table_name> for all tables
    //
    //            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
    //            self::applyDbUpgradeToAllDB( $sql );
    //        }
    //        // Please add your future database scheme changes here
    //
    //
  }
}
