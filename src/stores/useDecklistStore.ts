import { defineStore } from 'pinia'
import brewtopia, { ErrorMap } from '@/apis/brewtopia'
import { CardSections, Decklist, DecklistContent } from '@/types/cards'

// Stores
import { useCardStore } from '@/stores/useCardStore'

// Composables
import useLocalStorage from '@/composables/useLocalStorage'
import useToasts from '@/composables/useToasts'

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

    hasName(state) {
      return !!state.name
    },
  },

  actions: {
    async init() {
      const { load, clear } = useLocalStorage<PersistableDecklist>('decklist')

      const stored = load()
      if (stored) {
        const cardStore = useCardStore()
        const dispatch = useToasts()
        cardStore
          .getCollectionForDecklist(stored.decklist)
          .then(() => {
            this.$patch({
              ...stored,
              loading: false,
              error: null,
            })
          })
          .catch(_ => {
            dispatch.errorToast(
              'Error initialising decklist, please refresh the page.'
            )
            clear()
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

      this.persistToLocalStorage()
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

    appendEmptyColumns(decklist: Decklist) {
      let sectionKey: keyof DecklistContent
      for (sectionKey in decklist.decklist) {
        // API will strip empty columns from sections
        // with data, so we need to re-add an empty array
        // to the end of a section to drag cards into.
        if (
          decklist.decklist[sectionKey][
            decklist.decklist[sectionKey].length - 1
          ].length !== 0
        ) {
          decklist.decklist[sectionKey] = [...decklist.decklist[sectionKey], []]
        }

        // apply default columns to an empty section.
        if (decklist.decklist[sectionKey].length === 0) {
          decklist.decklist[sectionKey] = [
            ...createDefaultDecklist()[sectionKey],
          ]
        }
      }

      return decklist
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
          this.setDecklist(this.appendEmptyColumns(res.data))
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
          this.setDecklist(this.appendEmptyColumns(res.data))
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
      const cardStore = useCardStore()
      const dispatch = useToasts()

      return brewtopia.decklists
        .get(id)
        .then(res => {
          return cardStore
            .getCollectionForDecklist(res.data.decklist)
            .then(() => {
              this.setDecklist(this.appendEmptyColumns(res.data))
              return res.data
            })
            .catch(err => {
              dispatch.errorToast('Error initialising decklist')
              throw err
            })
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
