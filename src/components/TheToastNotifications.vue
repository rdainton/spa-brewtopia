<script lang="ts" setup>
import { computed } from 'vue'
import { useToastsStore } from '@/stores/useToastsStore'
import { NotificationType } from '@/types/toasts'

// Icons
import WarningIcon from '@/components/atoms/icons/WarningIcon.vue'
import ErrorIcon from '@/components/atoms/icons/ErrorIcon.vue'
import InfoIcon from '@/components/atoms/icons/InfoIcon.vue'
import SuccessIcon from '@/components/atoms/icons/SuccessIcon.vue'
import CloseIcon from '@/components/atoms/icons/CloseIcon.vue'

const toastsStore = useToastsStore()

const toastsArray = computed(() => toastsStore.toasts)

const backgroundStylesMap: Record<NotificationType, string> = {
  [NotificationType.info]: 'from-blue-500',
  [NotificationType.error]: 'from-red-500',
  [NotificationType.warning]: 'from-green-500',
  [NotificationType.success]: 'from-green-500',
}

const componentMap: Record<NotificationType, any> = {
  [NotificationType.info]: InfoIcon,
  [NotificationType.error]: ErrorIcon,
  [NotificationType.warning]: WarningIcon,
  [NotificationType.success]: SuccessIcon,
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="toastsArray.length"
      class="fixed right-0 z-50 flex flex-col-reverse items-center mr-2 pointer-events-none bottom-4 top-20 w-96"
    >
      <div
        v-for="toast in toastsArray"
        :key="toast.uuid"
        class="w-full mb-3 transition-opacity duration-300 ease-linear bg-gray-100 rounded-md shadow-lg pointer-events-auto dark:bg-gray-900 bg-gradient-to-r via-bg-gray-100 dark:via-bg-gray-900"
        :class="[
          toast.removing || toast.new ? 'opacity-0' : '',
          !toast.removing && !toast.new ? 'opacity-100' : '',
          backgroundStylesMap[toast.type],
        ]"
      >
        <div class="w-full rounded-sm shadow-xs">
          <div class="relative flex items-center flex-1 p-2 md:p-3">
            <span
              class="flex items-center justify-center w-8 h-8 mr-3 text-gray-900 shrink-0 dark:text-white md:w-10 md:h-10"
            >
              <component :is="componentMap[toast.type]" />
            </span>
            <section class="text-gray-900 dark:text-white">
              <header class="text-base font-bold leading-snug md:text-lg">
                {{ toast.heading }}
              </header>
              <p class="text-sm">
                {{ toast.content }}
              </p>
            </section>
            <button
              class="absolute flex w-4 h-4 text-gray-900 dark:text-white top-2 right-2 active:outline-none focus:outline-none"
              @click="toastsStore.remove(toast.uuid!)"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
