<template>
    <div class="back" :style="{opacity:Opacity}"></div>
    <div class="image" :style="{backgroundImage:'url('+BackImage+')',filter:`blur(${Filter}px)`}"></div>
</template>

<script lang="ts" setup>
import { ref,watch, onUnmounted } from 'vue'
import {images} from '@/script/images.ts'
// 监听 localStorage 的变化
const Opacity = ref(localStorage.getItem('opacity') ? parseFloat(localStorage.getItem('opacity')!) : 0.5);
const BackImage = ref(localStorage.getItem('back') ? localStorage.getItem('back') : images.back.back1)
const Filter = ref(localStorage.getItem('filter') ? localStorage.getItem('filter') : 'blur(0px)')
window.addEventListener("setItemEvent",function(e){
    const event = e as CustomEvent; // 类型断言
    const key = event.detail.key
    const newValue = event.detail.newValue
    if (key === 'opacity'){
        Opacity.value = newValue
    }
    else if(key === 'back'){
        BackImage.value = newValue
    }
    else if(key === 'filter'){
        Filter.value = newValue
    }
})



</script>

<style scoped>
    .back{
        z-index:-1;
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background-color:rgba(0,0,0);
        transition:.5s;
    }
    .image{
        z-index:-2;
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background-image:url('../../public/images/back/1.png');
        background-size:cover;
        background-position:center;
        background-repeat: no-repeat;
        transition:.2s;
    }
</style>