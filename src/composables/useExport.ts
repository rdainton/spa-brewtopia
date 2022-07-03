import { nextTick, ref, readonly, Ref } from 'vue'
import {
  DecklistContent,
  DecklistSection,
  CardProxy,
  CardStoreable,
  DecklistSectionName,
} from '@/types/cards'

export interface Config {
  zones: DecklistSectionName[]
  withX: boolean
  withSet: boolean
}

/**
 * Generate an downloadable export of a Decklist
 */
export default function useExport(
  decklist: Ref<DecklistContent>,
  decklistName: Ref<string>,
  cardStore: Record<CardStoreable['id'], CardStoreable>,
  config: Ref<Config>
) {
  const exportUrl = ref('')

  const revokeExportUrl = (): void => {
    if (exportUrl.value) {
      // Delete any previous ObjectUrl on the window if not already done so.
      // This prevents memory leaks
      window.URL.revokeObjectURL(exportUrl.value)
      exportUrl.value = ''
    }
  }

  const generateFileName = (): string => {
    if (!decklistName.value) return 'decklist'

    return decklistName.value.trim().replaceAll(' ', '_')
  }

  const generateOutputForSection = (
    section: DecklistSection,
    sectionName: string,
    withSet: boolean,
    withX: boolean
  ): string[] => {
    const flatSection = section.flat() // requires polyfill for IE support

    if (!flatSection.length) return []

    const groupedByCardName = flatSection.reduce(
      (map: { [key: string]: CardProxy[] }, x) => {
        const fullCard = cardStore[x.scryId]
        ;(map[fullCard['name']] = map[fullCard['name']] || []).push(x)
        return map
      },
      {}
    )

    const output = [`${sectionName}\n`]
    // generate string from card name + count
    for (const key in groupedByCardName) {
      const set = withSet
        ? ` (${cardStore[groupedByCardName[key][0].scryId].set})`
        : ''
      output.push(
        `${groupedByCardName[key].length}${withX ? 'x' : ''} ${key}${set}\n`
      )
    }
    output.push('\n')

    return output
  }

  const generateOutput = () => {
    const output: string[] = []

    const { zones, withSet, withX } = config.value
    // I want to force this ordering in the output.
    if (zones.includes(DecklistSectionName.MAINBOARD))
      output.push(
        ...generateOutputForSection(
          decklist.value.mainboard,
          'Deck',
          withSet,
          withX
        )
      )
    if (zones.includes(DecklistSectionName.SIDEBOARD))
      output.push(
        ...generateOutputForSection(
          decklist.value.sideboard,
          'Sideboard',
          withSet,
          withX
        )
      )
    // if (zones.includes(DecklistSectionName.MAYBES))
    //   output.push(
    //     ...generateOutputForSection(
    //       decklist.value.maybes,
    //       'Maybes',
    //       withSet,
    //       withX
    //     )
    //   )

    return output
  }

  /**
   * Create a temporary a tag on the window,
   * and programmatically trigger a mouse-click
   */
  const triggerDownload = (): void => {
    const link = document.createElement('a')
    // 'download' attribute is suggested filename
    link.setAttribute('download', generateFileName())
    link.href = exportUrl.value
    document.body.appendChild(link)

    // need to wait for the DOM to update with the new link
    // before it can be clicked
    nextTick(() => {
      link.dispatchEvent(new MouseEvent('click'))

      document.body.removeChild(link)
      revokeExportUrl()
    })
  }

  const createTxtFileUrl = () => {
    revokeExportUrl()

    const output = generateOutput()

    const blob = new Blob(output, { type: 'text/plain' })

    exportUrl.value = window.URL.createObjectURL(blob)
  }

  const exportToTxtFile = () => {
    createTxtFileUrl()

    if (exportUrl.value) triggerDownload()
  }

  const exportToClipboard = () => {
    return navigator.clipboard.writeText(generateOutput().join(''))
  }

  return {
    exportToClipboard,
    exportToTxtFile,
    // may want to handle the below as individual steps
    // externally to this hook - via a 'Download' button
    createTxtFileUrl,
    exportUrl: readonly(exportUrl),
    revokeExportUrl,
  }
}
