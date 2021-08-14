const { existsSync } = require('fs');
const { writeRecord } = require('../output');
const { getConfig, updateConfig, mmsToNormal } = require('../utils');

module.exports = function (name, cmdObj) {
  const config = getConfig();
  const {
    thing, recordFilepath, tasks, defaultTaskIdx,
  } = config;
  const task = tasks[defaultTaskIdx];
  const s = new Date(thing.startTime);

  if (!existsSync(recordFilepath)) {
    console.log(`${recordFilepath} is not exist`);
    console.log('you can use "timec upPath <recordFilepath>" set it');
    return;
  }
  if (!task) {
    console.log('not set task');
    console.log('you can use "timec task [name]" set it');
    return;
  }

  if (!name) {
    if (!thing.name) {
      console.log('Events not in progress');
      return;
    }
    const { stop } = cmdObj;
    if (stop) {
      // log上一个任务耗时
      console.log('---finish thing---');
      console.log(`* name:     ${thing.name}`);
      console.log(`* start:    ${new Date(thing.startTime).format('yyyy-MM-dd hh:mm:ss')}`);
      console.log(`* duration: ${mmsToNormal(Date.now() - s)}`);
      console.log('------------------');
      writeRecord(recordFilepath, task, thing.name, thing.startTime);
      thing.name = '';
      thing.startTime = '';
      updateConfig(config);
      return;
    }
    console.log('------------------');
    console.log(`* name:     ${thing.name}`);
    console.log(`* start:    ${new Date(thing.startTime).format('yyyy-MM-dd hh:mm:ss')}`);
    console.log(`* duration: ${mmsToNormal(Date.now() - s)}`);
    console.log('------------------');
    return;
  }

  if (thing.name) {
    // log上一个任务耗时
    console.log('---finish thing---');
    console.log(`* name:     ${thing.name}`);
    console.log(`* start:    ${new Date(thing.startTime).format('yyyy-MM-dd hh:mm:ss')}`);
    console.log(`* duration: ${mmsToNormal(Date.now() - s)}`);
    console.log('------------------');
    // 记录到文件中
    writeRecord(recordFilepath, task, thing.name, thing.startTime);
  }

  thing.name = name;
  thing.startTime = new Date().getTime();

  console.log('-----new thing----');
  console.log(`* name:     ${thing.name}`);
  console.log(`* start:    ${new Date().format('yyyy-MM-dd hh:mm:ss')}`);
  console.log('------------------');

  updateConfig(config);
};
