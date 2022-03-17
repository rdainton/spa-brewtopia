import { nextTick, ref, readonly } from 'vue'
import { DecklistContent, CardSection, ICard } from '@/types/cards'

/**
 * Generate an downloadable export of a Decklist
 */
export default function useExport(decklist: DecklistContent) {
  const exportUrl = ref('')

  const revokeExportUrl = (): void => {
    if (exportUrl.value) {
      // Delete any previous ObjectUrl on the window if not already done so.
      // This prevents memory leaks
      window.URL.revokeObjectURL(exportUrl.value)
      exportUrl.value = ''
    }
  }

  const generateOutputForSection = (
    section: CardSection,
    sectionName: string
  ): string[] => {
    const flatSection = section.flat() // requires polyfill for IE support

    if (!flatSection.length) return []

    const groupedByCardName = flatSection.reduce(
      (map: { [key: string]: ICard[] }, x) => {
        ;(map[x['name']] = map[x['name']] || []).push(x)
        return map
      },
      {}
    )

    const output = [`// ${sectionName}\n`]
    // generate string from card name + count
    for (const key in groupedByCardName) {
      output.push(`${groupedByCardName[key].length}x ${key}\n`)
    }
    output.push('\n')

    return output
  }

  const generateOutput = (): string[] => {
    return [
      ...generateOutputForSection(decklist.mainboard, 'Mainboard'),
      ...generateOutputForSection(decklist.maybes, 'Maybes'),
      ...generateOutputForSection(decklist.sideboard, 'Sideboard'),
    ]
  }

  /**
   * Create a temporary a tag on the window,
   * and programmatically trigger a mouse-click
   */
  const triggerDownload = (): void => {
    const link = document.createElement('a')
    // 'download' attribute is suggested filename
    link.setAttribute('download', 'decklist.txt')
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

  return {
    exportToTxtFile,
    // may want to handle the below as individual steps
    // externally to this hook - via a 'Download' button
    createTxtFileUrl,
    exportUrl: readonly(exportUrl),
    revokeExportUrl,
  }
}
