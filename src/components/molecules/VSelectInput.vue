<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
})
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { useField } from 'vee-validate'

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

const wrapperClasses: Record<Theme, string> = {
  base: '',
}

const labelClasses: Record<Theme, string> = {
  base: 'block xl:text-xl mb-1 text-white',
}

const inputThemeClasses: Record<Theme, string> = {
  base: 'p-3 bg-black text-gray-100 text-lg rounded-lg',
}

const borderColorMap: Record<Theme, string> = {
  base: 'border-gray-700',
}

const errorClassesMap: Record<Theme, string> = {
  base: 'mb-3',
}

const borderClasses = computed(() => {
  if (meta.valid) return 'border-green-500'
  return borderColorMap[props.theme]
})
</script>

<template>
  <div :class="wrapperClasses[theme]">
    <label :class="labelClasses[theme]">
      {{ label }}
    </label>

    <select
      :value="inputValue"
      class="w-full border-2 focus:outline-none"
      :class="[inputThemeClasses[theme], borderClasses]"
      v-bind="$attrs"
      :readonly="readonly || busy"
      :name="name"
      @input="handleChange"
      @blur="handleBlur"
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

    <div :class="errorClassesMap[props.theme]">
      <p v-if="errorMessage" class="mt-1 text-sm text-red-500">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
