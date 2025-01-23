import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/home/search.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'search',
            component:Home
        },
        {
            path:'/download',
            name:'download',
            component:() => import('../views/home/download.vue')
        },
        {
            path:'/mylist/like',
            name:'like',
            component:() => import("../views/mylist/like.vue")
        },
        {
            path:'/mylist/collect',
            name:'collect',
            component:() => import('../views/mylist/collect.vue')
        },
        {
            path:'/setting/back',
            name:'back',
            component:() => import('../views/setting/back.vue')
        },
        {
            path:'/setting/about',
            name:'about',
            component:() => import('../views/setting/about.vue')
        },
        {
            path:'/tools/toGif',
            name:'toGif',
            component:() => import('../views/tools/toGif.vue')
        }
    ],
})

export default router
