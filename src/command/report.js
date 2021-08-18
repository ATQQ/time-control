const chalk = require('chalk');
const { existsSync } = require('fs');
const { outPutReport } = require('../output');
const {
  getConfig, getFilePath, getJSONByRange,
  createFile, getFilesContent, getCWD, getOutFilename, print,
} = require('../utils');

const cwd = getCWD();
const outFilename = getOutFilename();
module.exports = function (filenames, cmdObj) {
  const config = getConfig();
  const { recordFilepath } = config;

  if (filenames.length === 0 && !existsSync(recordFilepath)) {
    print.fail(chalk.bold(recordFilepath), 'not exist');
    print.advice('use', chalk.yellowBright('timec path <recordFilepath>'), 'set it');
    return;
  }
  const content = getFilesContent(filenames.length === 0
    ? [recordFilepath] : filenames.map((filename) => getFilePath(cwd, filename)));

  const {
    day, month, year, range,
  } = cmdObj;
  const output = (s, e) => {
    const outPutPath = getFilePath(cwd, `report-${outFilename}.md`);
    const json = getJSONByRange(content, s, e);
    if (json.length === 0) {
      print.fail('没有符合条件的数据');
      return;
    }
    const data = outPutReport(json);
    createFile(outPutPath, data, false);
    print.success('导出成功');
  };
  if (range) {
    const [startTime, endTime] = range.split('_');
    output(startTime, endTime);
    return;
  }
  if (day) {
    output(day, day);
    return;
  }
  if (year && month) {
    output(`${year}-${month}-01`, `${year}-${month}-${new Date(year, month, 0).getDate()}`);
    return;
  }
  if (year) {
    output(`${year}-01-01`, `${year}-12-31`);
    return;
  }
  if (month) {
    const y = new Date().getFullYear();
    output(`${y}-${month}-01`, `${y}-${month}-${new Date(y, month, 0).getDate()}`);
    return;
  }
  // 兜底，没有选值(上下1000年,希望代码还在)
  output('1970-01-01', '2970-01-01');
};
