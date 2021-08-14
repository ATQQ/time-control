const { initProject } = require('../template');
const { getCWD } = require('../utils');

const cwd = getCWD();
module.exports = function (projectName) {
  if (initProject(cwd, projectName)) {
    console.log(`初始化 ${projectName} 成功`);
    return;
  }
  console.log(`${projectName} 已存在`);
};
