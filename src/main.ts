import { createApp } from 'vue'
import App from './App.vue'

// 样式相关
import 'normalize.css'
import '@/assets/css/index.css'

// 路由相关
import router from '@/routers'

// 状态管理相关
import pinia from '@/storages'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
