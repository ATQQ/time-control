const { getConfig, updateConfig } = require('../utils');

module.exports = function (name, cmdObj) {
  const config = getConfig();
  const { tasks, defaultTaskIdx } = config;

  const { del } = cmdObj;
  const idx = tasks.findIndex((v) => v === name);
  if (!name) {
    if (tasks.length === 0) {
      console.log('no tasks, you can use command add task');
      console.log('timec task [name]');
      return;
    }
    tasks.forEach((v, i) => {
      let mark = '[ ]';
      if (i === +defaultTaskIdx) {
        mark = '[*]';
      }
      console.log(mark, v);
    });
    return;
  }
  if (idx === -1) {
    if (del) {
      console.log(`${name} not exist!!!`);
      return;
    }
    tasks.push(name);
    if (tasks.length === 1) {
      config.defaultTaskIdx = 0;
    }
    console.log(`add task（${name}）success`);
  } else if (del) {
    tasks.splice(idx, 1);
    console.log(`del ${name} success`);
    config.defaultTaskIdx = defaultTaskIdx >= idx ? defaultTaskIdx - 1 : defaultTaskIdx;
    if (config.defaultTaskIdx >= 0) {
      console.log('now use task:', tasks[config.defaultTaskIdx]);
    }
  } else {
    config.defaultTaskIdx = idx;
    console.log('now use task:', tasks[idx]);
  }
  updateConfig(config);
};
