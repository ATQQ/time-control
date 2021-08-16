<template>
  <h1>{{ msg }}</h1>
  <button type="button" @click="printConfig">
    get config
  </button>
  <button type="button" @click="printEveryData">
    get all data
  </button>
</template>

<script setup>
import { onMounted } from 'vue'
import {getConfig,getEveryDayData} from './../api'
defineProps({
  msg: String
})

const printConfig = ()=>{
  getConfig().then(console.log)
}
const printEveryData = ()=>{
  getEveryDayData().then(console.log)
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
