import { createApp } from 'vue'
import store from '@/store'
import router from '@/router'

import App from '@/App.vue'
import '@/assets/styles/index.css'

/**
 * Create the application instance.
 */
createApp(App).use(store).use(router).mount('#app')
