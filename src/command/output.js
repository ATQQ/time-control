const chalk = require('chalk');
const { existsSync } = require('fs');
const { outputJson, outPutMarkdown } = require('../output');
const {
  getJSON, getCWD, getConfig, getOutFilename, getFilesContent, createFile, getFilePath, print,
} = require('../utils');

const cwd = getCWD();
const outFilename = getOutFilename();

module.exports = function (filenames, cmdObj) {
  const config = getConfig();
  const { recordFilepath } = config;
  if (filenames.length === 0 && !existsSync(recordFilepath)) {
    print.fail(chalk.bold(recordFilepath), 'not exist');
    print.advice('use', chalk.yellowBright('timec upPath <recordFilepath>'), 'set it');
    return;
  }

  // 获取所有文件的内容
  filenames = filenames.map((filename) => getFilePath(cwd, filename));
  if (filenames.length === 0) {
    filenames = [recordFilepath];
  }
  const content = getFilesContent(filenames);
  const { json, markdown, time } = cmdObj;

  if (json) {
    createFile(getFilePath(cwd, `${outFilename}.json`), outputJson(content), false);
    print.success('导出json');
  }
  if (markdown) {
    createFile(getFilePath(cwd, `${outFilename}.md`), outPutMarkdown(getJSON(content), time), false);
    print.success('导出markdown');
  }
};
