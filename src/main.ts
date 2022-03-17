import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'

import App from '@/App.vue'
import '@/assets/styles/index.css'

/**
 * Create the application instance.
 */
createApp(App).use(createPinia()).use(router).mount('#app')
