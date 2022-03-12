import { defineStore } from 'pinia'
import brewtopia, { ErrorMap } from '@/apis/brewtopia'
import useLocalStorage from '@/composables/useLocalStorage'
import { CardSections, Decklist, DecklistContent } from '@/types/cards'

interface State extends Decklist {
  loading: boolean
  error: ErrorMap | null
  unsavedChanges: boolean
}

function createDefaultDecklist(): DecklistContent {
  return {
    mainboard: [[], [], [], [], []],
    sideboard: [[], []],
    maybes: [[], []],
  }
}

interface PersistableDecklist extends Decklist {
  unsavedChanges: boolean
}

export const useDecklistStore = defineStore('decklist', {
  state: (): State => ({
    id: 0,
    name: '',
    decklist: createDefaultDecklist(),
    loading: false,
    error: null,
    unsavedChanges: false,
  }),

  getters: {
    hasCurrent(state) {
      return !!state.id
    },
  },

  actions: {
    init() {
      const stored = useLocalStorage<PersistableDecklist>('decklist').load()
      if (stored) {
        this.$patch({
          ...stored,
          loading: false,
          error: null,
        })
      }
    },

    setDecklist(decklist: Decklist) {
      this.id = decklist.id
      this.name = decklist.name
      this.decklist = decklist.decklist
      this.loading = false
      this.error = null
      this.unsavedChanges = false

      useLocalStorage<PersistableDecklist>('decklist').store({
        ...decklist,
        unsavedChanges: this.unsavedChanges,
      })
    },

    clearDecklist() {
      this.$reset()
      useLocalStorage<PersistableDecklist>('decklist').clear()
    },

    persistToLocalStorage() {
      useLocalStorage<PersistableDecklist>('decklist').store({
        id: this.id,
        name: this.name,
        decklist: this.decklist,
        unsavedChanges: this.unsavedChanges,
      })
    },

    clearDecklistSection(sectionName: CardSections) {
      this.decklist[sectionName] = createDefaultDecklist()[sectionName]
      this.unsavedChanges = true

      this.persistToLocalStorage()
    },

    async store() {
      if (this.loading) return

      this.loading = true

      return brewtopia.decklists
        .store({
          name: this.name,
          decklist: this.decklist,
        })
        .then(res => {
          this.setDecklist(res.data)
          return res.data
        })
        .catch(err => {
          this.error = err
          this.loading = false
          throw err
        })
    },

    async update() {
      if (this.loading || !this.hasCurrent) return

      this.loading = true

      return brewtopia.decklists
        .update(this.id, {
          name: this.name,
          decklist: this.decklist,
        })
        .then(res => {
          this.setDecklist(res.data)
          return res.data
        })
        .catch(err => {
          this.error = err
          this.loading = false
          throw err
        })
    },

    async get(id: number) {
      if (this.loading) return

      this.$reset()
      this.loading = true

      return brewtopia.decklists
        .get(id)
        .then(res => {
          this.setDecklist(res.data)
          return res.data
        })
        .catch(err => {
          this.error = err
          this.loading = false
          throw err
        })
    },

    async saveChanges() {
      return this.hasCurrent ? this.update() : this.store()
    },
  },
})
