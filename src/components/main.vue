<template>
    <MainMenu :show="showMenu"/>
    <Playlist/>
    <Background />
    <header>
        <div class="nav">
        <div class="left">
            <div class="menu" @click="openMenu"></div>
            <div class="user"></div>
            <div class="theme" @click="changetheme" :style="{backgroundImage:`url(${themeurl})`}"></div>
        </div>
        <div class="title">XMmusic</div>
        <div class="right">
            <div class="min" @click="minwindow">--</div>
            <div class="max" @click="maxwindow">▢</div>
            <div class="close" @click="closewindow">×</div>
        </div>
    </div>
    </header>
    <div class="content">
        <slot name="content"></slot>
    </div>
    <footer>
        <Player />
    </footer>
</template>

<script lang="ts" setup>

import {images,theme} from "../script/images"


import Player from "@/components/player.vue"
import Background from "@/components/background.vue"
import Playlist from "@/components/playlist.vue"
import MainMenu from "@/components/menu.vue"

import {ref,provide, type Ref} from "vue"

// 播放列表显示
const showlist = ref(0)
provide("showlist",showlist)


// 切换主题
let themeurl = ref(images.dark.light)
function changetheme(){
    theme.value = !theme.value
    themeurl.value = theme.value ? images.light.dark : images.dark.light
    document.startViewTransition(() => {
        document.documentElement.classList.toggle("light")
    })
}
// 最小化窗口
function minwindow(){
    window.electronAPI.minWindow()
}
// 最大化窗口
async function maxwindow(){
    let isMax = await window.electronAPI.isMaximized();
    if (isMax){
        window.electronAPI.unmaxWindow()
    }else{
        window.electronAPI.maxWindow()
    }
}
// 关闭窗口
function closewindow(){
    window.electronAPI.closeWindow()
}

// 主菜单显示
const showMenu = ref(false)
function openMenu(){
    showMenu.value = !showMenu.value
}
</script>




<style scoped>
    .nav{
        --height:40px;
        --border-color:var(--main-border-c);
        --border-radius:5px;
        --background-color:var(--main-tit-bg);
        --background-color-hover:var(--main-tit-bg-hover);
        --text-color:var(--main-text-c);
        --text-color-hover:var(--main-text-c-hover);

        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-top:10px;
        height:var(--height);
        width:100%;
        -webkit-user-select: none;
    }
    .nav > .left{
        z-index:999;
        display:flex;
        align-items:center;
        justify-content:start;
        margin-left:10px;
        gap:10px;
        width:15%;
        height:100%;
    }
    .nav > .title{
        z-index:999;
        display:flex;
        justify-content:center;
        align-items:center;
        width:70%;
        height:100%;
        border:1px solid var(--border-color);
        border-radius:var(--border-radius);
        background-color:var(--background-color);
        color:var(--text-color-hover);
        font-size:20px;
        -webkit-app-region:drag;
    }
    .nav > .right{
        z-index:999;
        display:flex;
        align-items:center;
        justify-content:space-evenly;
        margin-right:10px;
        margin-left:5%;
        width:10%;
        height:100%;
        border:1px solid var(--border-color);
        border-radius:var(--border-radius);
        color:var(--text-color);
        background-color:var(--background-color);
        font-size:20px;
        transition:.2s;
    }
    .nav > .right:hover{
        background-color:var(--background-color-hover);
    }
    .nav > .left > div{
        width:var(--height);
        height:var(--height);
        border:1px solid var(--border-color);
        border-radius:var(--border-radius);
        background-color:var(--background-color);
        cursor:pointer;
    }
    .nav > .left > .menu{
        background-image:url("@/../public/images/dark/menu.png");
        background-position:center;
        background-repeat:no-repeat;
        background-size:cover;
    }
    .nav > .left > .menu:hover{
        background-color:var(--background-color-hover);
    }
    .nav > .left > .user{
        background-image:url("@/../public/images/dark/user.png");
        background-position:center;
        background-repeat:no-repeat;
        background-size:cover;
    }
    .nav > .left > .user:hover{
        background-color:var(--background-color-hover);
    }
    .nav > .left > .theme{
        background-image:url("@/../public/images/dark/light.png");
        background-position:center;
        background-repeat:no-repeat;
        background-size:cover;
    }
    .nav > .left > .theme:hover{
        background-color:var(--background-color-hover);
    }
    .nav > .right > div{
        display:flex;
        justify-content:center;
        align-items:center;
        width:var(--height);
        height:var(--height);
        cursor:pointer;
    }
    .nav > .right > div:hover{
        color:var(--text-color-hover);
    }

    .content{
        display:flex;
        align-items: center;
        justify-content: center;
        margin-top:2vh;
        width:100%;
        height:80vh;
    }
</style>