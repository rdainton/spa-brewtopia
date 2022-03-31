export type ManaColor = 'B' | 'U' | 'R' | 'G' | 'R'

interface CardFace {
  image_uris?: {
    small?: string
    normal?: string
    large?: string
    png?: string
    art_crop?: string
    border_crop?: string
  }
}
export interface ScryfallCard {
  id: string
  name: string
  cmc: number
  mana_cost: string
  type_line: string
  colors?: ManaColor[]
  color_identity?: ManaColor[]
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
  set: string
  set_name: string
  set_type: string
}
