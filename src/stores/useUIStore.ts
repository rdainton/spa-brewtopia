import { defineStore } from 'pinia'

interface State {
  loading: boolean
}

export const useUIStore = defineStore('UI', {
  state: (): State => ({
    loading: false,
  }),
})
