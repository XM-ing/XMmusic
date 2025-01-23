<template>
    <div class="container">
        <header>
        <div class="search">
            <input type="text" placeholder="搜索" v-model="key" @keydown.enter="search(key)"/>
        </div>
        <div class="source">
            <div class="recommend" :style="{color:selectColor('0')}" data-index="0" @click="changeSource">推荐</div>
            <div class="bili"  :style="{color:selectColor('1')}" data-index="1" @click="changeSource">b站</div>
            <div class="wangyi" :style="{color:selectColor('2')}" data-index="2" @click="changeSource">网易</div>
            <div class="kuwo"  :style="{color:selectColor('3')}" data-index="3" @click="changeSource">酷我</div>
        </div>
    </header>
    <main>
        <div class="loading" v-if="isLoading"></div>
        <TransitionGroup
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @leave="onLeave">
        <div v-for="(item,index) in items" :key="index">
            <div class="item">
                <div class="index">{{ index+1 }}</div>
                <div class="icon" :id="musicID[index]" @click="play" :data-index="index"><img v-lazy="imgurl[index]" :alt="imgurl[index]"></div>
                <div class="info">
                    <div class="title">{{ title[index] }}</div>
                    <div class="author">{{ author[index] }}</div>
                </div>
                <div class="func">
                    <div class="like"><img v-lazy="images.dark.like"></div>
                    <div class="collect"><img v-lazy="images.dark.collect"></div>
                    <div class="download"><img v-lazy="images.dark.download"></div>
                </div>
                <div class="source">{{ showSource(source) }}</div>
                <div class="time">00:00</div>
            </div>
        </div>
        </TransitionGroup>
    </main>
    </div>
</template>


<script lang="ts" setup>
import axios from 'axios'

import { ref,inject, type Ref } from 'vue'
import gsap from 'gsap'
import {images} from '@/script/images.ts'

const isLoading = ref(false)
let title = ref([""])
let author = ref([""])
let imgurl = ref([" "])
let musicID = ref([""])
const items = ref(0) // 搜索结果总数
const key = ref('')

// 修改来源
const selectSource = ref("1")
const sourceList = inject('sourceList') as string[]
const source = inject('source') as Ref<string>

function selectColor(index:string){
    return (index === selectSource.value) ? "var(--main-text-c)" : "rgba(200,200,200,.5)"
}
function changeSource(e:MouseEvent){
    const target = e.target as HTMLDivElement
    if (target && target.dataset.index){
        const index = target.dataset.index as string
        selectSource.value = target.dataset.index
        source.value = sourceList[parseInt(index)]
        search(key.value)
    }
}
function showSource(apiSource:string):string{
    console.log(apiSource)
    if (apiSource === 'bili'){
        return 'b站'
    }
    else if (apiSource === 'wangyi'){
        return '网易'
    }
    else if (apiSource === 'kuwo'){
        return '酷我'
    }
    else{
        return '推荐'
    }
}
// 搜索功能
async function search(key:string){
    isLoading.value = true
    items.value = 0
    try{
        const request = await axios.get(`http://localhost:3000/api/${source.value}/search?key=${key}`)
        const data = request.data

        items.value = data.length
        musicID.value = data.map((item:any) => item.id)
        title.value = data.map((item:any) => item.title)
        author.value = data.map((item:any) => item.author)
        imgurl.value = data.map((item:any) => item.imgurl)
    }catch(error){
        console.log(error)
    }finally{
        isLoading.value = false
    }
}
// 入场与离场动画
function onBeforeEnter(el:any) {
    el.style.opacity = 0

}
function onEnter(el:any, done:any) {
    gsap.to(el, {
        opacity: 1,
        delay: el.dataset.index * 0.2,
        onComplete: done
    })
}
function onLeave(el:any, done:any) {
    gsap.to(el, {
        opacity: 0,
        delay: el.dataset.index * 0.2,
        onComplete: done
    })
}

// 播放功能
const playlists = inject('playlists') as Ref<number>
const audio:any = inject('audio')
async function play(e:any){
    const id = e.target.id
    const res = await fetch(`http://localhost:3000/api/${source.value}/play?id=${id}`)
    const blob = await res.blob()
    const playurl = URL.createObjectURL(blob)

    audio.src = playurl
    audio.dataset.title = title.value[e.target.dataset.index]
    audio.dataset.author = author.value[e.target.dataset.index]
    audio.dataset.imgurl = imgurl.value[e.target.dataset.index]
    audio.dataset.id = id
    audio.dataset.source = source.value
    await audio.play()

    console.log(audio.dataset.author)
    const wirte_url = `http://localhost:3000/cache/playlist/write?id=${id}&title=${audio.dataset.title}&author=${audio.dataset.author}&imgurl=${audio.dataset.imgurl}&source=${showSource(source.value)}`
    await axios.get(wirte_url)

    playlists.value++
}

</script>


<style scoped>
    @import "@/assets/animation.css";
    .container{
        --text-color:var(--main-text-c);
        --input-bg:var(--search-input-bg);
        --input-bg-hover:var(--search-input-bg-hover);

        width:80%;
        height:100%;
    }
    header{
        height:80px;
        width:100%;
    }
    .search > input{
        padding:10px;
        height:10px;
        width:300px;
        border-radius:10px;
        border:1px solid transparent;
        background-color:var(--input-bg);
        color:var(--text-color);
        outline:none;
        transition:.2s;
        user-select:auto;
    }
    .search > input:hover{
        background-color:var(--input-bg-hover);
    }
    .search > input::placeholder{
        color:var(--text-color);
    }
    .source{
        display:flex;
        justify-content:flex-start;
        align-items: center;
        margin-top:10px;
        gap:15px;
        font-size:15px;
        color:var(--text-color);
        cursor:pointer;
    }
    .source > div{
        font-weight:bold;
        color:rgba(200,200,200,.5);
        transition:.2s;
    }
    .source > .bili{
        color:var(--text-color);
    }
    main{
        display:flex;
        flex-direction:column;
        align-items:start;
        justify-content: start;
        flex-shrink:0;
        height:calc(100% - 80px);
        width:100%;
        overflow-x:hidden;
        overflow-y:auto;
    }
    main::-webkit-scrollbar{
        width:5px;
    }
    main::-webkit-scrollbar-thumb{
        background-color:rgba(100,100,100,1);
        border-radius:5px;
    }
    main::-webkit-scrollbar-track{
        background-color:rgba(255,255,255,0.8);
        border-radius:5px;
    }
    main > div{
        width:100%;
    }
    main > div > .item{
        display:flex;
        align-items:center;
        justify-content:start;
        height:70px;
        color:var(--text-color);
        transition:.1s;
    }
    main > div > .item:hover{
        background-color:rgba(255,255,255,.1);
    }
    .item > .index{
        display:flex;
        justify-content:center;
        align-items:center;
        height:100%;
        width:30px;
        font-size:16px;
    }
    .item > .icon{
        width:50px;
        height:50px;
        background-color:rgba(255,255,255,.5);
    }
    .item > .icon::after{
        content:"";
        display:block;
        position:relative;
        top:-108%;
        left:0;
        width:100%;
        height:100%;
        background-color:rgba(0,0,0,.3);
        background-image:url('@/../public/images/dark/play2.png');
        background-repeat:no-repeat;
        background-size:50% 50%;
        background-position:center;
        transition:.2s;
        opacity:0;
        cursor:pointer;
    }
    .item > .icon:hover::after{
        opacity:1;
    }
    .item > .info{
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:flex-start;
        margin-left:10px;
        height:100%;
        width:200px;
        gap:5px;
        overflow:hidden;
    }
    .item > .info > .title{
        font-size:16px;
        font-weight:bold;
        white-space: nowrap;
    }
    .item > .info >  .author{
        font-size:12px;
        white-space:nowrap;
    }
    .item > .func{
        display:flex;
        justify-content:flex-start;
        align-items:center;
        margin-left:30px;
        gap:20px;
        width:200px;
        cursor:pointer;
    }
    .item > .func > div{
        width:20px;
        height:20px;
    }
    .item > .source{
        display:flex;
        justify-content:center;
        align-items:center;
        width:calc(100% - 200px - 200px - 200px - 50px - 30px);
        height:100%;
    }
    .item > .time{
        display:flex;
        justify-content:center;
        align-items:center;
        width:200px;
        height:100%;
    }
    .loading{
        position:absolute;
        top:50%;
        left:50%;
        width:50px;
        height:50px;
        transform:translate(-50%,-50%);
        border:5px solid rgba(68, 142, 254, 0.8);
        border-top-color:rgba(255, 255, 255, 0.5);
        border-radius:100%;
        animation:circle 1s linear infinite;
    }
</style>