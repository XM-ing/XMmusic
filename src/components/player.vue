<template>
    <div class="container">
        <div class="left">
            <div class="icon" :style="{backgroundImage:`url(${audioInfo.imgurl})`}" @click="openPlayer"></div>
            <div class="info">
                <div class="title">{{ audioInfo.title }}</div>
                <div class="author">{{ audioInfo.author }}</div>
                <div class="func"></div>
            </div>
        </div>
        <div class="center">
            <div class="but">
                <div class="prev" @click="prev"></div>
                <div class="play" @click="play" :style="{backgroundImage:`url(${playimg})`}"></div>
                <div class="next" @click="next"></div>
            </div>
            <div class="progress">
                <span class="cur-time">{{audioInfo.currentTime }}</span>
                <div class="progressbar" ref="progressbar">
                    <div class="currentbar" ref="currentbar"></div>
                    <div class="progressbtn" ref="progressbtn"></div>
                </div>
                <span class="all-time" >{{ audioInfo.duration }}</span>
            </div>
        </div>
        <div class="right">
            <div class="mode" :style="{backgroundImage:`url(${modeimg})`}" @click="changemode"></div>
            <div class="volume" @click="showVolume"></div>
            <div class="list" id='player-list'></div>
        </div>
    </div>
    <div class="loading" v-if="loading">加载音乐中...</div>
    <div class="volume-con" ref="vol_con">
        <div class="progressbar" ref="vol_progressbar">
            <div class="currentbar" ref="vol_currentbar"></div>
            <div class="progressbtn"ref="vol_progressbtn"></div>
        </div>
        <div class="volume">{{ volume }}%</div>
    </div>
    <div class="player-con" ref="player_con" :style="{backgroundColor:imgColor}">
        <img :src="audioInfo.imgurl" :alt="audioInfo.imgurl" ref="player_img" no-referrer>
        <div class="back">
            <div class="icon">
                <img :src="audioInfo.imgurl" :alt="audioInfo.imgurl">
                <canvas class="spectrum" ref="spectrum"></canvas>
            </div>
            <div class="lyric" ref="lyric_con">
                <ul ref="lyric_ul">
                    <li v-for="i in lyric.length" ref="lyric_li" :data-index="i-1">{{ lyric[i-1].word }}</li>
                </ul>
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>

import {images,theme} from "@/script/images.ts"
import {ref,onMounted,nextTick,inject,watchEffect, watch, type Ref} from 'vue'
import axios from 'axios'
import ColorThief from 'colorthief'

const lyric = ref([{'word':'','time':'0'}])

function getApiSource(source:string):string{
    if (source === '酷我'){
        return 'kuwo'
    }
    else if (source === '网易'){
        return 'wangyi'
    }
    else if (source === 'b站'){
        return 'bili'
    }else{
        return source
    }
}
const loading = ref(false)
const audio:HTMLAudioElement|undefined = inject('audio')
const audioInfo = ref({
    duration:"",
    currentTime:"",
    title:"歌曲名",
    author:"歌手",
    imgurl:" "
})
audioInit()

// 歌词滚动
const lyric_ul = ref<HTMLUListElement>();
const lyric_li = ref<HTMLLIElement[]>();
const lyric_con = ref<HTMLDivElement>();

// 寻找当前歌词的索引
function findIndex():number{
    let curTime = audio.currentTime
    for (let i = 0; i < lyric.value.length;i++){
        if (curTime < lyric.value[i].time){
            return i-1
        }
    }
    return lyric.value.length-1
}

async function audioInit(){
    if (audio){
        loading.value = true
        const res = await axios.get('http://localhost:3000/cache/playlist/read')
        const data = res.data.data
        audio.dataset.title = data[0].title
        audio.dataset.author = data[0].author
        audio.dataset.imgurl = data[0].imgurl
        audio.dataset.id = data[0].id
        audio.dataset.source = data[0].source
        const src_res = await fetch(`http://localhost:3000/api/${getApiSource(audio.dataset.source)}/play?id=${audio.dataset.id}`)
        const blob = await src_res.blob()
        const playurl = URL.createObjectURL(blob)
        audio.src = playurl
        

        audio.addEventListener('loadedmetadata',async () => {
            audioInfo.value.duration = formatTime(audio.duration)
            audioInfo.value.currentTime = formatTime(audio.currentTime)
            if (audio.dataset.title && audio.dataset.author && audio.dataset.imgurl){
                audioInfo.value.title = audio.dataset.title
                audioInfo.value.author = audio.dataset.author
                audioInfo.value.imgurl = audio.dataset.imgurl
            }
            if (audio.dataset.source !== 'b站'){
                const response = await axios.get(`http://localhost:3000/api/${getApiSource(audio.dataset.source)}/lyric?id=${audio.dataset.id}`)
                lyric.value = response.data
            }else{
                lyric.value = [{'word':'','time':'0'}]
            }
            loading.value = false
        })
        audio.addEventListener('timeupdate',() => {
            audioInfo.value.currentTime = formatTime(audio.currentTime)
            if (lyric.value[0].word !== ''){
                const liHeight = lyric_li.value[0].clientHeight
                const ulHeight = lyric_ul.value.clientHeight
                const index = findIndex()
                for (let i = 0; i < lyric_li.value.length;i++){
                    if (i === index){
                        lyric_li.value[i].classList.add('active')
                    }else{
                        lyric_li.value[i].classList.remove('active')
                    }
                }

                let offset = ((liHeight+10) * index + liHeight/2 - ulHeight/2)
                if (offset < 0){
                    offset = 0
                }
                if (offset > lyric_ul.value.scrollHeight){
                    offset = lyric_ul.value.scrollHeight
                }
                if (offset === 0){
                    lyric_ul.value.scrollTop = 0
                }else{
                    lyric_ul.value.scrollTop = offset+10
                }
            }


        })

        // 切换播放状态图标
        audio.addEventListener('play',() => {
            playimg.value = images.dark.pause
        })
        audio.addEventListener('pause',() => {
            playimg.value = images.dark.play
        })
    }
}







// 切换播放状态
let playimg = ref(images.dark.play)
function play(){
    if (audio){
        audio.paused ? audio.play() : audio.pause()
    }
}

// 格式化时间
function formatTime(time:number){
    if (isNaN(time)) 
        return "00:00"
    const minute = Math.floor(time/60)
    const second = Math.floor(time%60)
    return `${minute < 10?'0':""}${minute}:${second < 10?'0':""}${second}`
}

// 播放列表显示与隐藏
let showlist = inject('showlist') as Ref<number>
document.addEventListener('click',(e:MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.className === 'list'){
        showlist.value++
    }
})

// 进度条点击和移动事件
let isMouseUp:boolean = true
let isMouseDown:boolean = false
const progressbar = ref<HTMLDivElement>();
const currentbar = ref<HTMLDivElement>();
const progressbtn = ref<HTMLDivElement>();
onMounted(() => {
    async function progressMove(e:MouseEvent):Promise<number>{
        await nextTick()
        if (progressbar.value){
            const width = progressbar.value?.clientWidth
            const mouseX = e.pageX - progressbar.value?.getBoundingClientRect().left
            return Math.max(0,Math.min(mouseX,width))
        }else{
            return 0
        }
    }
    progressbar.value?.addEventListener('mousedown',(e:MouseEvent) => {
        isMouseDown = true
        isMouseUp = false
    })
    window.addEventListener('mousemove',async (e:MouseEvent) => {
        if (isMouseDown && currentbar.value && progressbtn.value){
            const moveX = Math.floor(await progressMove(e))
            currentbar.value.style.width = `${moveX}px`
            progressbtn.value.style.left = `${moveX-5}px`
        }
    })
    window.addEventListener('mouseup',async (e:MouseEvent) => {
        if (isMouseDown && progressbar.value && audio){
            const moveX = await progressMove(e)
            const width = progressbar.value?.clientWidth
            
            const percent = moveX/width
            audio.currentTime = percent * audio.duration

            isMouseUp = true
            isMouseDown = false
        }
    })
    if (audio){
        audio.addEventListener('timeupdate',() => {
            if (!isMouseUp){
                return
            }else{
                if (currentbar.value && progressbtn.value && audio){
                    const progress = (audio.currentTime/audio.duration) * 100
                    currentbar.value.style.width = `${progress}%`
                    progressbtn.value.style.left = `calc(${progress}% - 5px)`

                    audioInfo.value.currentTime = formatTime(audio.currentTime)
                }
            }
        })
    }
})

// 播放模式
const mode = ref(0) // 0:单曲循环 1:顺序播放 2:随机播放
const modeimg = ref(images.dark.loopone)

function changemode(){
    if (mode.value < 2){
        mode.value++
    }else{
        mode.value = 0
    }

    if (mode.value === 0){
        modeimg.value = images.dark.loopone
    }
    else if (mode.value === 1){
        modeimg.value = images.dark.looplist
    }
    else if (mode.value === 2){
        modeimg.value = images.dark.random
    }
}

// 上一曲下一曲
if (audio){
    audio.addEventListener('ended',() => {
        prev_next()
    })
}

async function prev_next(){
    next()
}
async function next(){
    if (audio){
        if (mode.value === 0){
            audio.currentTime = 0
            await audio.play()
        }
        else if (mode.value === 1){
            loading.value = true
            const res = await axios.get('http://localhost:3000/cache/playlist/read')
            const data = res.data.data
            const length = data.length

            for (let i = 0;i < length;i++){
                if (audio.dataset.id === data[i].id){
                    const index = (i+1) % length

                    audio.dataset.title = data[index].title
                    audio.dataset.author = data[index].author
                    audio.dataset.imgurl = data[index].imgurl
                    audio.dataset.id = data[index].id
                    audio.dataset.source = data[index].source

                    const src_res = await fetch(`http://localhost:3000/api/${getApiSource(audio.dataset.source)}/play?id=${audio.dataset.id}`)
                    const blob = await src_res.blob()
                    const playurl = URL.createObjectURL(blob)
                    audio.src = playurl
                    loading.value = false
                    await audio.play()
                    break
                }
            }
        }
        else if (mode.value === 2){
            loading.value = true
            const res = await axios.get('http://localhost:3000/cache/playlist/read')
            const data = res.data.data
            const length = data.length

            let index = Math.floor(Math.random() * length)
            while(audio.dataset.id === data[index].id){
                index = Math.floor(Math.random() * length)
            }

            audio.dataset.title = data[index].title
            audio.dataset.author = data[index].author
            audio.dataset.imgurl = data[index].imgurl
            audio.dataset.id = data[index].id
            audio.dataset.source = data[index].source

            const src_res = await fetch(`http://localhost:3000/api/${getApiSource(audio.dataset.source)}/play?id=${audio.dataset.id}`)
            const blob = await src_res.blob()
            const playurl = URL.createObjectURL(blob)
            audio.src = playurl
            loading.value = false
            await audio.play()
        }
    }
}
async function prev(){
    if (audio){
        if (mode.value === 0){
            audio.currentTime = 0
            await audio.play()
        }
        else if (mode.value === 1){
            loading.value = true
            const res = await axios.get('http://localhost:3000/cache/playlist/read')
            const data = res.data.data
            const length = data.length

            for (let i = 0;i < length;i++){
                if (audio.dataset.id === data[i].id){
                    const index = (i-1+length) % length

                    audio.dataset.title = data[index].title
                    audio.dataset.author = data[index].author
                    audio.dataset.imgurl = data[index].imgurl
                    audio.dataset.id = data[index].id
                    audio.dataset.source = data[index].source

                    const src_res = await fetch(`http://localhost:3000/api/${getApiSource(audio.dataset.source)}/play?id=${audio.dataset.id}`)
                    const blob = await src_res.blob()
                    const playurl = URL.createObjectURL(blob)
                    audio.src = playurl
                    loading.value = false
                    await audio.play()
                    break
                }
            }
        }
        else if (mode.value === 2){
            loading.value = true
            const res = await axios.get('http://localhost:3000/cache/playlist/read')
            const data = res.data.data
            const length = data.length

            let index = Math.floor(Math.random() * length)
            while(audio.dataset.id === data[index].id){
                index = Math.floor(Math.random() * length)
            }

            audio.dataset.title = data[index].title
            audio.dataset.author = data[index].author
            audio.dataset.imgurl = data[index].imgurl
            audio.dataset.id = data[index].id
            audio.dataset.source = data[index].source

            const src_res = await fetch(`http://localhost:3000/api/${getApiSource(audio.dataset.source)}/play?id=${audio.dataset.id}`)
            const blob = await src_res.blob()
            const playurl = URL.createObjectURL(blob)
            audio.src = playurl
            loading.value = false
            await audio.play()
        }
    }
}

// 音量显示
const vol_con = ref<HTMLDivElement>();
let vol_show = false
function showVolume(){
    vol_show = !vol_show
    if (vol_con.value){
        if (vol_show){
            vol_con.value.style.height = "150px"
            vol_con.value.style.paddingTop = "10px"
            vol_con.value.style.paddingBottom = "10px"
        }else{
            vol_con.value.style.height = "0"
            vol_con.value.style.paddingTop = "0"
            vol_con.value.style.paddingBottom = "0"
        }
    }
}
document.addEventListener('click',(e:MouseEvent) => {
    const target = e.target as HTMLElement
    if (!(target.className === 'volume') && vol_show && vol_con.value){
        vol_show = false
        vol_con.value.style.height = "0"
        vol_con.value.style.paddingTop = "0"
        vol_con.value.style.paddingBottom = "0"
    }
})


// 音量控制
const volume = ref(localStorage.getItem('volume') || '100')
if (audio){
    audio.volume = parseFloat(volume.value)/100
}
const vol_progressbar = ref<HTMLElement>();
const vol_currentbar = ref<HTMLElement>();
const vol_progressbtn = ref<HTMLElement>();
let vol_isMouseUp:boolean = true
let vol_isMouseDown:boolean = false
onMounted(async () => {
        await nextTick()
        if (vol_currentbar.value && vol_progressbtn.value && vol_progressbar.value && audio){
            const height = vol_progressbar.value?.clientHeight
            vol_currentbar.value.style.height = `${(audio.volume || 0) * 100}%`
            vol_progressbtn.value.style.top = `calc(${(1-audio.volume || 0) * 100}% - 5px)`
        }

        if (audio && vol_progressbar.value && vol_currentbar.value && vol_progressbtn.value){
            function vol_progressMove(e:MouseEvent):number{
                if (vol_progressbar.value){
                    const height = vol_progressbar.value?.clientHeight
                    const mouseY = e.pageY - vol_progressbar.value.getBoundingClientRect().top
                    return Math.max(0,Math.min(mouseY,height))
                }else{
                    return 0
                }
            }
            vol_progressbar.value.addEventListener('mousedown',(e:MouseEvent) => {
                vol_isMouseDown = true
                vol_isMouseUp = false
            })
            document.addEventListener('mousemove',(e:MouseEvent) => {
                if (vol_isMouseDown && vol_currentbar.value && vol_progressbtn.value && vol_isMouseDown){
                    const moveY = vol_progressMove(e)
                    const height = vol_progressbar.value?.clientHeight
                    vol_currentbar.value.style.height = `${height as number-moveY}px`
                    vol_progressbtn.value.style.top = `${moveY-5}px`
                    audio.volume = 1-(moveY/(height as number))
                    volume.value = String(Math.floor(audio.volume*100))
                }
            })
            document.addEventListener('mouseup',() => {
                vol_isMouseUp = true
                vol_isMouseDown = false
                localStorage.setItem('volume',volume.value)
            })
        }
})

// 打开播放器
let player_show = false
const player_con = ref<HTMLDivElement>();
function openPlayer(){
    const icon = document.querySelector('.left > .icon') as HTMLDivElement
    icon.classList.toggle('active')
    player_show = !player_show
    if (player_show && player_con.value){
        player_con.value.style.height = "calc(100% - 80px)"
    }else{
        if (player_con.value){
            player_con.value.style.height = "0"
        }
    }
}
// 获取图片主色调
const player_img = ref<HTMLImageElement>();
const imgColor = ref<string>();
const colorthief = new ColorThief()


watchEffect(() => {
    if (player_img.value) {
        player_img.value.crossOrigin = 'Anonymous';

        player_img.value.addEventListener('load', () => {
            if (player_img.value){
                const color:any = colorthief.getColor(player_img.value);
                imgColor.value = `rgb(${color[0]},${color[1]},${color[2]})`;
            }
        });
    }
})

// 频谱
const spectrum = ref<HTMLCanvasElement>();
onMounted(() => {
    const audioContext = new (window.AudioContext)() // 创建一个AudioContext对象，用于处理音频
    const track = audioContext.createMediaElementSource(audio as HTMLAudioElement) // 将音频源连接到AudioContext对象
    const analyser = audioContext.createAnalyser() // 创建一个AnalyserNode对象，用于分析音频数据
    analyser.fftSize = 2048 // 用于分析音频的快速傅里叶变换（FFT）的大小，将时域信号转换为频域信号。设置更大的 fftSize 会提供更高的频率分辨率，但也会消耗更多的计算资源。
    track.connect(analyser) // 将音频源连接到分析器节点
    analyser.connect(audioContext.destination) // 将分析器（analyser）连接到音频上下文的输出目的地（通常是扬声器或耳机）
    const bufferLength = analyser.frequencyBinCount // 获取频谱的长度，frequencyBinCount 是 fftSize 的一半加一。每个频域数据点表示一个频率范围内的能量。
    const dataArray = new Uint8Array(bufferLength) // 创建一个 Uint8Array 对象，用于存储频谱数据
    const spectContext = spectrum.value?.getContext('2d') // 获取 canvas 元素的上下文
    function draw(){
        requestAnimationFrame(draw) // 循环调用 draw 函数
        analyser.getByteFrequencyData(dataArray)  // 获取频谱数据
        spectContext?.clearRect(0,0,spectrum.value?.width as number,spectrum.value?.height as number) // 清除 canvas 元素
        const barWidth = (spectrum.value?.width as number/bufferLength) * 10 // 计算每个频域的宽度
        let barHeight // 计算每个频域的高度
        let x = 0 // 计算每个频域的起始位置
        if (spectContext){
            for (let i = 0;i < bufferLength;i++){
                barHeight = dataArray[i] // 获取当前频域的能量值
                const colorValue = Math.floor(barHeight * 0.5) // 计算当前频域的颜色值
                spectContext.fillStyle = `rgba(${colorValue},204,255,1)`
                // spectContext.fillStyle = imgColor.value as string
                spectContext?.fillRect(x,spectrum.value?.height as number-barHeight,barWidth,barHeight)
                x += barWidth + 2
            }
        }
    }
    draw()
})

// 歌词显示

</script>


<style scoped>
    .container{
        --background-color:var(--main-tit-bg);

        display:flex;
        justify-content:space-between;
        align-items:center;
        position:absolute;
        bottom:0;
        height:80px;
        width:100%;
        background-color:var(--background-color);
        color:white;
    }
    .left{
        display:flex;
        align-items:center;
        justify-content:start;
        padding-left:10px;
        width:300px;
        height:100%;
    }
    .left > .icon{
        position:relative;
        width:60px;
        height:60px;
        background-color:rgba(255,255,255,.5);
        background-position:center;
        background-repeat:no-repeat;
        background-size:cover;
        background-blend-mode:multiply;
        overflow:hidden;
        transition:.2s;
    }
    .left > .icon:hover{
        background-color:rgba(0,0,0,.5);
    }
    .left > .icon::after{
        content:"";
        position:absolute;
        display:block;
        top:0;
        width:100%;
        height:100%;
        background-image:url("@/../public/images/dark/up_down.png");
        background-repeat: no-repeat;
        background-size:50% 50%;
        background-position: center;
        transition:transform .2s,opacity .2s;
        opacity:0;
        cursor:pointer;
        transform-origin:center;
    }
    .left > .icon:hover::after{
        opacity:1;
    }
    .left > .icon.active::after{
        transform:rotate(180deg);
    }
    .left > .info{
        display:grid;
        grid-template-columns:1fr 1fr;
        grid-template-rows:auto;
        grid-template-areas:"title title"
                            "author func";
        row-gap:10px;
        padding-left:5px;
    }
    .left > .info > .title{
        width:220px;
        grid-area:title;
        white-space: nowrap;
        font-size:16px;
        font-weight:bold;
        overflow: hidden;
    }
    .left > .info > .author{
        width:100px;
        grid-area:author;
        white-space: nowrap;
        font-size:13px;
        overflow: hidden;
    }
    .left > .info > .func{
        grid-area:func;
    }
    .center{
        width:600px;
        height:100%;
    }
    .center > .but{
        padding-top:5px;
        display:flex;
        justify-content:center;
        align-items:center;
        gap:10px;
    }
    .center > .but > div{
        width:40px;
        height:40px;
        cursor:pointer;
    }
    .center > .but > .prev{
        background-image:url("@/../public/images/dark/prev.png");
        background-position:center;
        background-repeat:no-repeat;
        background-size:cover;
    }
    .center > .but > .play{
        background-image:url("@/../public/images/dark/play.png");
        background-position:center;
        background-repeat:no-repeat;
        background-size:cover;
    }
    .center > .but > .next{
        background-image:url("@/../public/images/dark/next.png");
        background-position:center;
        background-repeat:no-repeat;
        background-size:cover;
    }
    .center > .progress{
        display:flex;
        justify-content:center;
        align-items:center;
        gap:10px;
    }
    .center .progressbar{
        position:relative;
        width:500px;
        height:8px;
        border-radius:5px;
        background-color:rgba(157, 157, 157, 0.5);
    }
    .center .progressbar > .currentbar{
        position:relative;
        width:0;
        height:8px;
        border-radius:5px;
        background-color:rgb(241, 178, 90);
    }
    .center .progressbar > .progressbtn{
        position:relative;
        bottom:9px;
        left:-5px;
        width:10px;
        height:10px;
        background-color:white;
        border-radius:50%;
        cursor:pointer;
    }
    .right{
        display:flex;
        align-items:center;
        justify-content:end;
        padding-right:10px;
        gap:10px;
        width:300px;
        height:100%;
    }
    .right > div{
        width:30px;
        height:30px;
        cursor:pointer;
    }
    .right > .mode{
        background-image:url("@/../public/images/dark/loopone.png");
        background-position:center;
        background-repeat:no-repeat;
        background-size:cover;
    }
    .right > .volume{
        background-image:url("@/../public/images/dark/volume.png");
        background-position:center;
        background-repeat:no-repeat;
        background-size:cover;
    }
    .right > .list{
        background-image:url("@/../public/images/dark/playlist.png");
        background-position:center;
        background-repeat:no-repeat;
        background-size:cover;
    }
    .loading{
        z-index:2;
        position:absolute;
        right:10px;
        bottom:80px;
        font-size:16px;
        font-weight:bold;
        color:white;
    }
    .volume-con{
        z-index:2;
        position:absolute;
        padding-left:10px;
        padding-right:10px;
        bottom:80px;
        right:40px;
        height:0px;
        width:30px;
        border-radius:6px;
        background-color:rgb(100,100,109);
        overflow:hidden;
        transition:.2s;
    }
    .volume-con > .progressbar{
        position:absolute;
        right:40%;
        top:10px;
        height:80%;
        width:5px;
        border-radius:6px;
        background-color:rgb(208, 207, 206);
    }
    .volume-con > .progressbar > .progressbtn{
        position:absolute;
        bottom:calc(50% - 5px);
        right:-3px;
        width:10px;
        height:10px;
        border-radius:50%;
        background-color:white;
        cursor:pointer;
    }
    .volume-con > .progressbar > .currentbar{
        position:absolute;
        bottom:0;
        width:100%;
        height:50%;
        border-radius:6px;
        background-color:rgb(241, 178, 90)
    }
    .volume-con > .volume{
        position:absolute;
        top:85%;
        left:25%;
        font-size:14px;
        color:white;
    }
    .player-con{
        z-index:1;
        position:absolute;
        bottom:80px;
        left:0;
        width:100%;
        height:0;
        background-color:rgb(218, 218, 218);
        background-position:center;
        background-repeat:no-repeat;
        background-size:contain;
        overflow:hidden;
        transition:.2s;
    }
    .player-con > img{
        height:100%;
        width:auto;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        transition: opacity 0.5s ease-in-out;
    }
    .player-con > .back{
        display:flex;
        justify-content:center;
        align-items:center;
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background-color:rgba(0,0,0,.5);
    }
    .player-con > .back > .icon{
        position:relative;
        width:350px;
        height:350px;
        border-radius:8px;
        background-color:rgba(255,255,255,.5);
        overflow:hidden;
    }
    .player-con .icon > .spectrum{
        z-index:3;
        position:absolute;
        bottom:0;
        left:0;
        width:100%;
        height:20%;
        opacity:.9;
    }
    .player-con > .back > .lyric{
        display:flex;
        justify-content:center;
        align-items:center;
        width:600px;
        height:500px;
        font-size:16px;
        color:white;
        overflow:hidden;
    }

    .player-con .lyric > ul{
        display:flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap:10px;
        width:100%;
        height:100%;
        transition:.3s;
        scroll-behavior: smooth;
        overflow-x:hidden;
        overflow-y:auto;
    }
    .player-con .lyric > ul::-webkit-scrollbar{
        display:none;
    }
    .player-con .lyric > ul > li{
        transition:.3s;
    }
    .player-con .lyric > ul > li.active{
        font-weight:bold;
        transform:scale(1.2)
    }
</style>
