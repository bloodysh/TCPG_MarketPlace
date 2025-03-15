import type { Card } from './types/Card'
import A1 from './assets/cards/A1.json'
import A1a from './assets/cards/A1a.json'
import A2 from './assets/cards/A2.json'
import PA from './assets/cards/P-A.json'

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