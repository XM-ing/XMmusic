<template>
    <div class="menu"  ref="menuEle">
        <div class="delete">删除</div>
    </div>
    <div class="playlist" :style="{transform:`translateX(${showlist%2 === 1 ? 0 : 700}px)`}">
        <header>
            <div class="title">播放列表</div>
            <div class="delete"></div>
        </header>
        <main>
            <TransitionGroup
                @before-enter="onBeforeEnter"
                @enter="onEnter"
                @leave="onLeave">
            <div v-for="(item,index) in items" :key="index">
                <div class="item" :data-index="index">
                    <div class="index">{{ index+1 }}</div>
                    <div class="icon" :id="infos.musicID[index]" @click="play" :data-index="index"><img v-lazy="infos.imgurl[index]" :alt="infos.imgurl[index]"></div>
                    <div class="info" :style="{color:infos.color[index]}">
                        <div class="title">{{ infos.title[index] }}</div>
                        <div class="author">{{ infos.author[index] }}</div>
                    </div>
                    <div class="func">
                        <div class="like"></div>
                        <div class="collect"></div>
                        <div class="download"></div>
                    </div>
                    <div class="source">{{ infos.source[index] }}</div>
                </div>
            </div>
            </TransitionGroup>
        </main>
    </div>

</template>

<script lang="ts" setup>
import gsap from 'gsap'
import {ref,inject,watch, type Ref,onMounted,nextTick} from 'vue'
import axios from 'axios'


function getApiSource(source:string):string{
    if (source === 'b站'){
        return 'bili'
    }
    else if (source === '网易'){
        return 'wangyi'
    }
    else if (source === '酷我'){
        return 'kuwo'
    }
}
const items = inject('playlists') as Ref<number>
const infos = ref({
    title:[''],
    author:[''],
    imgurl:[''],
    musicID:[''],
    source:[''],
    color:['']
})
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

// 播放列表显示与隐藏
const showlist = inject('showlist') as Ref<number>
document.addEventListener('click',(e:MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.playlist') && !(target.id === 'player-list') && !(target.className === 'delete')){
        showlist.value = 0
    }
})

// 获取和更新播放列表数据
const audio = inject('audio') as HTMLAudioElement
watch(items,async (newitems) => {
    const res = await axios.get('http://localhost:3000/cache/playlist/read')
    const data = res.data.data
    items.value = data.length
    for (let i = 0;i<data.length;i++){
        infos.value.title[i] = data[i].title
        infos.value.author[i] = data[i].author
        infos.value.imgurl[i] = data[i].imgurl
        infos.value.musicID[i] = data[i].id
        infos.value.source[i] = data[i].source
    }
    selectMusic(audio.dataset.id as string)
},{immediate:true})

// 点击播放音乐
async function play(e:any){
    const id = e.target.id
    audio.dataset.title = infos.value.title[e.target.dataset.index]
    audio.dataset.author = infos.value.author[e.target.dataset.index]
    audio.dataset.imgurl = infos.value.imgurl[e.target.dataset.index]
    audio.dataset.id = id
    audio.dataset.source = infos.value.source[e.target.dataset.index]
    const res = await fetch(`http://localhost:3000/api/${getApiSource(audio.dataset.source)}/play?id=${id}`)
    const blob = await res.blob()
    const playurl = URL.createObjectURL(blob)

    audio.src = playurl
    await audio.play()
    selectMusic(id)
}
// 选中音乐样式
const audioId = ref(audio.dataset.id as string)
audio.addEventListener('loadedmetadata',() => {
    audioId.value = audio.dataset.id as string
    watch(audioId,(newAudioId) => {
        selectMusic(newAudioId)
    })
})
function selectMusic(id:string){
    for (let i = 0;i < items.value;i++){
        if (infos.value.musicID[i] === id){
            infos.value.color[i] = 'red'
        }else{
            infos.value.color[i] = 'white'
        }
    }
}
// 右键菜单并删除音乐
let showmenu = false
const menuEle = ref() as Ref<HTMLDivElement>
function showmenuAction(showmenu:boolean){
    if (menuEle.value){
        if (showmenu){
            menuEle.value.style.height = '40px'
        }else{
            menuEle.value.style.height = '0'
        }
    }

}

onMounted(async () => {
    await nextTick()
    let del_index:number = -1
    document.addEventListener('contextmenu',(e:MouseEvent) => {
        const target = e.target as HTMLElement
        const itemEle = target.closest('.item') as HTMLElement
        if (target.closest('.item')){
            if (itemEle.dataset.index){
                del_index = parseInt(itemEle.dataset.index)
            }
            const menuWidth = menuEle.value.offsetWidth
            const windowWidth = window.innerWidth
            const mouseX = e.clientX

            if (mouseX + menuWidth > windowWidth){
                menuEle.value.style.left = `${mouseX - menuWidth}px`
            }else{
                menuEle.value.style.left = `${mouseX}px`
            }
            menuEle.value.style.top = `${e.clientY}px`

            showmenu = true
            showmenuAction(showmenu)
            e.preventDefault()
        }
    })
    document.addEventListener('click',() => {
        showmenu = false
        showmenuAction(showmenu)
    })
    menuEle.value.addEventListener('click',async (e:MouseEvent) => {
        if (del_index !== -1){
            const read_res = await axios.get('http://localhost:3000/cache/playlist/read')
            const read_data = read_res.data.data
            if (audio.dataset.id === read_data[del_index].id){
                const id = read_data[(del_index+1)%(read_data.length)].id
                const index = read_data.findIndex(item => item.id === id)
                audio.dataset.title = read_data[(del_index+1)%items.value].title
                audio.dataset.author = read_data[(del_index+1)%items.value].author
                audio.dataset.imgurl = read_data[(del_index+1)%items.value].imgurl
                audio.dataset.id = id
                audio.dataset.source = read_data[(del_index+1)%items.value].source
                const res = await fetch(`http://localhost:3000/api/${getApiSource(audio.dataset.source)}/play?id=${id}`)
                const blob = await res.blob()
                const playurl = URL.createObjectURL(blob)
                audio.src = playurl
                await audio.play()
                selectMusic(id)
            }
            const del_res = await axios.get(`http://localhost:3000/cache/playlist/delete?index=${del_index}`)
            const data = del_res.data.data
            items.value = data.length

        }
        showmenu = false
        showmenuAction(showmenu)
    })
})





</script>


<style scoped>
    .playlist{
        z-index:2;
        position:absolute;
        bottom:100px;
        right:0;
        height:500px;
        width:400px;
        border-radius:10px;
        background-color:rgb(44,44,55);
        color:white;
        transition:.4s ease-in-out;
        overflow:hidden;
    }
    header{
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:10px;
    }
    header .title{
        font-weight:bold;
    }
    header .delete{
        margin-top:5px;
        width:20px;
        height:20px;
        background-image:url('@/../public/images/dark/delete.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size:cover;
        cursor:pointer;
    }
    main{
        padding:10px;
        overflow-y:auto;
        height:420px;
    }
    main::-webkit-scrollbar{
        width:5px;
        height:100px;
    }
    main::-webkit-scrollbar-thumb{
        background-color:rgba(100,100,100,1);
        border-radius:5px;
    }
    main::-webkit-scrollbar-track{
        background-color:rgba(255,255,255,0.8);
        border-radius:5px;
        height:100px;
    }
    .item{
        display:flex;
        justify-content: space-between;
        align-items:center;
        width:100%;
        height:60px;
        transition:.1s;
    }
    .item:hover{
        background-color:rgba(255,255,255,0.1);
    }
    .item > .index{
        display:flex;
        justify-content:center;
        align-items:center;
        width:20px;
    }
    .item > .icon{
        width:50px;
        height:50px;
        background-color:rgba(255,255,255,0.5);
    }
    .item > .icon::after{
        content:"";
        display:block;
        position:relative;
        top:-105%;
        left:0;
        width:100%;
        height:100%;
        background-color:rgba(0,0,0,.3);
        background-image:url('@/../public/images/dark/play2.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size:50% 50%;
        transition:.2s;
        opacity: 0;
        cursor:pointer;
    }
    .item > .icon:hover::after{
        opacity: 1;
    }
    .item > .info{
        display:grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        grid-gap:5px;
        padding:5px;
        width:150px;
        transition:.2s;
    }
    .item > .info > .title{
        white-space: nowrap;
        font-size:16px;
        font-weight:bold;
        overflow:hidden;
    }
    .item > .info > .author{
        white-space: nowrap;
        font-size:12px;
        overflow:hidden;
    }
    .item > .func{
        display:flex;
        justify-content:flex-start;
        align-items:center;
        gap:10px;
        width:100px;
        height:100%;
    }
    .item > .func > div{
        width:20px;
        height:20px;
    }
    .item > .func > .like{
        background-image:url('@/../public/images/dark/like.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size:cover;
    }
    .item > .func > .collect{
        background-image:url('@/../public/images/dark/collect.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size:cover;
    }
    .item > .func > .download{
        background-image:url('../../public/images/dark/download.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size:cover;
    }
    .item > .source{
        display:flex;
        justify-content:center;
        align-items:center;
        width:calc(100% - 20px - 50px - 150px - 100px);
        height:10px;
    }
    .menu{
        z-index:999;
        position:absolute;
        top:0;
        right:0;
        width:100px;
        height:0px;
        border-radius:8px;
        overflow:hidden;
        transition:height .2s;
    }
    .menu > .delete{
        display:flex;
        justify-content:center;
        align-items:center;
        width:100%;
        height:100%;
        background-color:rgb(62,60,67);
        color:white;
    }


</style>