<script lang="ts" setup>
import { ref } from 'vue'
import brewtopia from '@/apis/brewtopia'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Types
import { Forgetable } from '@/apis/brewtopia/auth'

// Utils
import { parseErrorMap } from '@/apis/brewtopia'

// Components
import AuthLayout from '@/components/layouts/AuthLayout.vue'
import VTextInput from '@/components/molecules/VTextInput.vue'
import BrewTitle from '@/components/atoms/BrewTitle.vue'
import BrewButton from '@/components/molecules/BrewButton.vue'
import BrewMessage from '@/components/molecules/BrewMessage.vue'

const working = ref(false)
const submissionError = ref('')
const successMessage = ref('')

const forgotSchema: yup.SchemaOf<Forgetable> = yup.object({
  email: yup
    .string()
    .max(255)
    .email('Please provide a valid email.')
    .required('This field is required.')
    .defined(),
})

const { handleSubmit } = useForm({
  validationSchema: forgotSchema,
})

const onSubmit = handleSubmit((values, actions) => {
  submissionError.value = ''
  successMessage.value = ''
  working.value = true

  brewtopia.auth
    .forgotPassword(values as Forgetable)
    .then(res => {
      successMessage.value = res.data.message
      actions.resetForm()
    })
    .catch(err => {
      submissionError.value = parseErrorMap(err.response.data) || 'Bad request'
    })
    .finally(() => {
      working.value = false
    })
})
</script>

<template>
  <AuthLayout>
    <BrewTitle>Forgot Password</BrewTitle>

    <form @submit="onSubmit" class="w-full mt-10">
      <BrewMessage
        v-if="submissionError"
        variant="error"
        extend-wrapper-classes="-mt-6 mb-4"
      >
        {{ submissionError }}
      </BrewMessage>

      <BrewMessage
        v-if="successMessage"
        variant="success"
        extend-wrapper-classes="-mt-6 mb-4"
      >
        {{ successMessage }}
      </BrewMessage>

      <fieldset :disabled="working">
        <!-- Fields -->
        <VTextInput
          name="email"
          type="email"
          label="Email Address"
          maxlength="255"
        />
      </fieldset>

      <!-- Submit -->
      <BrewButton theme="auth" size="full" type="submit" :working="working">
        Request reset
      </BrewButton>

      <!-- Additional Options -->
      <div
        class="flex justify-center mt-8 text-sm text-gray-500 dark:text-gray-300 xl:text-base"
      >
        <RouterLink :to="{ name: 'login' }" class="hover:underline">
          Back to login
        </RouterLink>
      </div>
    </form>
  </AuthLayout>
</template>
