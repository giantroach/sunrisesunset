import { CardDef, CardDetail, CardMetaDef } from '../type/card-def.d';
import cardsetImgUrl from '../assets/cardset.png';
import cardsetMiniImgUrl from '../assets/cardset-mini.png';
import centersetImgUrl from '../assets/centerset.png';
import iconPowerImgUrl from '../assets/power.png';
import iconPlaceImgUrl from '../assets/place.png';
import iconCombatImgUrl from '../assets/combat.png';

const cardDefs: { [cardType: string]: CardDef } = {
  mainCard: {
    image: cardsetImgUrl,
    sprite: '8x2',
    size: { width: '275px', height: '472px', radius: '20px' },
    textDef: {
      offsetY: '80%',
      paddingSide: '29px',
      paddingBottom: '23px',
    },
    minModalTop: 64,
    details: {
      0: {
        name: 'Anubis',
        text: '${Placement} Choose a unit already placed in this lane. Disable stealth and ability from the unit.',
        power: {
          fixed: 2,
          center: 1,
        },
        onPlay: 'TargetSameLane:Silence',
        stealth: false,
      },
      1: {
        name: 'Isis',
        text: '${Placement} Discard a non-stealth unit in this lane. The owner draws a unit card from the pile and immediately places it on the same lane.',
        power: {
          fixed: 1,
          center: 1,
        },
        onPlay: 'TargetNonStealthSameLane:Reincanate',
        stealth: false,
      },
      2: {
        name: 'Maat',
        text: '${Combat} Increases ${Power} in this lane by 1.',
        power: {
          fixed: 0,
          center: 2,
        },
        onResolution: 'IncleaseCenterBy1',
        stealth: false,
      },
      3: {
        name: 'Apofis',
        text: '${Combat} Receive 1 additional damage if you lose in this lane.',
        power: {
          fixed: 0,
          center: 3,
        },
        onResolution: 'Receive1OnLose',
        stealth: false,
      },
      4: {
        name: 'Apis',
        text: '${Combat} Power of APIS becomes 15 if ${Power} in this lane is either 6 or more than 6 or 0 or lower than 0.',
        power: {
          fixed: 0,
          center: 1,
        },
        onResolution: 'Becomes15OnCenter0or6',
        stealth: false,
      },
      5: {
        name: 'Ra',
        text: '${Placement} Choose and disable stealth from a unit (regardless of the lane).',
        power: {
          fixed: 3,
          center: 1,
        },
        onPlay: 'TargetAnyStealth:Reveal',
        stealth: false,
      },
      6: {
        name: 'Tefnut',
        text: 'Tefnut has no ability.',
        power: {
          fixed: 4,
          center: 1,
        },
        stealth: false,
      },
      7: {
        name: 'Eclipse',
        text: '${Combat} Draw the combat in this lane if the power gap is 4+ (prior to Osiris).',
        power: {
          fixed: 0,
          center: 1,
        },
        stealth: true,
      },
      8: {
        name: 'Heka',
        text: '${Placement} Choose a stealth unit in this lane. Move it to another lane.',
        power: {
          fixed: 4,
          center: 0,
        },
        onPlay: 'TargetSameLaneToAnother:Maze',
        stealth: false,
      },
      9: {
        name: 'La Plaga',
        text: '${Combat} Change ${Power} in this lane to 0. (Apply this before any other combat abilities.)',
        power: {
          fixed: 3,
          center: 0,
        },
        stealth: false,
      },
      10: {
        name: 'Osiris',
        text: '${Combat} The one with lower power wins in this lane (unless there is a draw).',
        power: {
          fixed: 7,
          center: 0,
        },
        stealth: false,
      },
      11: {
        name: 'Bastet',
        text: '${Combat} Deals 1 additional damage to the opponent if you win in this lane.',
        power: {
          fixed: 2,
          center: 0,
        },
        stealth: true,
      },
      12: {
        name: 'El Libro de los Muertos',
        text: '${Combat} Reduces ${Power} in this lane by 2.',
        power: {
          fixed: 5,
          center: 0,
        },
        stealth: true,
      },
      13: {
        name: 'Seth',
        text: '',
        power: {
          fixed: 1,
          center: 0,
        },
        stealth: true,
      },
      14: {
        name: 'Horus',
        text: '',
        power: {
          fixed: 1,
          center: 0,
        },
        stealth: true,
      },
      17: {
        name: 'Stealth',
        text: '(Reviealed at the combat phase!)',
        power: {
          fixed: 1,
          center: 0,
        },
        stealth: true,
        onlyMini: true,
      },
    },
    miniDef: {
      image: cardsetMiniImgUrl,
      sprite: '8x3',
      size: { width: '138px', height: '138px', radius: '10px' },
    },
    placeholder: {
      defs: [
        { regexp: /\$\{Power\}/g, img: iconPowerImgUrl },
        { regexp: /\$\{Placement\}/g, img: iconPlaceImgUrl },
        { regexp: /\$\{Combat\}/g, img: iconCombatImgUrl },
      ],
      size: { width: '16px', height: '16px', radius: '0px' },
    },
  },
  centerCard: {
    image: centersetImgUrl,
    sprite: '6x3',
    size: { width: '138px', height: '138px', radius: '10px' },
  },
};

const cardMetaDefs: { [cardMetaID: string]: CardMetaDef } = {
  oracle: {
    text: 'Stealth and the ability are disabled by "Anubis".',
    type: 'warn',
  },
  watcher: {
    text: 'Stealth is disabled by "Ra".',
    type: 'warn',
  },
  stealth: {
    text: 'Because of stealth, the contents of this card are invisible to your opponent.',
    type: 'info',
  },
};

const cardUtil = {
  getCard: (cid: string): CardDetail => {
    const ids = /([^\d]+)(\d+)/.exec(cid);
    if (!ids) {
      throw 'invalid cid format';
    }
    const cat = ids[1];
    const idx = Number(ids[2]);
    const detail = cardDefs[cat].details?.[idx];
    if (!detail) {
      throw 'invalid cid';
    }

    return detail;
  },

  getIdx: (cid: string): number => {
    const ids = /([^\d]+)(\d+)/.exec(cid);
    if (!ids) {
      throw 'invalid cid format';
    }
    return Number(ids[2]);
  },
};

export { cardDefs, cardUtil, cardMetaDefs };
