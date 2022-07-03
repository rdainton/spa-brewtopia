<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

// Types
import { DecklistSectionName } from '@/types/cards'

// Composables
import useToasts from '@/composables/useToasts'
import useExport, { Config } from '@/composables/useExport'

// Store
import { useDecklistStore } from '@/stores/useDecklistStore'
import { useCardStore } from '@/stores/useCardStore'

// Components
import BrewText from '@/components/atoms/BrewText.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import BrewButton from '@/components/molecules/BrewButton.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import BrewTitle from '@/components/atoms/BrewTitle.vue'

// Icons
import CloseIcon from '@/components/atoms/icons/CloseIcon.vue'
import ClipboardIcon from '@/components/atoms/icons/ClipboardIcon.vue'
import DocumentIcon from '@/components/atoms/icons/DocumentIcon.vue'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const cardStore = useCardStore()
const decklistStore = useDecklistStore()
const { decklist, name } = storeToRefs(decklistStore)

const dispatch = useToasts()

const config = ref<Config>({
  zones: [DecklistSectionName.MAINBOARD, DecklistSectionName.SIDEBOARD],
  withSet: true,
  withX: true,
})

const { exportToTxtFile, exportToClipboard } = useExport(
  decklist,
  name,
  cardStore.cards,
  config
)

const options = [
  { value: '1', label: '1 cardname', meta: { withSet: false, withX: false } },
  { value: '2', label: '1x cardname', meta: { withSet: false, withX: true } },
  {
    value: '3',
    label: '1 cardname (set)',
    meta: { withSet: true, withX: false },
  },
  {
    value: '4',
    label: '1x cardname (set)',
    meta: { withSet: true, withX: true },
  },
]

const outputFormat = ref(options[0].value)

function prepareConfig() {
  config.value = {
    ...config.value,
    ...options.find(opt => opt.value === outputFormat.value)?.meta,
  }
}

function handleExportToTxtFile() {
  prepareConfig()
  exportToTxtFile()
  emit('close')
}

async function handleExportToClipboard() {
  prepareConfig()

  try {
    await exportToClipboard()
    dispatch.successToast('Decklist copied to your clipboard', 'Copied')
  } catch {
    dispatch.errorToast('Error copying to clipboard')
  } finally {
    emit('close')
  }
}
</script>

<template>
  <div
    class="flex flex-col justify-between px-4 pt-4 pb-10 rounded-md shadow-inner bg-smoke-medium max-h-modal-content shadow-pink-light/100"
  >
    <header class="relative flex justify-between mb-6">
      <div>
        <BrewTitle>Export Decklist</BrewTitle>
        <BrewText extend-classes="mt-2"
          >Pick how you want your decklist to be formatted, then click on your
          desired export type.</BrewText
        >
        <BrewText extend-classes="mt-2"
          >Note: Your "Maybes" will not be included in the export.</BrewText
        >
      </div>

      <IconButton size="lg" @click="$emit('close')">
        <CloseIcon />
      </IconButton>
    </header>

    <form>
      <SelectInput :options="options" v-model="outputFormat" />
    </form>

    <div class="flex mt-6 gap-x-2">
      <BrewButton size="md" @click="handleExportToClipboard"
        ><template #icon><ClipboardIcon /></template>Clipboard</BrewButton
      >
      <BrewButton size="md" @click="handleExportToTxtFile"
        ><template #icon><DocumentIcon /></template>.txt</BrewButton
      >
    </div>
  </div>
</template>
