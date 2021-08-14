const chalk = require('chalk');
const { existsSync } = require('fs');
const { writeRecord } = require('../output');
const {
  getConfig, updateConfig, mmsToNormal, print,
} = require('../utils');

module.exports = function (name, cmdObj) {
  const config = getConfig();
  const {
    thing, recordFilepath, tasks, defaultTaskIdx,
  } = config;
  const task = tasks[defaultTaskIdx];
  const s = new Date(thing.startTime);

  if (!existsSync(recordFilepath)) {
    print.fail(chalk.bold(recordFilepath), 'not exist');
    print.advice('use', chalk.yellowBright('timec upPath <recordFilepath>'), 'set it');
    return;
  }
  if (!task) {
    print.fail('task list is empty');
    print.advice(`you can use ${chalk.yellowBright('timec task [name]')} set it`);
    return;
  }

  if (!name) {
    if (!thing.name) {
      print.fail('Events not in progress');
      return;
    }
    const { stop } = cmdObj;
    if (stop) {
      // log上一个任务耗时
      print(chalk.blueBright(`---${chalk.greenBright('finish thing')}---`));
      print(`${chalk.blueBright('*')} ${chalk.yellowBright('name')}:     ${thing.name}`);
      print(`${chalk.blueBright('*')} ${chalk.yellowBright('start')}:    ${new Date(thing.startTime).format('yyyy-MM-dd hh:mm:ss')}`);
      print(`${chalk.blueBright('*')} ${chalk.yellowBright('duration')}: ${mmsToNormal(Date.now() - s)}`);
      print(chalk.blueBright('------------------'));
      writeRecord(recordFilepath, task, thing.name, thing.startTime);
      thing.name = '';
      thing.startTime = '';
      updateConfig(config);
      return;
    }
    print(chalk.blueBright('------------------'));
    print(`${chalk.blueBright('*')} ${chalk.yellowBright('name')}:     ${thing.name}`);
    print(`${chalk.blueBright('*')} ${chalk.yellowBright('start')}:    ${new Date(thing.startTime).format('yyyy-MM-dd hh:mm:ss')}`);
    print(`${chalk.blueBright('*')} ${chalk.yellowBright('duration')}: ${mmsToNormal(Date.now() - s)}`);
    print(chalk.blueBright('------------------'));
    return;
  }

  if (thing.name) {
    // log上一个任务耗时
    print(chalk.blueBright(`---${chalk.greenBright('finish thing')}---`));
    print(`${chalk.blueBright('*')} ${chalk.yellowBright('name')}:     ${thing.name}`);
    print(`${chalk.blueBright('*')} ${chalk.yellowBright('start')}:    ${new Date(thing.startTime).format('yyyy-MM-dd hh:mm:ss')}`);
    print(`${chalk.blueBright('*')} ${chalk.yellowBright('duration')}: ${mmsToNormal(Date.now() - s)}`);
    print(chalk.blueBright('------------------'));
    // 记录到文件中
    writeRecord(recordFilepath, task, thing.name, thing.startTime);
  }

  thing.name = name;
  thing.startTime = new Date().getTime();

  print(chalk.blueBright(`-----${chalk.cyanBright('new thing')}----`));
  print(`${chalk.blueBright('*')} ${chalk.yellowBright('name')}:     ${thing.name}`);
  print(`${chalk.blueBright('*')} ${chalk.yellowBright('start')}:    ${new Date().format('yyyy-MM-dd hh:mm:ss')}`);
  print(chalk.blueBright('------------------'));
  updateConfig(config);
};
