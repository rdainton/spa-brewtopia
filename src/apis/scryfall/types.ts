export type ManaColor = 'B' | 'U' | 'R' | 'G' | 'R'

export interface CardFace {
  image_uris?: {
    small?: string
    normal?: string
    large?: string
    png?: string
    art_crop?: string
    border_crop?: string
  }
  name: string
  mana_cost?: string
  type_line: string
  oracle_text?: string
  power?: string
  toughness?: string
}
export interface ScryfallCard {
  id: string
  name: string
  cmc: number
  mana_cost?: string // dual-faced don't have a mana cost here
  type_line: string
  colors?: ManaColor[]
  color_identity: ManaColor[]
  power?: string
  toughness?: string
  card_faces?: CardFace[]
  image_uris?: {
    small?: string
    normal?: string
    large?: string
    png?: string
    art_crop?: string
    border_crop?: string
  }
  oracle_text?: string
  set: string
  set_name: string
  set_type: string
}
