<?php
/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * SunriseSunset implementation : © Tomoki Motohashi <tomoki.motohashi@takoashi.com>
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 *
 * sunrisesunset.action.php
 *
 * SunriseSunset main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/sunrisesunset/sunrisesunset/myAction.html", ...)
 *
 */

class action_sunrisesunset extends APP_GameAction
{
  // Constructor: please do not modify
  public function __default()
  {
    if (self::isArg('notifwindow')) {
      $this->view = 'common_notifwindow';
      $this->viewArgs['table'] = self::getArg('table', AT_posint, true);
    } else {
      $this->view = 'sunrisesunset_sunrisesunset';
      self::trace('Complete reinitialization of board game');
    }
  }

  // TODO: defines your action entry points there

  public function mulligan()
  {
    self::setAjaxMode();
    $cardID = self::getArg('card', AT_alphanum, false);

    $this->game->mulligan($cardID);
    self::ajaxResponse();
  }

  public function playCard()
  {
    self::setAjaxMode();
    $cardID = self::getArg('card', AT_alphanum, true);
    $gridID = self::getArg('gridID', AT_posint, true);
    $targetGridID = self::getArg('targetGridID', AT_int, false);
    $targetGridSide = self::getArg('targetGridSide', AT_alphanum, false);
    $targetCol = self::getArg('targetCol', AT_int, false);

    $this->game->playCard(
      $cardID,
      $gridID,
      $targetGridID,
      $targetGridSide,
      $targetCol
    );
    self::ajaxResponse();
  }

  public function endRoundConfirm()
  {
    self::setAjaxMode();
    $this->game->endRoundConfirm();
    self::ajaxResponse();
  }
}
