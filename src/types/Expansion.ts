import { Card } from "./Card"
import { Pack } from "./Pack"

export interface Expansion {
    name: string
    id: string
    cards: Card[]
    packs: Pack[]
    tradeable?: boolean
    promo?: boolean
  }