const chalk = require('chalk');
const { initProject } = require('../template');
const { getCWD, print } = require('../utils');

const cwd = getCWD();
module.exports = function initCommand(projectName) {
  if (initProject(cwd, projectName)) {
    print.success(chalk.bold('初始化项目'), chalk.yellow(projectName));
    return;
  }
  print.fail(chalk.bold('项目'), chalk.yellow(projectName), chalk.red('已存在'));
};
