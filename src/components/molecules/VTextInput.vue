<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
})
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { useField } from 'vee-validate'

interface VTextInputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'date'
  label: string
  name: string
  value?: string
  readonly?: boolean
  theme?: 'auth'
}

const props = withDefaults(defineProps<VTextInputProps>(), {
  type: 'text',
  value: '',
  readonly: false,
  theme: 'auth',
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

const wrapperClasses: Record<string, string> = {
  auth: '',
}

const labelClasses: Record<string, string> = {
  auth: 'block xl:text-xl mb-1 dark:text-white',
}

const inputClasses: Record<string, string> = {
  auth: 'p-3 text-grey bg-white text-lg',
}

const marginMap: Record<string, string> = {
  auth: 'mb-3',
}

const borderColorMap: Record<string, string> = {
  auth: 'border-blue-medium',
}

const errorWrapperClasses = computed(() =>
  errorMessage.value ? marginMap[props.theme] : 'mb-3'
)

const validationClasses = computed(() =>
  meta.valid && !props.readonly
    ? 'border-green-medium'
    : borderColorMap[props.theme]
)
</script>

<template>
  <div :class="wrapperClasses[theme]">
    <label :class="labelClasses[theme]" :for="name">
      {{ label }}
    </label>

    <div class="w-full">
      <input
        v-bind="$attrs"
        :value="inputValue"
        :id="name"
        :name="name"
        :type="type"
        :readonly="readonly"
        class="w-full border-2 rounded-lg focus:outline-none"
        :class="[
          inputClasses[theme],
          validationClasses,
          readonly ? 'bg-gray-300 cursor-not-allowed' : '',
        ]"
        @input="handleChange"
        @blur="handleBlur"
      />

      <div :class="errorWrapperClasses">
        <p v-if="errorMessage" class="mt-1 text-sm text-red-500">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>
