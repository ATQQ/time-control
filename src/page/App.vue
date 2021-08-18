<template>
  <el-config-provider :locale="locale">
    <TaskDataCard />>
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import TaskDataCard from './components/TaskDataCard.vue';

const locale = zhCn;
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
