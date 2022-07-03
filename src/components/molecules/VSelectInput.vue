<script lang="ts" setup>
import { useField } from 'vee-validate'
import SelectInput from '@/components/atoms/SelectInput.vue'

type Theme = 'base'

interface VSelectInputProps {
  busy?: boolean
  label: string
  name: string
  options: { value: string; label: string }[]
  value?: string
  theme?: Theme
  readonly?: boolean
}

const props = withDefaults(defineProps<VSelectInputProps>(), {
  busy: false,
  theme: 'base',
  value: '',
})

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(
  props.name,
  '', // no validator as using form-level-validation
  {
    initialValue: props.value,
  }
)

const errorClassesMap: Record<Theme, string> = {
  base: 'mb-3',
}
</script>

<template>
  <SelectInput
    :value="inputValue"
    :disabled="readonly || busy"
    :options="options"
    :name="name"
    @input="handleChange"
    @blur="handleBlur"
  >
    <template #label>{{ label }}</template>
    <template #message
      ><div :class="errorClassesMap[props.theme]">
        <p v-if="errorMessage" class="mt-1 text-sm text-red-500">
          {{ errorMessage }}
        </p>
      </div></template
    >
  </SelectInput>
</template>
