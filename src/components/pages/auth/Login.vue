<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import useToasts from '@/composables/useToasts'
import { routeNames } from '@/router'

// Form
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Store
import { useAuthStore } from '@/stores/useAuthStore'

// Types
import { Authable } from '@/apis/brewtopia/auth'

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

const submissionError = computed(() => {
  if (!authStore.error) return null
  return parseErrorMap(authStore.error)
})

const working = computed(() => authStore.loading)

const authSchema: yup.SchemaOf<Authable> = yup.object({
  email: yup
    .string()
    .max(255)
    .email('Please provide a valid email.')
    .required('This field is required.')
    .defined(),
  password: yup.string().max(50).required('This field is required.').defined(),
})

const { handleSubmit } = useForm({
  validationSchema: authSchema,
})

const onSubmit = handleSubmit(values => {
  authStore
    .login(values as Authable)
    .then(({ name }) => {
      dispatch.successToast(`Welcome ${name}`, 'Login Success')
      router.push({ name: routeNames.deckbuilder })
    })
    .catch(_ => {}) // Handled via a computed.
})
</script>

<template>
  <AuthLayout>
    <BrewTitle>Login</BrewTitle>

    <form @submit="onSubmit" class="w-full mt-10">
      <BrewMessage
        v-if="submissionError"
        variant="error"
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
        />
        <VTextInput
          name="password"
          type="password"
          label="Password"
          maxlength="50"
        />
      </fieldset>

      <!-- Additional Options -->
      <div
        class="flex flex-col items-end my-6 text-sm text-gray-300 gap-y-2 xl:text-base"
      >
        <RouterLink :to="{ name: routeNames.register }" class="hover:underline">
          Don't have an account? Register here.
        </RouterLink>

        <RouterLink
          :to="{ name: routeNames.forgotPassword }"
          class="hover:underline"
        >
          Forgot your password?
        </RouterLink>
      </div>

      <!-- Submit -->
      <BrewButton theme="auth" size="full" type="submit" :working="working">
        Sign In
      </BrewButton>
    </form>
  </AuthLayout>
</template>
