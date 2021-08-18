<template>
  <div>
    <el-calendar v-model="value">
      <template #dateCell="{ data }">
        <div class="day">
          <div class="time">
            <strong>
              <span>{{ parseDay(data.day) }}</span>
            </strong>
            <span>{{ sumData[data.day]?.time || '0h' }}</span>
          </div>
          <ul class="tasks" v-if="sumData[data.day]?.tasks?.length">
            <div v-for="(v,idx) in sumData[data.day].tasks" :key="idx">
              <el-popover
                v-if="v?.things?.length"
                placement="right"
                :title="data.day"
                :width="200"
                trigger="click"
              >
                <template #reference>
                  <li>
                    <span>{{ v.title }}</span>
                    <span>{{ v.time }}</span>
                  </li>
                </template>
                <ol class="things">
                  <li v-for="(t,idx) in v.things" :key="idx">
                    <span>{{ t.title }}</span>
                    <span>{{ t.time }}</span>
                  </li>
                </ol>
              </el-popover>
            </div>
          </ul>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const value = ref(new Date());
const parseDay = (date) => {
  const [day] = date.split('-').slice(2);
  return +day;
};

const sumData = reactive({
  '2021-08-18': {
    time: '5.55h',
    tasks: [
      {
        title: '洋葱',
        time: '5.55h',
        things: [
          {
            title: '写文档',
            time: '5.55h',
          },
        ],
      },
      {
        title: '洋葱',
        time: '5.55h',
        things: [

        ],
      },
    ],
  },
});
</script>

<style scoped>
.day {
  display: flex;
  flex-direction: column;
}
.day .time {
  font-size: 14px;
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
}
.tasks {
  list-style: none;
  padding-left: 4px;
  max-height: 60px;
  overflow: scroll;
}
.tasks li {
  background-color: #ecd9f4;
  font-size: 12px;
  padding: 0 5px;
  line-height: 14px;
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

.things {
  list-style: none;
}
.things li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
</style>
