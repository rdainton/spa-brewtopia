<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

// Stores
import { useDecklistStore } from '@/stores/useDecklistStore'

// Form
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Components
import VTextInput from '@/components/molecules/VTextInput.vue'
import BrewButton from '@/components/molecules/BrewButton.vue'

const emit = defineEmits<{
  (event: 'updated', name: string): void
}>()

const decklistStore = useDecklistStore()

const working = ref(false)
const readonly = ref(true)

const schema: yup.SchemaOf<{ name: string }> = yup.object({
  name: yup
    .string()
    .max(25)
    .required('You must provide a decklist name.')
    .defined(),
})

const { handleSubmit, values, setValues } = useForm({
  validationSchema: schema,
})

const onSubmit = handleSubmit(values => {
  readonly.value = true
  emit('updated', values.name)
})

// this needs to only trigger on a decklist change.
watch(
  () => decklistStore.name,
  newName => {
    if (newName !== values.name) setValues({ name: newName })
  }
)

const showSubmitButton = computed(() => {
  return values.name !== decklistStore.name || decklistStore.unsavedChanges
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="w-96" @click="readonly = false">
    <fieldset
      :disabled="working || decklistStore.loading"
      class="relative mt-1"
    >
      <!-- Fields -->
      <VTextInput
        name="name"
        type="text"
        label="Currently Brewing"
        theme="discreet"
        placeholder="Enter deck name..."
        :readonly="readonly"
        :value="decklistStore.name"
        maxlength="25"
      />

      <span
        v-if="showSubmitButton"
        class="absolute transform -translate-y-1/2 right-4 top-10"
        ><BrewButton size="xs" type="submit">Save changes</BrewButton></span
      >
    </fieldset>
  </form>
</template>
