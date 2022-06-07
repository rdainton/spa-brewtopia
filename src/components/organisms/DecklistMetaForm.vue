<script lang="ts" setup>
import { ref, computed } from 'vue'
import { parseErrorMap } from '@/apis/brewtopia'

// Composables
import useToasts from '@/composables/useToasts'

// Stores
import { useDecklistStore } from '@/stores/useDecklistStore'

// Form
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Components
import VTextInput from '@/components/molecules/VTextInput.vue'
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

const schema: yup.SchemaOf<{ name: string }> = yup.object({
  name: yup
    .string()
    .max(25)
    .required('You must provide a decklist name.')
    .defined(),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
})

const dispatch = useToasts()

const submissionError = computed(() => {
  if (!decklistStore.error) return null
  return parseErrorMap(decklistStore.error)
})

const onSubmit = handleSubmit(values => {
  decklistStore.name = values.name as string

  decklistStore
    .saveChanges()
    .then(() => {
      dispatch.successToast('Saved successfully.')
      emit('close')
    })
    .catch(_ => {}) // Handled via a computed.
})
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

    <form @submit.prevent="onSubmit" class="flex flex-col flex-1 w-full">
      <BrewMessage
        v-if="submissionError"
        type="error"
        extend-wrapper-classes="-mt-6 mb-4"
      >
        {{ submissionError }}
      </BrewMessage>

      <fieldset
        :disabled="working || decklistStore.loading"
        class="relative w-1/2"
      >
        <!-- Fields -->
        <VTextInput
          name="name"
          type="text"
          label="Name"
          placeholder="Enter deck name..."
          :value="decklistStore.name"
          maxlength="25"
        />
      </fieldset>

      <div class="flex justify-end mt-auto">
        <BrewButton type="submit" size="sm" :working="working">Save</BrewButton>
      </div>
    </form>
  </div>
</template>
