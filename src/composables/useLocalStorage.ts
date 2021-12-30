/**
 * Simple Adaptor around localStorage browser API
 */
export default function useLocalStorage<T>(key: string) {
  const store = (item: T): void => {
    localStorage.setItem(key, JSON.stringify(item))
  }

  const load = (): T | null => {
    const itemString = localStorage.getItem(key)

    if (itemString) {
      return JSON.parse(itemString) as T
    }

    return null
  }

  const clear = () => {
    localStorage.removeItem(key)
  }

  return {
    load,
    store,
    clear,
  }
}
