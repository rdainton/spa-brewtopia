import brewtopiaClient, { apiPrefix } from './client'
import { DecklistContent } from '../../types/cards'

export interface DecklistMeta {
  id: number
  name: string
  coverImageUrl: string
  createdAt: string
  updatedAt: string
}

export interface DecklistDetails extends DecklistMeta {
  decklist: DecklistContent
}

export interface Storable {
  name: string
  coverImageUrl?: string
  decklist: DecklistContent
}

export interface Updateable {
  name?: string
  coverImageUrl?: string
  decklist?: DecklistContent
}

/**
 * The Brewtopia decklists services
 */
export default {
  all() {
    return brewtopiaClient.get<DecklistMeta[]>(`${apiPrefix}/decklists`)
  },

  get(id: number) {
    return brewtopiaClient.get<DecklistDetails>(`${apiPrefix}/decklists/${id}`)
  },

  store(payload: Storable) {
    return brewtopiaClient.post<DecklistDetails>(
      `${apiPrefix}/decklists`,
      payload
    )
  },

  update(id: number, payload: Updateable) {
    return brewtopiaClient.patch<DecklistDetails>(
      `${apiPrefix}/decklists/${id}`,
      payload
    )
  },

  delete(id: number) {
    return brewtopiaClient.delete(`${apiPrefix}/decklists/${id}`)
  },
}
