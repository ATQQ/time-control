#!/usr/bin/env node
const commander = require('commander');
const play = require('play/lib/play');
const spawn = require('cross-spawn');
const json = require('../package.json');
const {
  outputCommand, initCommand, createCommand,
  pathCommand, taskCommand, thingCommand,
  reportCommand,
  pageCommand,
} = require('../src/command');
const { getFilePath, getCWD, getConfig } = require('../src/utils');

// 设置版号
commander.version(json.version);

// 导出
commander.command('output [filenames...]')
  .alias('o')
  .option('-j, --json', 'Exporting results to JSON')
  .option('-m, --markdown', 'Exporting results to Markdown')
  .option('-t, --time', 'Does the result include time')
  .action(outputCommand);

/**
 * 初始化项目
 */
commander.command('init <projectName>')
  .alias('i')
  .description('Init a project')
  .action(initCommand);

/**
 * 创建一个时间记录模板文件
 */
commander.command('create <filename>')
  .alias('c')
  .description('Create a template record file')
  .action(createCommand);

/**
 * 创建任务、切换任务、查看任务列表
 */
commander.command('task [name]')
  .alias('t')
  .option('-d, --del', 'Delete task')
  .description('Task Management')
  .action(taskCommand);

/**
 * 更改默认记录文件的位置
 */
commander.command('path [recordFilepath]')
  .alias('u')
  .description('Update recordFilepath configuration')
  .action(pathCommand);

/**
 * 开始/结束具体的事务
 */
commander.command('thing [name]')
  .alias('tt')
  .option('-s, --stop', 'stop thing ')
  .description('Things Management')
  .action(thingCommand);

commander.command('report [filenames...]')
  .alias('r')
  .description('Automatic generation of time management reports')
  .option('-D, --day [date]', 'One day')
  .option('-M, --month [month]', 'One month')
  .option('-Y, --year [year]', 'One year')
  .option('-R, --range [startDate_endDate]', 'A time period')
  .action(reportCommand);

commander.command('page')
  .description('Use Page show report')
  .action(pageCommand);

commander.command('remind')
  .description('Open auto remind music')
  .option('-c,--cycle [time]', 'Set the duration of the reminder cycle（minute）', '40')
  .action((cmdObj) => {
    // 提醒周期（minute）
    const time = +cmdObj.cycle;
    const oneMinute = 1000 * 60;
    const loop = () => {
      setTimeout(() => {
        play.sound(getFilePath(__dirname, './../node_modules/play/wavs/drums/kick.wav'));
        play.sound(getFilePath(__dirname, './../node_modules/play/wavs/drums/snare.wav'));
        play.sound(getFilePath(__dirname, './../node_modules/play/wavs/drums/tick.wav'));
        loop();
        // 自动记录一下
        const cwd = getCWD();
        const { thing } = getConfig();
        spawn('timec', ['thing', thing.name], {
          cwd,
          stdio: 'inherit',
        });
      }, time * oneMinute);
    };
    loop();
  });
commander.parse(process.argv);
