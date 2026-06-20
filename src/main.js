import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import vi from 'element-plus/es/locale/lang/vi'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { Icon } from '@iconify/vue'        // ← THÊM DÒNG NÀY
import 'element-plus/dist/index.css'
import './index.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(ElementPlus, { locale: vi })
app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('iconify-icon', Icon)        // ← THÊM DÒNG NÀY

app.mount('#app')