<template>
  <div>
    <el-calendar v-model="value" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(new Date());
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
