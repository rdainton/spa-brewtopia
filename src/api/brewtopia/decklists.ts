import brewtopiaClient from './client'
import { Decklist } from '../../types/cards'

interface DecklistMeta {
  id: number
  name: string
  coverImageUrl: string
  createdAt: string
  updatedAt: string
}

interface DecklistDetails extends DecklistMeta {
  decklist: Decklist
}

export default {
  all() {
    return brewtopiaClient.get<{ data: DecklistMeta[] }>('/decklists')
  },

  get(id: number) {
    return brewtopiaClient.get<{ data: DecklistDetails }>(`/decklists/${id}`)
  },

  store(payload: { name: string; coverImageUrl?: string; decklist: Decklist }) {
    return brewtopiaClient.post<{ data: DecklistDetails }>(
      '/decklists',
      payload
    )
  },

  update(
    id: number,
    payload: {
      name?: string
      coverImageUrl?: string
      decklist?: Decklist
    }
  ) {
    return brewtopiaClient.post<{ data: DecklistDetails }>(
      `/decklists/${id}`,
      payload
    )
  },

  delete(id: number) {
    return brewtopiaClient.delete(`/decklists/${id}`)
  },
}
