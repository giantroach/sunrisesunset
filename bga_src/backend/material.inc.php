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
 * material.inc.php
 *
 * SunriseSunset game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */

/*

Example:

$this->card_types = array(
    1 => array( "card_name" => ...,
                ...
              )
);

*/

$this->card_types = [
  (object) [
    'id' => '0',
    'name' => 'Anubis',
    'powerFixed' => 2,
    'powerCenter' => 1,
    'stealth' => false,
  ],
  (object) [
    'id' => '1',
    'name' => 'Isis',
    'powerFixed' => 1,
    'powerCenter' => 1,
    'stealth' => false,
  ],
  (object) [
    'id' => '2',
    'name' => 'Maat',
    'powerFixed' => 0,
    'powerCenter' => 2,
    'stealth' => false,
  ],
  (object) [
    'id' => '3',
    'name' => 'Apofis',
    'powerFixed' => 0,
    'powerCenter' => 3,
    'stealth' => false,
  ],
  (object) [
    'id' => '4',
    'name' => 'Apis',
    'powerFixed' => 0,
    'powerCenter' => 1,
    'stealth' => false,
  ],
  (object) [
    'id' => '5',
    'name' => 'Ra',
    'powerFixed' => 3,
    'powerCenter' => 1,
    'stealth' => false,
  ],
  (object) [
    'id' => '6',
    'name' => 'Tefnut',
    'powerFixed' => 4,
    'powerCenter' => 1,
    'stealth' => false,
  ],
  (object) [
    'id' => '7',
    'name' => 'Eclipse',
    'powerFixed' => 0,
    'powerCenter' => 1,
    'stealth' => true,
  ],
  (object) [
    'id' => '8',
    'name' => 'Heka',
    'powerFixed' => 4,
    'powerCenter' => 0,
    'stealth' => false,
  ],
  (object) [
    'id' => '9',
    'name' => 'La Plaga',
    'powerFixed' => 3,
    'powerCenter' => 0,
    'stealth' => false,
  ],
  (object) [
    'id' => '10',
    'name' => 'Osiris',
    'powerFixed' => 7,
    'powerCenter' => 0,
    'stealth' => false,
  ],
  (object) [
    'id' => '11',
    'name' => 'Bastet',
    'powerFixed' => 2,
    'powerCenter' => 0,
    'stealth' => true,
  ],
  (object) [
    'id' => '12',
    'name' => 'El Libro de los Muertos',
    'powerFixed' => 5,
    'powerCenter' => 0,
    'stealth' => true,
  ],
  (object) [
    'id' => '13',
    'name' => 'Seth',
    'powerFixed' => 1,
    'powerCenter' => 0,
    'stealth' => true,
  ],
  (object) [
    'id' => '14',
    'name' => 'Horus',
    'powerFixed' => 1,
    'powerCenter' => 0,
    'stealth' => true,
  ],
  (object) [
    'id' => '17',
    'name' => 'Stealth',
    'powerFixed' => 0,
    'powerCenter' => 0,
    'stealth' => true,
  ],
];
