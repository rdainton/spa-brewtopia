<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import useToasts from '@/composables/useToasts'

// Form
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Store
import { useStore } from 'vuex'
import { ActionTypes as AuthActions } from '@/store/auth/actions'
import { GetterTypes as AuthGetters } from '@/store/auth/getters'

// Types
import { Authable } from '@/apis/brewtopia/auth'

// Utils
import { parseErrorMap } from '@/apis/brewtopia'

// Components
import AuthLayout from '@/components/layouts/AuthLayout.vue'
import VTextInput from '@/components/molecules/VTextInput.vue'
import BrewButton from '@/components/molecules/BrewButton.vue'
import BrewMessage from '@/components/molecules/BrewMessage.vue'

const store = useStore()
const router = useRouter()
const dispatch = useToasts()

const submissionError = computed(() =>
  parseErrorMap(store.getters[AuthGetters.ERROR])
)

const working = computed(() => store.getters[AuthGetters.LOADING])

const authSchema: yup.ObjectSchema<Authable> = yup
  .object({
    email: yup
      .string()
      .max(255)
      .email('Please provide a valid email.')
      .required('This field is required.'),
    password: yup.string().max(50).required('This field is required.'),
  })
  .defined()

const { handleSubmit } = useForm({
  validationSchema: authSchema,
})

const onSubmit = handleSubmit(values => {
  store
    .dispatch(AuthActions.LOGIN, values)
    .then(({ name }) => {
      dispatch.successToast(`Welcome ${name}`, 'Login Success')
      router.push({ name: 'deckbuilder' })
    })
    .catch(_ => {}) // Handled via a computed.
})
</script>

<template>
  <AuthLayout>
    <form @submit="onSubmit" class="w-full mt-12 lg:mt-16">
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
        />
        <VTextInput
          name="password"
          type="password"
          label="Password"
          maxlength="50"
        />
      </fieldset>

      <!-- Additional Options -->
      <div class="flex justify-end my-4 text-sm text-gray-400 xl:text-base">
        <RouterLink :to="{ name: 'forgot-password' }" class="hover:underline">
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
