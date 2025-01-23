import './assets/main.css'

import { createApp, provide,ref } from 'vue'
import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'
import tool from './script/tools.ts'



const app = createApp(App)

// 使用路由
app.use(router)

// 全局注册
const audio:HTMLAudioElement = new Audio()
app.provide('audio',audio)

app.provide('playlists',ref(0))

app.use(tool)

const sourceList = ['推荐','bili','wangyi','kuwo']
const source = ref(sourceList[3])
app.provide('source',source)
app.provide('sourceList',sourceList)
// 使用图片懒加载
app.use(VueLazyload, {
    preLoad: 1.2, // 预加载高度比例，默认值为1.3
    error: '', // 图片加载失败时显示的图片路径
    loading: '', // 图片加载时显示的占位图路径
    attempt: 3 // 尝试加载次数，默认值为3
});



app.mount('#app')
