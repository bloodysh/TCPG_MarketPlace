import type { Card } from '@/types/Card'
import type { Expansion } from '@/types/Expansion'
import A1 from './cards/A1.json'
import A1a from './cards/A1a.json'
import A2 from './cards/A2.json'
import PA from './cards/P-A.json'

const update = (cards: Card[], expansionName : string) => {
  for (const card of cards) {
    //setting the id for each image
    // each pokemon is treated as a cards the same id if they are the same pokemon, else we use the card_id of the set
    card.expansion = expansionName
    // @ts-ignore  on ignore l'erreur, on veut pas de card_id = card_id
    card.card_id = card.linkedCardID || `${expansionName}-${card.id}`
  }
  return cards
}

export const a1Cards: Card[] = update(A1 as unknown as Card[], 'A1')
export const a2Cards: Card[] = update(A2 as unknown as Card[], 'A2')
export const a1aCards: Card[] = update(A1a as unknown as Card[], 'A1a')
export const paCards: Card[] = update(PA as unknown as Card[], 'P-A')
export const allCards: Card[] = [...a1Cards, ...a1aCards, ...a2Cards, ...paCards]


export const expansions: Expansion[] = [
    {
      name: 'Genetic Apex',
      id: 'A1',
      cards: a1Cards,
      packs: [
        { name: 'Mewtwo pack', color: '#986C88' },
        { name: 'Charizard pack', color: '#E2711B' },
        { name: 'Pikachu pack', color: '#EDC12A' },
        { name: 'Every pack', color: '#CCCCCC' },
      ],
      tradeable: true,
    },
    {
      name: 'Mythical Island',
      id: 'A1a',
      cards: a1aCards,
      packs: [{ name: 'Mew pack', color: '#FFC1EA' }],
      tradeable: true,
    },
    {
      name: 'Space-Time Smackdown',
      id: 'A2',
      cards: a2Cards,
      packs: [
        { name: 'Dialga pack', color: '#A0C5E8' },
        { name: 'Palkia pack', color: '#D5A6BD' },
        { name: 'Every pack', color: '#CCCCCC' },
      ],
      tradeable: false,
    },
    {
      name: 'Promo-A',
      id: 'P-A',
      cards: paCards,
      packs: [{ name: 'Every pack', color: '#CCCCCC' }],
      tradeable: false,
      promo: true,
    },
  ]
