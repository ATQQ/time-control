const chalk = require('chalk');
const { existsSync } = require('fs');
const {
  getConfig, getCWD, updateConfig, getFilePath, createFile, print,
} = require('../utils');

const cwd = getCWD();

module.exports = function (newFilepath) {
  const { recordFilepath } = getConfig();
  if (!newFilepath) {
    if (recordFilepath) {
      print(`recordFilepath: ${chalk.yellowBright(recordFilepath)}`);
    } else {
      print.fail('not set recordFilepath');
    }
    return;
  }
  const fullPath = getFilePath(cwd, newFilepath);
  if (!existsSync(fullPath)) {
    // 自动创建空文件
    createFile(fullPath, '', false);
  }
  print.success('set recordFilePath', chalk.yellowBright(fullPath));
  updateConfig({
    recordFilepath: fullPath,
  });
};
