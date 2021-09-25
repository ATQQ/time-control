const chalk = require('chalk');
const { createTemplateFile } = require('../template');
const { getCWD, print, getFilePath } = require('../utils');

const cwd = getCWD();

module.exports = function createCommand(filename) {
  const filepath = getFilePath(cwd, filename);
  if (createTemplateFile(cwd, filename)) {
    print.success(chalk.bold('创建文件'), filepath);
  }
};
