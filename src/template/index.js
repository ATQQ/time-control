const path = require('path');

const { createFile, createDir, getFileContent } = require('../utils');

// 静态资源目录
const assetsDir = path.resolve(__dirname, 'assets');

const readmeContent = getFileContent(path.resolve(assetsDir, 'README.md'));
const demoContent = getFileContent(path.resolve(assetsDir, 'demo.md'));

/**
 * 初始化一个模板项目
 * @param {string} cwd 项目目录
 * @param {string} projectName 项目名称
 */
function initProject(cwd, projectName) {
  const dir = path.resolve(cwd, projectName);
  // 创建目录
  if (createDir(dir)) {
    createFile(path.resolve(dir, 'README.md'), readmeContent);

    createDir(path.resolve(dir, 'work'));
    createDir(path.resolve(dir, 'study'));

    createFile(path.resolve(dir, 'work', 'README.md'), demoContent);
    createFile(path.resolve(dir, 'study', 'README.md'), demoContent);
    return true;
  }

  return false;
}

/**
 * 初始化一个模板记录文件
 * @param {string} cwd 文件目录
 * @param {string} filename 文件名称
 */
function createTemplateFile(cwd, filename) {
  return createFile(path.resolve(cwd, filename), demoContent);
}

module.exports = {
  initProject,
  createTemplateFile,
};
