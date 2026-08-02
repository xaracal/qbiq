import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'
import { SkyPreset } from '@/lib/primevue-theme'

import './assets/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: SkyPreset,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
    },
  },
})
app.use(ToastService)

app.mount('#app')
