<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
})
</script>

<script lang="ts" setup>
type Theme = 'base'

interface Option {
  value: string
  label: string
}

interface SelectInputProps {
  options: Option[]
  modelValue?: string
  theme?: Theme
}

const props = withDefaults(defineProps<SelectInputProps>(), {
  theme: 'base',
  modelValue: '',
})

defineEmits<{
  (e: 'update:modelValue', value: Option['value']): void
}>()

const wrapperClasses: Record<Theme, string> = {
  base: '',
}

const labelClasses: Record<Theme, string> = {
  base: 'block xl:text-xl mb-1 text-blue-light',
}

const inputThemeClasses: Record<Theme, string> = {
  base: 'p-3 bg-black/20 text-gray-100 text-lg rounded-md border-transparent',
}
</script>

<template>
  <div :class="wrapperClasses[theme]">
    <label v-if="$slots.label" :class="labelClasses[theme]">
      <slot name="label" />
    </label>

    <select
      :value="modelValue"
      class="w-full border-2 focus:outline-none"
      :class="inputThemeClasses[theme]"
      v-bind="$attrs"
      @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option disabled value="">...</option>
      <option
        v-for="option in options"
        :value="option.value"
        :key="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <slot name="message" />
  </div>
</template>
