#!/usr/bin/env node
const commander = require('commander');
const spawn = require('cross-spawn');
const path = require('path');
const json = require('../package.json');
const {
  outputCommand, initCommand, createCommand,
  upPathCommand, taskCommand, thingCommand,
  reportCommand,
} = require('../src/command');

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
commander.command('upPath [recordFilepath]')
  .alias('u')
  .description('Update recordFilepath configuration')
  .action(upPathCommand);

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
  .action(() => {
    const cwd = path.resolve(__dirname, '../');
    const serveService = spawn('node_modules/.bin/vite', ['src/page', '--host'], {
      cwd,
      stdio: 'inherit',
    });
    serveService.on('close', (code) => {
      process.exit(code);
    });
  });

commander.parse(process.argv);
