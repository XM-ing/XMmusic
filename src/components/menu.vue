<template>
    <div class="menu-con" :style="{transform:`translateX(${props.show? '0':'-300px'})`}">
        <ul>
            <li class="li-1" @click="showSub('home')">首页</li>
            <TransitionGroup
                    @before-enter="onBeforeEnter"
                    @enter="onEnter"
                    @leave="onBeforeLeave">
                <ul class='ul-2' v-if="showSubMenu.home">
                        <li class="li-2" @click="goto('/')">搜索</li>
                        <li class="li-2" @click="goto('/download')">下载</li>
                </ul>
            </TransitionGroup>

            <li class="li-1" @click="showSub('mylist')">我的歌单</li>
            <TransitionGroup
                    @before-enter="onBeforeEnter"
                    @enter="onEnter"
                    @leave="onBeforeLeave">
                    <ul class='ul-2' v-if="showSubMenu.mylist">
                        <li class="li-2" @click="goto('/mylist/like')">我喜欢</li>
                        <li class="li-2" @click="goto('/mylist/collect')">收藏</li>
                    </ul>
            </TransitionGroup>
            
            <li class="li-1" @click="showSub('tools')">工具</li>
            <TransitionGroup
                    @before-enter="onBeforeEnter"
                    @enter="onEnter"
                    @leave="onBeforeLeave">
                    <ul class="ul-2" v-if="showSubMenu.tools">
                        <li class="li-2" @click="goto('/tools/toGif')">视频转gif</li>
                    </ul>
            </TransitionGroup>

            <li class="li-1" @click="showSub('setting')">设置</li>
            <TransitionGroup
                    @before-enter="onBeforeEnter"
                    @enter="onEnter"
                    @leave="onBeforeLeave">
                    <ul class="ul-2" v-if="showSubMenu.setting">
                        <li class="li-2" @click="goto('/setting/back')">背景设置</li>
                        <li class="li-2" @click="goto('/setting/about')">关于</li>
                    </ul>
            </TransitionGroup>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import {RouterView, useRouter} from 'vue-router' 
import {ref,watch,defineProps} from 'vue'
import gsap from 'gsap'

// 路由跳转
const router = useRouter()

function goto(path:string){
    router.push(path)
}


// 子菜单显示
const showSubMenu:any = ref({
    "home":false,
    "mylist":false,
    'setting':false,
    "tools":false
})
function showSub(title:string){
    showSubMenu.value[title] = !showSubMenu.value[title]
}

// 子菜单显示动画
function onBeforeEnter(el:any){
    el.style.height = 0
}
function onEnter(el:any,done:any){
    gsap.to(el,{
        height:`${el.children.length * 40}px`,
        duration:.3,
        onComplete:done
    })
}
function onBeforeLeave(el:any,done:any){
    gsap.to(el,{
        height:0,
        duration:.3,
        onComplete:done
    })
}

// 主菜单显示
const props = defineProps(['show'])
</script>


<style scoped>
    .menu-con{
        z-index:999;
        position:absolute;
        top:55px;
        left:0;
        display:flex;
        flex-direction:column;
        justify-content:flex-start;
        align-items:center;
        height:calc(100% - 135px);
        width:300px;
        border-top-right-radius:5px;
        border-bottom-right-radius:5px;
        background-color:rgb(55,55,66);
        color:white;
        overflow:hidden;
        transition:.3s;
    }
    ul{
        width:100%;
        cursor:pointer;
    }
    .ul-2{
        overflow:hidden;
    }
    .li-1{
        display:flex;
        justify-content:center;
        align-items:center;
        width:100%;
        height:40px;
        border:1px solid rgba(255,255,255,0.1);
        font-weight:bold;
        background-color:rgba(33,33,33,.5);
        cursor:pointer;
    }
    .li-2{
        display:flex;
        justify-content:center;
        align-items:center;
        width:100%;
        height:40px;
        border:1px solid rgba(255,255,255,.1);
        background-color:rgba(100,100,110,.1);
        cursor:pointer;
    }
</style>