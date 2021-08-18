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
import { onMounted, reactive, ref } from 'vue';
import { getEveryDayData } from '../api';

const value = ref(new Date());
const parseDay = (date) => {
  const [day] = date.split('-').slice(2);
  return +day;
};

const sumData = reactive({
  // '2021-08-18': {
  //   time: '5.55h',
  //   tasks: [
  //     {
  //       title: '测试',
  //       time: '5.55h',
  //       things: [
  //         {
  //           title: '写文档',
  //           time: '5.55h',
  //         },
  //       ],
  //     },
  //   ],
  // },
});

const parseOneDay = (data)=>{
  const o = {
    time:'',
    tasks:[]
  }
  if(!data||!data.title){
    return {}
  }
  let sumTime = 0
  data.tasks.forEach(t=>{
    let task = {
      title:t.title,
      time:'',
      things:[]
    }

    let taskTime = 0
    t.things.forEach(thing=>{
      const {time,content} = thing
      taskTime+=(+time)
      task.things.push({
        title:content,
        time:`${time}h`
      })
    })
    task.time = `${taskTime}h`
    sumTime+=taskTime

    o.tasks.push(task)
  })
  o.time = `${sumTime}h`
  return {
    [data.title]:o
  }
}

const refresData = async ()=>{
  const {data} = await getEveryDayData()
  data.forEach(v=>{
    Object.assign(sumData,{
      ...parseOneDay(v)
    })
  })
}

onMounted(()=>{
  setInterval(()=>{
    refresData()
  },1200)
})
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
  overflow-y: auto;
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
