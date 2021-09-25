const chalk = require('chalk');
const inquirer = require('inquirer');
const { getConfig, updateConfig, print } = require('../utils');

module.exports = function taskCommand(name, cmdObj) {
  const config = getConfig();
  const { tasks, defaultTaskIdx } = config;

  const { del } = cmdObj;
  const idx = tasks.findIndex((v) => v === name);
  if (!name) {
    if (tasks.length === 0) {
      print.fail('no tasks, you can use command add task');
      print.advice('tc task [name]');
      return;
    }
    const choices = [];
    tasks.forEach((v, i) => {
      if (i === +defaultTaskIdx) {
        choices.unshift(v);
      } else {
        choices.push(v);
      }
    });
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'task',
          message: '切换任务',
          choices,
        },
      ])
      .then(({ task }) => {
        config.defaultTaskIdx = tasks.findIndex((v) => v === task);
        print('now use task:', chalk.yellowBright(tasks[config.defaultTaskIdx]));
        updateConfig(config);
      })
      .catch((error) => {
        console.log(error);
      });
    return;
  }
  if (idx === -1) {
    if (del) {
      print.fail(chalk.yellowBright(name), 'not exist!!!');
      return;
    }
    tasks.push(name);
    if (tasks.length === 1) {
      config.defaultTaskIdx = 0;
    }
    print.success('add task', chalk.yellowBright(name));
  } else if (del) {
    tasks.splice(idx, 1);
    print.success('delete', chalk.yellowBright(name));
    config.defaultTaskIdx = defaultTaskIdx >= idx ? defaultTaskIdx - 1 : defaultTaskIdx;
    if (config.defaultTaskIdx >= 0) {
      print('now use task:', chalk.yellowBright(tasks[config.defaultTaskIdx]));
    }
  } else {
    config.defaultTaskIdx = idx;
    print('now use task:', chalk.yellowBright(tasks[config.defaultTaskIdx]));
  }
  updateConfig(config);
};
