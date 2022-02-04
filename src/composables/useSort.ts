import { CardList, CardSection, ICard } from '@/types/cards'

type RemoveUuidField<Type> = {
  [Property in keyof Type as Exclude<Property, 'uuid'>]: Type[Property]
}

// uuid is optional, so remove it from the type
export type SortKey = keyof RemoveUuidField<ICard>

/**
 * A composable to house sorting logic for CardSections
 *
 * @param onComplete - optional hook called on action completion
 */
export default function useSort(onComplete?: () => void) {
  const _groupBy = (list: CardList, key: SortKey) => {
    return list.reduce((map: { [key: string]: CardList }, card) => {
      ;(map[card[key]] = map[card[key]] || []).push(card)
      return map
    }, {})
  }

  const sort = (
    section: CardSection,
    sortKey: SortKey,
    direction: 'ASC' | 'DESC' = 'ASC'
  ) => {
    const flatSection = section.flat()

    if (!flatSection.length) return

    const groupedBySortKey = _groupBy(flatSection, sortKey)

    const sortedKeys = Object.keys(groupedBySortKey).sort()

    if (direction === 'DESC') {
      sortedKeys.reverse()
    }

    const sortedSection = sortedKeys.map(sortKey => {
      // sort the keys by scryfall id to group by card
      // and then sort by flatColor to group by color
      // to group identical cards
      return groupedBySortKey[sortKey]
        .sort((a, b) => (a.srcyId > b.srcyId ? 1 : -1))
        .sort((a, b) => (a.flatColors > b.flatColors ? 1 : -1))
    })

    section.splice(0, section.length, ...sortedSection, [])

    if (typeof onComplete === 'function') onComplete()
  }

  const flatten = (section: CardSection) => {
    const flatSection = section
      .flat()
      .sort((a, b) => (a.srcyId > b.srcyId ? 1 : -1))
      .sort((a, b) => (a.flatColors > b.flatColors ? 1 : -1))

    section.splice(0, section.length, flatSection, [])

    if (typeof onComplete === 'function') onComplete()
  }

  return {
    sort,
    flatten,
  }
}
