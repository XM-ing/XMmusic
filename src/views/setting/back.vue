<template>
    <div class="back-con">
        <ul class="ul-1">

            <li class="item" data-name="opacity">
                <div class="title">背景透明度</div>
                <div class="action"  @click="showSubList('opacity','action')">
                    <span>{{ opacityText }}</span>
                    <div class="slider"><img :src="images.dark.up_down"></div>
                    <ul class='ul-3' v-if="showSub['action']['opacity']">
                        <li v-for="i in 10" @click="changeOpacity($event)">{{ ((i-1) * 0.1).toFixed(1) }}</li>
                    </ul>
                </div>
            </li>

            <li class="item" data-name="image">
                <div class="title">背景图片</div>
                <div class="action" @click="openFile($event)">
                    <span>预览</span>
                    <input type="file" style="display:none" @change="changeImageFile($event)" accept="image/*" ref="imageFileInput">
                </div>
            </li>
            <ul class="ul-2" data-name="image-see">
                <li v-for="i in 4" @click="changeImage($event)" :data-index="i-1"><img v-lazy="imageList[i-1]" :alt="imageList[i-1]" :data-index="i-1"></li>
            </ul>

            <li class="item" data-name="filter">
                <div class="title">背景模糊程度</div>
                <div class="action" @click="showSubList('filter','action')">
                    <span>{{ filterText }}</span>
                    <div class="slider"><img :src="images.dark.up_down"></div>
                    <ul class="ul-3" v-if="showSub['action']['filter']">
                        <li v-for="i in 6" @click="changeFilter($event)">{{ ((i-1) * 0.1).toFixed(1) }}</li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
// ul-1为主列表，ul-2为子列表，ul-3为其他部分的子列表
import {images} from "@/script/images.ts"
import {ref, type Ref} from "vue"


// 显示子列表
const showSub:any = ref({
    "action":{
        "opacity":false,
        "filter":false
    }
})
function showSubList(name:string,...args:string[]){
    const func:string = args[0]
    if (func){
        showSub.value[func][name] = !showSub.value[func][name]
    }else{
        showSub.value[name] = !showSub.value[name]
    }
}

// 改变透明度
const opacityText = ref(localStorage.getItem("opacity") || "0.5")
function changeOpacity(e:MouseEvent){
    e.stopPropagation() // 阻止事件冒泡
    const target = e.target as HTMLElement
    if (target){
        const newText = target.innerText
        localStorage.setItem("opacity",newText)
        opacityText.value = newText
    }
    showSub.value['action']['opacity'] = false
}

// 改变背景图片
const imageList = ref([
    images.back.back1,
    images.back.back2,
    images.back.back3,
    images.back.back4
])
if (localStorage.getItem("imageList") as string){
    imageList.value = JSON.parse(localStorage.getItem("imageList") as string)
}
function changeImage(e:MouseEvent){
    e.stopPropagation() // 阻止事件冒泡
    const target = e.target as HTMLElement
    if (target){
        const index = parseInt(target.dataset.index||"-1")
        if (index===-1) return
        let oldTemp = ''
        let newTemp = imageList.value[index]
        for (let i = 0;i <= index;i++){
            oldTemp = imageList.value[i]
            imageList.value[i] = newTemp
            newTemp = oldTemp
        }
        localStorage.setItem("back",imageList.value[0])
        localStorage.setItem("imageList",JSON.stringify(imageList.value))
    }
}
const imageFileInput = ref() as Ref<HTMLDivElement>
function openFile(e:MouseEvent){
    e.stopPropagation() // 阻止事件冒泡
    imageFileInput.value.click()
}
function changeImageFile(e:Event){
    e.stopPropagation() // 阻止事件冒泡
    const target = e.target as HTMLInputElement
    if (target && target.files){
        const file = target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            if (e.target){
                const url = e.target.result as string
                let oldTemp = ''
                let newTemp = url
                for (let i = 0;i <= 3;i++){
                    if (imageList.value[i] !== url){
                        oldTemp = imageList.value[i]
                        imageList.value[i] = newTemp
                        newTemp = oldTemp
                    }
                }
                localStorage.setItem("back",url)
                localStorage.setItem("imageList",JSON.stringify(imageList.value))
            }
        }
    }

}
// 改变背景模糊程度
const filterText = ref("0.0")
function changeFilter(e:MouseEvent){
    e.stopPropagation() // 阻止事件冒泡
    const target = e.target as HTMLElement
    if (target){
        const newText = target.innerText
        localStorage.setItem("filter",String(parseFloat(target.innerText) * 20))
        filterText.value = newText
    }
}


</script>


<style scoped>
    .back-con{
        width:80%;
        height:100%;
        border-radius:15px;
        overflow-x:hidden;
        overflow-y:auto;
    }
    ul{
        width:100%;
    }
    span{
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        font-size:14px;
        color:white;
        white-space: nowrap;
    }
    .ul-1 > .item{
        display:flex;
        justify-content:space-between;
        align-items:center;
        height:40px;
        padding:10px;
        border:1px solid rgba(240,240,240,.2);
        background-color:rgba(44,44,44,.5);
        color:white;
        transition:.2s;
    }
    .ul-1 > .item:hover{
        border:1px solid rgba(240,240,240,.7);
    }
    .ul-1 > .item > .action{
        position:relative;
        width:100px;
        height:30px;
        border-radius:3px;
        border:1px solid rgba(0,0,0,.1);
        background-color:rgba(44,44,44,.4);
        cursor:pointer;
        transition:.2s;
    }
    .ul-1 > .item > .action:hover{
        background-color:rgba(44,44,44,.6);
    }
    .ul-1 .action > .slider{
        position:absolute;
        top:50%;
        left:90%;
        width:20px;
        transform:translate(-50%,-50%) rotate(180deg);
    }
    .ul-1 > .item > .title{
        font-weight:bold;
    }
    .ul-3{
        z-index:1;
        position:absolute;
        top:100%;
        width:100%;
        height:120px;
        border-radius:5px;
        background-color:rgba(44,44,44);
        overflow-y:auto;
        overflow-x:hidden;
    }
    .ul-3::-webkit-scrollbar{
        display:none;
    }
    .ul-3 > li{
        width:100%;
        height:30px;
        border:1px solid rgb(0,0,0);
    }
    .ul-3 > li:hover{
        background-color:rgb(44,44,44);
    }
    .ul-2[data-name='image-see']{
        display:flex;
        justify-content:center;
        align-items:center;
        gap:20px;
        width:calc(100% - 2px);
        height:120px;
        border:1px solid rgba(240,240,240,.2);
        background-color:rgba(55,55,55,.5);
        transition:.2s;
    }
    .ul-2[data-name='image-see']:hover{
        border:1px solid rgba(240,240,240,.7);
    }
    .ul-2[data-name='image-see'] > li{
        width:20%;
        height:80%;
        border-radius:5px;
        background-color:rgba(255,255,255,.2);
        overflow:hidden;
        transition:.2s;
        cursor:pointer;
    }
    .ul-2[data-name='image-see'] > li:hover{
        box-shadow: 5px 5px 5px rgb(0,0,0);
    }
</style>