import { CardList, CardSection, CardStoreable } from '@/types/cards'

export type SortKey = 'cmc' | 'cardType'

/**
 * A composable to house sorting logic for CardSections
 *
 * @param onComplete - optional hook called on action completion
 */
export default function useSort(
  cardStore: Record<CardStoreable['id'], CardStoreable>,
  onComplete?: () => void
) {
  const _groupBy = (list: CardList, key: SortKey) => {
    return list.reduce((map: { [key: string]: CardList }, card) => {
      const fullCard = cardStore[card.scryId]
      ;(map[fullCard[key]] = map[fullCard[key]] || []).push(card)
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
      // sort the keys by card id to group by card
      // and then sort by flatColor to group by color
      // to group identical cards
      return groupedBySortKey[sortKey]
        .sort((a, b) => (a.scryId > b.scryId ? 1 : -1))
        .sort((a, b) => {
          const fullA = cardStore[a.scryId]
          const fullB = cardStore[b.scryId]
          return fullA.flatColors > fullB.flatColors ? 1 : -1
        })
    })

    section.splice(0, section.length, ...sortedSection, [])

    if (typeof onComplete === 'function') onComplete()
  }

  const flatten = (section: CardSection) => {
    const flatSection = section
      .flat()
      .sort((a, b) => (a.scryId > b.scryId ? 1 : -1))
      .sort((a, b) => {
        const fullA = cardStore[a.scryId]
        const fullB = cardStore[b.scryId]
        return fullA.flatColors > fullB.flatColors ? 1 : -1
      })

    section.splice(0, section.length, flatSection, [])

    if (typeof onComplete === 'function') onComplete()
  }

  return {
    sort,
    flatten,
  }
}
