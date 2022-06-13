<script lang="ts" setup>
import { ref, computed } from 'vue'
import { parseErrorMap } from '@/apis/brewtopia'

// Composables
import useToasts from '@/composables/useToasts'

// Stores
import { useDecklistStore } from '@/stores/useDecklistStore'
import { useCardStore } from '@/stores/useCardStore'

// Form
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Components
import BrewText from '@/components/atoms/BrewText.vue'
import VTextInput from '@/components/molecules/VTextInput.vue'
import VSelectInput from '@/components/molecules/VSelectInput.vue'
import BrewButton from '@/components/molecules/BrewButton.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import BrewTitle from '@/components/atoms/BrewTitle.vue'
import BrewMessage from '@/components/molecules/BrewMessage.vue'

// Icons
import CloseIcon from '@/components/atoms/icons/CloseIcon.vue'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const decklistStore = useDecklistStore()

const working = ref(false)

const schema: yup.SchemaOf<{ name: string; coverImageUrl: string }> =
  yup.object({
    name: yup
      .string()
      .max(25)
      .required('You must provide a decklist name.')
      .defined(),
    coverImageUrl: yup.string().defined(),
  })

const { handleSubmit, values, meta } = useForm({
  validationSchema: schema,
})

const dispatch = useToasts()

const submissionError = computed(() => {
  if (!decklistStore.error) return null
  return parseErrorMap(decklistStore.error)
})

const showUnsavedChangesInfo = computed(
  () => meta.value.dirty && decklistStore.unsavedChanges
)

const onSubmit = handleSubmit(values => {
  decklistStore.name = values.name as string

  if (values.coverImageUrl) {
    decklistStore.coverImageUrl = values.coverImageUrl
  }

  decklistStore
    .saveChanges()
    .then(() => {
      dispatch.successToast('Saved successfully.')
      emit('close')
    })
    .catch(_ => {}) // Handled via a computed.
})

/**
 * Cover Image
 */
const cardStore = useCardStore()

const coverImageOptions = computed(() =>
  decklistStore.uniqueCardIds
    .filter(id => !!cardStore.cards[id])
    .map(id => {
      let value = cardStore.cards[id].imgCover
      if (!value) {
        value = cardStore.cards[id].cardFaces?.[0].imgCover ?? ''
      }

      return {
        value,
        label: cardStore.cards[id].name,
      }
    })
)

const coverImagePreviewUrl = computed(
  () => values.coverImageUrl || decklistStore.coverImageUrl
)
</script>

<template>
  <div
    class="flex flex-col p-4 rounded-md shadow-xl max-h-modal-content bg-gray-50 dark:bg-gray-600 min-h-150"
  >
    <header class="relative flex justify-between mb-4">
      <div>
        <BrewTitle>Deck Details</BrewTitle>
      </div>

      <IconButton size="lg" @click="$emit('close')">
        <CloseIcon />
      </IconButton>
    </header>

    <form
      @submit.prevent="onSubmit"
      class="flex flex-col flex-1 w-full h-full overflow-y-auto"
    >
      <BrewMessage
        v-if="submissionError"
        variant="error"
        extend-wrapper-classes="mb-4"
      >
        {{ submissionError }}
      </BrewMessage>

      <fieldset :disabled="working || decklistStore.loading" class="relative">
        <!-- Fields -->
        <VTextInput
          name="name"
          type="text"
          label="Name"
          placeholder="Enter deck name..."
          :value="decklistStore.name"
          maxlength="25"
        />

        <VSelectInput
          v-show="coverImageOptions.length"
          name="coverImageUrl"
          label="Cover Image"
          :options="coverImageOptions"
          :value="decklistStore.coverImageUrl"
        />

        <BrewText extend-classes="my-6" v-if="!coverImageOptions.length">
          Tip: add some cards to your deck for options to update the cover
          image.
        </BrewText>

        <div
          v-if="coverImagePreviewUrl"
          class="mb-4 overflow-hidden rounded-lg"
        >
          <img
            class="object-cover w-full max-w-full h-88"
            :src="coverImagePreviewUrl"
            alt="Deck Cover Image"
          />
        </div>
      </fieldset>

      <BrewMessage
        v-if="showUnsavedChangesInfo"
        variant="info"
        extend-wrapper-classes="mb-4"
      >
        You have unsaved card choice changes. Saving your Deck Details will also
        save your card choices.
      </BrewMessage>

      <div class="flex justify-end mt-auto">
        <BrewButton type="submit" size="sm" :working="working">Save</BrewButton>
      </div>
    </form>
  </div>
</template>
