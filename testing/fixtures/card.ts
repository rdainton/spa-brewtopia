export const singleFacedCard = {
  id: 'e0b3a98f-2b3c-438b-b78c-eef8d917f68e',
  name: 'Altar of the Goyf',
  cmc: 5,
  typeLine: 'Tribal Artifact — Lhurgoyf',
  colorIdentity: [],
  set: 'mh2',
  setName: 'Modern Horizons 2',
  setType: 'draft_innovation',
  manaCost: '{5}',
  oracleText:
    'Whenever a creature you control attacks alone, it gets +X/+X until end of turn, where X is the number of card types among cards in all graveyards.\nLhurgoyf creatures you control have trample.',
  imgUrl:
    'https://brewtopia-mock.io/cards/normal/front/e/0/e0b3a98f-2b3c-438b-b78c-eef8d917f68e.jpg?1626098924',
  imgUrlLarge:
    'https://brewtopia-mock.io/cards/large/front/e/0/e0b3a98f-2b3c-438b-b78c-eef8d917f68e.jpg?1626098924',
}

export const doubleFacedCard = {
  id: '24c0d87b-0049-4beb-b9cb-6f813b7aa7dc',
  name: 'Fable of the Mirror-Breaker // Reflection of Kiki-Jiki',
  cmc: 3,
  typeLine: 'Enchantment — Saga // Enchantment Creature — Goblin Shaman',
  colorIdentity: ['R'],
  set: 'neo',
  setName: 'Kamigawa: Neon Dynasty',
  setType: 'expansion',
  cardFaces: [
    {
      name: 'Fable of the Mirror-Breaker',
      typeLine: 'Enchantment — Saga',
      manaCost: '{2}{R}',
      colors: ['R'],
      oracleText:
        '(As this Saga enters and after your draw step, add a lore counter.)\nI — Create a 2/2 red Goblin Shaman creature token with "Whenever this creature attacks, create a Treasure token."\nII — You may discard up to two cards. If you do, draw that many cards.\nIII — Exile this Saga, then return it to the battlefield transformed under your control.',
      imgUrl:
        'https://brewtopia-mock.io/cards/normal/front/2/4/24c0d87b-0049-4beb-b9cb-6f813b7aa7dc.jpg?1648541384',
      imgUrlLarge:
        'https://brewtopia-mock.io/cards/large/front/2/4/24c0d87b-0049-4beb-b9cb-6f813b7aa7dc.jpg?1648541384',
    },
    {
      name: 'Reflection of Kiki-Jiki',
      typeLine: 'Enchantment Creature — Goblin Shaman',
      colors: ['R'],
      power: '2',
      toughness: '2',
      oracleText:
        "{1}, {T}: Create a token that's a copy of another target nonlegendary creature you control, except it has haste. Sacrifice it at the beginning of the next end step.",
      imgUrl:
        'https://brewtopia-mock.io/cards/normal/back/2/4/24c0d87b-0049-4beb-b9cb-6f813b7aa7dc.jpg?1648541384',
      imgUrlLarge:
        'https://brewtopia-mock.io/cards/large/back/2/4/24c0d87b-0049-4beb-b9cb-6f813b7aa7dc.jpg?1648541384',
    },
  ],
}

export const splitFacedCard = {
  id: '0f279560-7e9f-4a6d-9fd6-6c8c6bd94a1b',
  name: 'Wear // Tear',
  cmc: 3,
  typeLine: 'Instant // Instant',
  colorIdentity: ['R', 'W'],
  set: 'cmr',
  setName: 'Commander Legends',
  setType: 'draft_innovation',
  manaCost: '{1}{R} // {W}',
  colors: ['R', 'W'],
  imgUrl:
    'https://brewtopia-mock.io/cards/normal/front/0/f/0f279560-7e9f-4a6d-9fd6-6c8c6bd94a1b.jpg?1608917739',
  imgUrlLarge:
    'https://brewtopia-mock.io/cards/large/front/0/f/0f279560-7e9f-4a6d-9fd6-6c8c6bd94a1b.jpg?1608917739',
  cardFaces: [
    {
      name: 'Wear',
      typeLine: 'Instant',
      manaCost: '{1}{R}',
      oracleText:
        'Destroy target artifact.\nFuse (You may cast one or both halves of this card from your hand.)',
    },
    {
      name: 'Tear',
      typeLine: 'Instant',
      manaCost: '{W}',
      oracleText:
        'Destroy target enchantment.\nFuse (You may cast one or both halves of this card from your hand.)',
    },
  ],
}

export default {
  singleFacedCard,
  doubleFacedCard,
  splitFacedCard,
}
