#!/usr/bin/env node
const commander = require('commander');
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
  .option('-j, --json', 'Export result as json description file')
  .option('-m, --markdown', 'Export the result as a markdown file')
  .option('-t, --time', 'Export the result with time')
  .action(outputCommand);

/**
 * 初始化项目
 */
commander.command('init <projectName>')
  .alias('i')
  .description('init project')
  .action(initCommand);

/**
 * 创建一个时间记录模板文件
 */
commander.command('create <filename>', {})
  .alias('c')
  .description('create template note file')
  .action(createCommand);

/**
 * 创建任务、切换任务、查看任务列表
 */
commander.command('task [name]')
  .option('-d, --del', 'Delete task or thing')
  .description('check tasks/add task/checkout task')
  .action(taskCommand);

/**
 * 更改默认记录文件的位置
 */
commander.command('upPath [recordFilepath]')
  .description('update config recordFilepath')
  .action(upPathCommand);

/**
 * 开始/结束具体的事务
 */
commander.command('thing [name]')
  .option('-s, --stop', 'stop a thing ')
  .description('manage things')
  .action(thingCommand);

commander.command('report [filenames...]')
  .description('Automatic generation of time management reports')
  .option('-D, --day [date]', 'One day')
  .option('-M, --month [month]', 'One month')
  .option('-Y, --year [year]', 'One year')
  .option('-R, --range [startDate_endDate]', 'A time period')
  .action(reportCommand);

commander.parse(process.argv);
