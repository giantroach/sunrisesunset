/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * SunriseSunset implementation : © Tomoki Motohashi <tomoki.motohashi@takoashi.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * sunrisesunset.js
 *
 * SunriseSunset user interface script
 *
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

const appName = 'sunrisesunset';
let i18n;

// load client ES module code
const s = document.createElement('script');
s.type = 'module';
s.src = `${g_gamethemeurl}modules/app.js`;
document.body.appendChild(s);
const p = new Promise((resolve) => {
  const timer = setInterval(() => {
    if (window['vue']) {
      clearTimeout(timer);
      resolve(window['vue']);
    }
  });
}, 100);

define([
  'dojo',
  'dojo/_base/declare',
  'ebg/core/gamegui',
  'ebg/counter',
], function (dojo, declare) {
  return declare('bgagame.sunrisesunset', ebg.core.gamegui, {
    constructor: function () {
      console.log('sunrisesunset constructor');

      // Here, you can init the global variables of your user interface
      // Example:
      // this.myGlobalValue = 0;
    },

    /*
            setup:

            This method must set up the game user interface according to current game situation specified
            in parameters.

            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)

            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */

    setup: function (gamedatas) {
      console.log('Starting game setup');

      // when the client script is ready
      p.then((v) => {
        vue = v;
        vue.urlBase = g_gamethemeurl;

        // TODO: Set up your game interface here, according to "gamedatas"
        vue.gamedata = gamedatas;
        vue.playerID = this.player_id;
        // Setup game notifications to handle (see "setupNotifications" method below)
        this.setupNotifications();
        this.setupActions();
        // inject translation
        i18n = window['_'];
        vue.translation = {
          'Sunrise Sunset': _('Sunrise Sunset'),
          // from def/card.ts
          '${Placement} Choose a unit already placed in this lane. Disable stealth and ability from the unit.':
            _(
              '${Placement} Choose a unit already placed in this lane. Disable stealth and ability from the unit.'
            ),
          '${Placement} Discard a non-stealth unit in this lane. The owner draws a unit card from the pile and immediately places it on the same lane.':
            _(
              '${Placement} Discard a non-stealth unit in this lane. The owner draws a unit card from the pile and immediately places it on the same lane.'
            ),
          '${Combat} Increases ${Power} in this lane by 1.': _(
            '${Combat} Increases ${Power} in this lane by 1.'
          ),
          '${Combat} Receive 1 additional damage if you lose in this lane.': _(
            '${Combat} Receive 1 additional damage if you lose in this lane.'
          ),
          '${Combat} Power of APIS becomes 15 if ${Power} in this lane is either 6 or more than 6 or 0 or lower than 0.':
            _(
              '${Combat} Power of APIS becomes 15 if ${Power} in this lane is either 6 or more than 6 or 0 or lower than 0.'
            ),
          '${Placement} Choose and disable stealth from a unit (regardless of the lane).':
            _(
              '${Placement} Choose and disable stealth from a unit (regardless of the lane).'
            ),
          'Tefnut has no ability.': _('Tefnut has no ability.'),
          '${Combat} Draw the combat in this lane if the power gap is 4+ (prior to Osiris).':
            _(
              '${Combat} Draw the combat in this lane if the power gap is 4+ (prior to Osiris).'
            ),
          '${Placement} Choose a stealth unit in this lane. Move it to another lane.':
            _(
              '${Placement} Choose a stealth unit in this lane. Move it to another lane.'
            ),
          '${Combat} Change ${Power} in this lane to 0. (Apply this before any other combat abilities.)':
            _(
              '${Combat} Change ${Power} in this lane to 0. (Apply this before any other combat abilities.)'
            ),
          '${Combat} The one with lower power wins in this lane (unless there is a draw).':
            _(
              '${Combat} The one with lower power wins in this lane (unless there is a draw).'
            ),
          '${Combat} Deals 1 additional damage to the opponent if you win in this lane.':
            _(
              '${Combat} Deals 1 additional damage to the opponent if you win in this lane.'
            ),
          '${Combat} Reduces ${Power} in this lane by 2.': _(
            '${Combat} Reduces ${Power} in this lane by 2.'
          ),
          '(Reviealed at the combat phase!)': _(
            '(Reviealed at the combat phase!)'
          ),
          'Stealth and the ability are disabled by "Anubis".': _(
            'Stealth and the ability are disabled by "Anubis".'
          ),
          'Stealth is disabled by "Ra".': _('Stealth is disabled by "Ra".'),
          'Because of stealth, the contents of this card are invisible to your opponent.':
            _(
              'Because of stealth, the contents of this card are invisible to your opponent.'
            ),
          // from def/ctrlBar.ts
          'Wait for your turn.': _('Wait for your turn.'),
          'Choose a card to play.': _('Choose a card to play.'),
          'Play the newly drawn card.': _('Play the newly drawn card.'),
          'You may discard a card to draw a new card.': _(
            'You may discard a card to draw a new card.'
          ),
          'No valid target.': _('No valid target.'),
          'Choose a lane to place.': _('Choose a lane to place.'),
          'Choose a unit to disable stealth and ability.': _(
            'Choose a unit to disable stealth and ability.'
          ),
          'Choose a unit to discard.': _('Choose a unit to discard.'),
          'Choose a unit to disable stealth.': _(
            'Choose a unit to disable stealth.'
          ),
          'Choose a stealth unit to move.': _('Choose a stealth unit to move.'),
          'Choose a lane to move.': _('Choose a lane to move.'),
          "Press 'Submit' to confirm.": _("Press 'Submit' to confirm."),
          "Press 'Confirm' to continue.": _("Press 'Confirm' to continue."),
          // from def/ctrl-button.ts
          Cancel: _('Cancel'),
          Submit: _('Submit'),
          'Discard and draw': _('Discard and draw'),
          'No discard': _('No discard'),
          Confirm: _('Confirm'),
        };

        // Setting up player boards
        for (var player_id in gamedatas.players) {
          var player = gamedatas.players[player_id];

          // TODO: Setting up players boards if needed
        }

        console.log('Ending game setup');
      });
    },

    ///////////////////////////////////////////////////
    //// Game & client states

    // onEnteringState: this method is called each time we are entering into a new game state.
    //                  You can use this method to perform some user interface changes at this moment.
    //
    onEnteringState: function (stateName, args) {
      console.log('Entering state: ' + stateName);
      p.then(() => {
        switch (stateName) {
          case 'roundSetup':
            vue.bgaStates.push('roundSetup');
            break;
          case 'mulliganTurn':
            if (this.isCurrentPlayerActive()) {
              vue.bgaStates.push('mulligan:init');
            }
            break;
          case 'playerTurn':
            if (this.isCurrentPlayerActive()) {
              vue.bgaStates.push('playerTurn:init');
            }
            break;
          case 'reincarnationTurn':
            if (this.isCurrentPlayerActive()) {
              vue.bgaStates.push('reincarnationTurn:init');
            }
            break;
          case 'endRound':
            vue.bgaStates.push('endRound:init');
            break;
          case 'gameEnd':
            vue.bgaStates.push('gameEnd:init');
            break;
          case 'dummmy':
            break;
        }
      });
    },

    // onLeavingState: this method is called each time we are leaving a game state.
    //                 You can use this method to perform some user interface changes at this moment.
    //
    onLeavingState: function (stateName) {
      console.log('Leaving state: ' + stateName);
      p.then(() => {
        switch (stateName) {
          case 'mulliganTurn':
            vue.bgaStates.push('waitingForOtherPlayer');
            break;

          case 'playerTurn':
            vue.bgaStates.push('waitingForOtherPlayer');
            break;

          case 'reincarnationTurn':
            vue.bgaStates.push('waitingForOtherPlayer');
            break;
        }
      });
    },

    // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
    //                        action status bar (ie: the HTML links in the status bar).
    //
    onUpdateActionButtons: function (stateName, args) {
      console.log('onUpdateActionButtons: ' + stateName);

      if (this.isCurrentPlayerActive()) {
        switch (
          stateName
          /*
                 Example:

                 case 'myGameState':

                    // Add 3 action buttons in the action status bar:

                    this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' );
                    this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' );
                    this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' );
                    break;
*/
        ) {
        }
      }
    },

    ///////////////////////////////////////////////////
    //// Utility methods

    /*

            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.

        */

    ///////////////////////////////////////////////////
    //// Player's action

    /*

            Here, you are defining methods to handle player's action (ex: results of mouse click on
            game objects).

            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server

        */

    /* Example:

        onMyMethodToCall1: function( evt )
        {
            console.log( 'onMyMethodToCall1' );

            // Preventing default browser reaction
            dojo.stopEvent( evt );

            // Check that this action is possible (see "possibleactions" in states.inc.php)
            if( ! this.checkAction( 'myAction' ) )
            {   return; }

            this.ajaxcall( "/sunrisesunset/sunrisesunset/myAction.html", {
                                                                    lock: true,
                                                                    myArgument1: arg1,
                                                                    myArgument2: arg2,
                                                                    ...
                                                                 },
                         this, function( result ) {

                            // What to do after the server call if it succeeded
                            // (most of the time: nothing)

                         }, function( is_error) {

                            // What to do after the server call in anyway (success or failure)
                            // (most of the time: nothing)

                         } );
        },

        */

    ///////////////////////////////////////////////////
    //// Reaction to cometD notifications

    /*
            setupNotifications:

            In this method, you associate each of your game notifications with your local method to handle it.

            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your sunrisesunset.game.php file.

        */
    setupNotifications: function () {
      console.log('notifications subscriptions setup');

      // TODO: here, associate your game notifications with local methods

      // Example 1: standard notification handling
      // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

      // Example 2: standard notification handling + tell the user interface to wait
      //            during 3 seconds after calling the method in order to let the players
      //            see what is happening in the game.
      // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
      // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
      //

      dojo.subscribe('updateScore', this, (data) => {
        this.scoreCtrl[data.args.playerID].incValue(1);
      });

      const notifications = [
        'newRound',
        'newHand',
        'mulligan',
        'playCard',
        'moveCard',
        'updateCard',
        'reincarnateCard',
        'score',
        'endRound',
      ];
      notifications.forEach((n) => {
        dojo.subscribe(n, this, (data) => {
          vue.bgaNotifications.push({
            name: n,
            args: data.args,
          });
        });
      });
    },

    // TODO: from this point and below, you can write your game notifications handling methods

    /*
        Example:

        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );

            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call

            // TODO: play the card in the user interface.
        },

    */
    setupActions: function () {
      vue.$watch(
        () => vue.bgaRequest,
        (req) => {
          if (!req) {
            return;
          }
          const reqBase = `/${appName}/${appName}`;
          const url = `${reqBase}/${req.name}.html`;
          vue.bgaRequestPromise = new Promise((resolve, reject) => {
            this.ajaxcall(
              url,
              Object.assign(
                {
                  lock: true,
                },
                req.args
              ),
              this,
              (result) => {
                resolve(result);
              },
              (error) => {
                // this is called even if it success
                if (error) {
                  reject(error);
                }
              }
            );
          });
        }
      );
    },
  });
});
