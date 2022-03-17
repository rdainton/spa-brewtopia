<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useToasts from '@/composables/useToasts'
import brewtopia from '@/apis/brewtopia'

// Form
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Store
import { useAuthStore } from '@/stores/useAuthStore'

// Types
import { Authable, Registerable } from '@/apis/brewtopia/auth'

// Utils
import { parseErrorMap } from '@/apis/brewtopia'

// Components
import AuthLayout from '@/components/layouts/AuthLayout.vue'
import VTextInput from '@/components/molecules/VTextInput.vue'
import BrewTitle from '@/components/atoms/BrewTitle.vue'
import BrewButton from '@/components/molecules/BrewButton.vue'
import BrewMessage from '@/components/molecules/BrewMessage.vue'

const authStore = useAuthStore()
const router = useRouter()
const dispatch = useToasts()

const working = ref(false)
const submissionError = ref('')

// init the reset form
const registrationSchema: yup.SchemaOf<Registerable> = yup.object({
  name: yup.string().max(255).required('This field is required.').defined(),
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
})

const { handleSubmit } = useForm({
  validationSchema: registrationSchema,
})

// handle reset
const onSubmit = handleSubmit((values, actions) => {
  submissionError.value = ''
  working.value = true

  brewtopia.auth
    .register(values as Registerable)
    .then(() => {
      // attempt login
      authStore
        .login({
          email: values.email,
          password: values.password,
        } as Authable)
        .then(res => {
          dispatch.successToast(
            `Welcome ${res.name}`,
            'Registration successful'
          )
          router.push({ name: 'deckbuilder' })
        })
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
    <BrewTitle>Register</BrewTitle>

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
        <VTextInput name="name" type="text" label="Name" maxlength="255" />
        <VTextInput
          name="email"
          type="email"
          label="Email Address"
          maxlength="255"
        />
        <VTextInput
          name="password"
          type="password"
          label="Password"
          minlength="8"
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
        Register Account
      </BrewButton>
    </form>
  </AuthLayout>
</template>
