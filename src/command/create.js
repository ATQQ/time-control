const { createTemplateFile } = require('../template');
const { getCWD } = require('../utils');

const cwd = getCWD();

module.exports = function (filename) {
  if (createTemplateFile(cwd, filename)) {
    console.log(`${filename} 创建成功`);
    return;
  }
  console.log(`${filename} 已存在`);
};
