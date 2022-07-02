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

interface VTextInputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'date'
  label: string
  name: string
  value?: string
  readonly?: boolean
  theme?: Theme
}

const props = withDefaults(defineProps<VTextInputProps>(), {
  type: 'text',
  value: '',
  readonly: false,
  theme: 'base',
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

const inputClasses: Record<Theme, string> = {
  base: 'p-3 bg-black text-gray-100 text-lg rounded-lg',
}

const readonlyClasses: Record<Theme, string> = {
  base: 'bg-gray-300 cursor-not-allowed',
}

const errorClassesMap: Record<Theme, string> = {
  base: 'mb-3',
}

const borderColorMap: Record<Theme, string> = {
  base: 'border-gray-700',
}

const validationClasses = computed(() =>
  meta.valid && !props.readonly
    ? 'border-green-500'
    : borderColorMap[props.theme]
)
</script>

<template>
  <div :class="wrapperClasses[theme]">
    <label :class="labelClasses[theme]" :for="name">
      {{ label }}
    </label>

    <div class="relative w-full">
      <input
        v-bind="$attrs"
        :value="inputValue"
        :id="name"
        :name="name"
        :type="type"
        :readonly="readonly"
        class="w-full border-2 focus:outline-none"
        :class="[
          inputClasses[theme],
          validationClasses,
          readonly ? readonlyClasses[theme] : '',
        ]"
        @input="handleChange"
        @blur="handleBlur"
      />

      <div :class="errorClassesMap[props.theme]">
        <p v-if="errorMessage" class="mt-1 text-sm text-red-500">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>
