import brewtopiaClient, { apiPrefix } from './client'
import { Decklist } from '../../types/cards'

export interface DecklistMeta {
  id: number
  name: string
  coverImageUrl: string
  createdAt: string
  updatedAt: string
}

export interface DecklistDetails extends DecklistMeta {
  decklist: Decklist
}

export interface Storable {
  name: string
  coverImageUrl?: string
  decklist: Decklist
}

export interface Updateable {
  name?: string
  coverImageUrl?: string
  decklist?: Decklist
}

/**
 * The Brewtopia decklists services
 */
export default {
  all() {
    return brewtopiaClient.get<{ data: DecklistMeta[] }>(
      `${apiPrefix}/decklists`
    )
  },

  get(id: number) {
    return brewtopiaClient.get<{ data: DecklistDetails }>(
      `${apiPrefix}/decklists/${id}`
    )
  },

  store(payload: Storable) {
    return brewtopiaClient.post<{ data: DecklistDetails }>(
      `${apiPrefix}/decklists`,
      payload
    )
  },

  update(id: number, payload: Updateable) {
    return brewtopiaClient.post<{ data: DecklistDetails }>(
      `${apiPrefix}/decklists/${id}`,
      payload
    )
  },

  delete(id: number) {
    return brewtopiaClient.delete(`${apiPrefix}/decklists/${id}`)
  },
}
