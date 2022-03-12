<script lang="ts" setup>
import { ref } from 'vue'
import brewtopia from '@/apis/brewtopia'
import useToasts from '@/composables/useToasts'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Types
import { Resetable } from '@/apis/brewtopia/auth'

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

// extract token and user
// email from the route query
//
// NOTE: validation that they exist
// occurs in a router middleware.
const route = useRoute()

type ResetQuery = {
  email: string
  token: string
}

const { email, token } = route.query as ResetQuery

// init the reset form
const resetSchema: yup.SchemaOf<Resetable> = yup.object({
  email: yup
    .string()
    .max(255)
    .email('Please provide a valid email.')
    .required('This field is required.')
    .defined(),
  password: yup.string().max(50).required('This field is required.').defined(),
  password_confirmation: yup
    .string()
    .max(50)
    .oneOf([yup.ref('password'), ''], 'Password does not match.')
    .required('This field is required.')
    .defined(),
  token: yup.string().defined(),
})

const { handleSubmit } = useForm({
  validationSchema: resetSchema,
  initialValues: {
    email,
    token,
    password: '',
    password_confirmation: '',
  },
})

// handle reset
const router = useRouter()
const dispatch = useToasts()
const onSubmit = handleSubmit((values, actions) => {
  submissionError.value = ''
  working.value = true

  brewtopia.auth
    .resetPassword(values as Resetable)
    .then(() => {
      dispatch.successToast('Password changed successfully')
      actions.resetForm()
      router.push({ name: 'login' })
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
    <BrewTitle>Reset Password</BrewTitle>

    <form @submit="onSubmit" class="w-full mt-10">
      <BrewMessage
        v-if="submissionError"
        type="error"
        extend-wrapper-classes="-mt-6 mb-4"
      >
        {{ submissionError }}
      </BrewMessage>

      <fieldset :disabled="working">
        <!-- Fields -->
        <VTextInput
          name="email"
          type="email"
          label="Email Address"
          maxlength="255"
          readonly
        />
        <VTextInput
          name="password"
          type="password"
          label="Password"
          maxlength="50"
        />
        <VTextInput
          name="password_confirmation"
          type="password"
          label="Confirm Password"
          maxlength="50"
        />
      </fieldset>

      <!-- Submit -->
      <BrewButton theme="auth" size="full" type="submit" :working="working">
        Reset
      </BrewButton>

      <!-- Additional Options -->
      <div class="flex justify-center mt-8 text-sm text-gray-400 xl:text-base">
        <RouterLink :to="{ name: 'login' }" class="hover:underline">
          Back to login
        </RouterLink>
      </div>
    </form>
  </AuthLayout>
</template>
