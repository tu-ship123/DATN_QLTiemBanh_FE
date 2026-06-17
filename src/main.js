import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import vi from 'element-plus/es/locale/lang/vi'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './index.css'
import App from './App.vue'
import router from './router'
// Load Iconify dynamically to avoid build-time failure if the package is not installed
let Icon
import('@iconify/vue').then(mod => { Icon = mod.default; try { app.component('Icon', Icon) } catch (e) {} }).catch(() => { console.warn('@iconify/vue not installed; icons will use fallbacks') })

const app = createApp(App)

// Register Element Plus and all icons globally
app.use(ElementPlus, { locale: vi })
app.use(router)

// Register Iconify Icon component globally for convenient icon use
// If Icon is already loaded above, it will be registered; otherwise the dynamic import will register it when ready.

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')