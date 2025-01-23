<template>
    <div class="about-con">
        <div class="item" data-index="0">
            <div class="title">XMmusic 星冥音乐</div>
            <div class="desc">
                受在一个平台的音乐没有版权，被迫换另一个平台的影响，于是萌生了开发一个音乐软件的想法。这是一个基于Vue.js+electron的音乐软件，
                努力打造一个集合多平台音乐资源、高度个性化、满足音乐需求、性能高效的音乐软件。同时也是作者的一个前端开发项目练习。
            </div>
        </div>
        <div class="item" data-index="1">
            <div class="title">开发团队</div>
            <div class="desc">
                无。只有作者一个人开发。
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>



</script>



<style scoped>
    .about-con{
        width:60%;
        height:100%;
        overflow-x:hidden;
        overflow-y:auto;
        color:white;
    }
    .item{
        padding-top:10px;
        width:100%;
        height:120px;
        border-radius:6px;
        border:1px solid rgba(255,255,255,.1);
        background-color:rgba(44,44,44,.8);
    }
    .item > .title{
        font-size:20px;
        font-weight:bold;
        margin-bottom:10px;
        margin-left:10px;
        user-select:text;
    }
    .item > .desc{
        font-size:14px;
        margin-left:10px;
        user-select:text;
    }
    .item[data-index="1"]{
        height:80px;
    }


</style>