const { writeFileSync } = require('fs');
const { getJSON, getFileContent, mmsToNormal } = require('../utils');

// eslint-disable-next-line no-extend-native
Date.prototype.format = function dateFormat(fmt) {
  let format = fmt || 'yyyy-mm-dd';
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  });
  return format;
};

function fixedNum(num, length = 2) {
  return (+num).toFixed(length);
}

function outputJson(content) {
  return JSON.stringify(getJSON(content), null, 2);
}

function getEverydayData(timeDesc, withTime = false) {
  let res = [];
  // 按天任务时间汇总
  timeDesc.forEach((oneDay) => {
    const oneRes = [];
    const { title, tasks } = oneDay;
    const sumDay = tasks.reduce((preTime, task) => {
      const { title: taskName, things } = task;
      const sum = things.reduce((pre, thing) => {
        // 某件事情况
        const { content, time } = thing;
        oneRes.unshift(`* ${content} -- ${fixedNum(time)}`);
        return pre + (+thing.time);
      }, 0);

      // 某一个任务
      oneRes.unshift(`## ${taskName} -- ${fixedNum(sum)}`);
      return preTime + sum;
    }, 0);

    // 一天的标题
    oneRes.unshift(`# ${title} -- ${fixedNum(sumDay)}`);
    res.push(...oneRes, '');
  });
  // 去掉统计的时间
  if (!withTime) {
    res = res.map((v) => v.replace(/\s--.*/, ''));
  }
  return res;
}

function outPutMarkdown(jsonSchema, withTime = false) {
  // 从小到大排
  const schema = jsonSchema.sort((a, b) => {
    const d1 = new Date(a.title);
    const d2 = new Date(b.title);
    return d1 - d2;
  });
  const res = [];
  res.push(...getEverydayData(schema, withTime));
  return res.join('\n');
}

function outPutReport(jsonSchema) {
  const res = [];
  let sumTime = 0;
  const startDate = jsonSchema[0].title;
  const endDate = jsonSchema[jsonSchema.length - 1].title;
  // 时间
  res.push(`# ${startDate} 至 ${endDate}`);

  // 过滤出所有的tasks
  const allTasks = jsonSchema.reduce((pre, current) => pre.concat(current.tasks), []);

  // 合并相同的任务
  const tasks = allTasks.reduce((pre, current) => {
    if (pre.length === 0) {
      pre.push(current);
      return pre;
    }
    const sameTask = pre.find((v) => v.title === current.title);
    if (!sameTask) {
      pre.push(current);
      return pre;
    }
    sameTask.things.push(...current.things);
    return pre;
  }, []);

  // eslint-disable-next-line no-restricted-syntax
  for (const taskItem of tasks) {
    res.push('');
    res.push(`## ${taskItem.title}`);
    let taskTime = 0;
    const things = taskItem.things.map((thing) => {
      const { time, content } = thing;
      taskTime += (+time);
      return `* ${content}`;
    });
    res.push(`>耗时：${mmsToNormal(taskTime * 1000 * 3600)}`);
    res.push(...things);
    sumTime += taskTime;
  }
  res.splice(1, 0, `**总耗时** ${mmsToNormal(sumTime * 1000 * 3600)}`);
  return res.join('\n');
}

function writeRecord(filePath, task, thing, startTime) {
  const json = getJSON(getFileContent(filePath));
  const date = new Date(startTime);
  const title = date.format('yyyy-MM-dd');
  const hours = ((Date.now() - date.getTime()) / 3600000).toFixed(5);

  // 特殊处理元数据content带上time
  const things = json.reduce((pre, { tasks }) => {
    const temp = tasks.map((v) => v.things).flat(2);
    return pre.concat(temp);
  }, []);

  things.forEach((t) => {
    const { content, time } = t;
    // eslint-disable-next-line no-param-reassign
    t.content = `${content} ${time}`;
  });

  const dayIdx = json.findIndex((v) => v.title === title);

  // 当天的首个数据
  if (dayIdx === -1) {
    const item = {
      title,
      tasks: [
        {
          title: task,
          things: [
            {
              content: `${thing} ${hours}`,
              time: '0',
            },
          ],
        },
      ],
    };
    json.push(item);
    return writeFileSync(filePath, outPutMarkdown(json, false));
  }
  const dataItem = json[dayIdx];
  const taskIdx = dataItem.tasks.findIndex((v) => v.title === task);
  // 新的任务
  if (taskIdx === -1) {
    dataItem.tasks.push({
      title: task,
      things: [
        {
          content: `${thing} ${hours}`,
          time: '0',
        },
      ],
    });
    return writeFileSync(filePath, outPutMarkdown(json, false));
  }
  const taskItem = dataItem.tasks[taskIdx];
  taskItem.things.push({
    content: `${thing} ${hours}`,
    time: '0',
  });

  return writeFileSync(filePath, outPutMarkdown(json, false));
}
module.exports = {
  outputJson,
  outPutMarkdown,
  outPutReport,
  writeRecord,
};
