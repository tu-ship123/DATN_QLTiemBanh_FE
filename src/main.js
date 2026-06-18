import { createApp } from 'vue'
import { createPinia } from 'pinia' // 1. THÊM DÒNG NÀY
import ElementPlus from 'element-plus'
import vi from 'element-plus/es/locale/lang/vi'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './index.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia() // Dòng 9 của bạn giữ nguyên
// ... (đoạn load Iconify giữ nguyên) ...

const app = createApp(App)

app.use(pinia) // 2. THÊM DÒNG NÀY (Bắt buộc phải đứng sau createApp)
app.use(ElementPlus, { locale: vi })
app.use(router)


// Register Iconify Icon component globally for convenient icon use
// If Icon is already loaded above, it will be registered; otherwise the dynamic import will register it when ready.

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')