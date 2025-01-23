<script setup lang="ts">
  import Main from '@/components/main.vue'
  import {RouterView} from 'vue-router'
</script>

<template>
  <Main>
    <template #content>
      <RouterView/> 
    </template>
  </Main>
</template>

