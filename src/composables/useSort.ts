import { CardList, CardSection, ICard } from '../types/cards'

type RemoveUuidField<Type> = {
  [Property in keyof Type as Exclude<Property, 'uuid'>]: Type[Property]
}

// uuid is optional, so remove it from the type
type SortKey = keyof RemoveUuidField<ICard>

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
      // sort the keys simply by scryfall id within their new lists
      // to group identical cards
      return groupedBySortKey[sortKey].sort((a, b) => (a.id > b.id ? 1 : -1))
    })

    section.splice(0, section.length, ...sortedSection, [])

    if (typeof onComplete === 'function') onComplete()
  }

  return {
    sort,
  }
}
