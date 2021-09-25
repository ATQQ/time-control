const chalk = require('chalk');
const { spawn } = require('cross-spawn');
const { existsSync } = require('fs');
const {
  getConfig, getCWD, updateConfig, getFilePath, createFile, print, configPath: originConfigPath,
} = require('../utils');

const cwd = getCWD();

module.exports = function pathCommand(type, filepath) {
  const safeTypes = ['dir', 'file', 'config'];
  if (safeTypes.indexOf(type) === -1) {
    print.fail('not support type');
    print.advice('only support type in [dir,file,config]');
    return;
  }
  const config = getConfig();

  const options = {
    dir() {
      if (!filepath) {
        spawn('tc', ['path', 'file'], {
          cwd,
          stdio: 'inherit',
        });
        spawn('tc', ['path', 'config'], {
          cwd,
          stdio: 'inherit',
        });
        return;
      }
      const dirPath = getFilePath(cwd, filepath);
      if (!existsSync(dirPath)) {
        print.fail(`${chalk.blueBright(dirPath)} not exist,please exec mkdir to create it`);
        return;
      }
      const recordFile = getFilePath(filepath, 'auto.md');
      const configFile = getFilePath(filepath, 'timec.json');
      // 设置recordFile
      spawn('tc', ['path', 'file', recordFile], {
        cwd,
        stdio: 'inherit',
      });
      // 避免操作冲突
      setTimeout(() => {
        // 设置config
        spawn('tc', ['path', 'config', configFile], {
          cwd,
          stdio: 'inherit',
        });
      }, 100);
    },
    file() {
      const { recordFilepath } = config;
      if (!filepath) {
        if (existsSync(recordFilepath)) {
          print(chalk.yellow('recordFile'), chalk.blueBright(recordFilepath));
        } else {
          print.fail('not set valid recordFilepath');
        }
        return;
      }
      const fullPath = getFilePath(cwd, filepath);
      if (!existsSync(fullPath)) {
        // 自动创建空文件
        createFile(fullPath, '', false);
      }
      print.success('set recordFilePath', chalk.yellowBright(fullPath));
      updateConfig({
        recordFilepath: fullPath,
      });
    },
    config() {
      if (!filepath) {
        const { configPath } = config;
        print(chalk.yellow('configFile'), chalk.blueBright(configPath || originConfigPath));
        return;
      }
      const configPath = getFilePath(cwd, filepath);
      if (!existsSync(configPath)) {
        // copy 当前配置文件的内容
        createFile(configPath, JSON.stringify(config, null, 2), false);
      }
      print.success('set recordFilePath', chalk.yellowBright(configPath));
      updateConfig({
        ...config,
        configPath,
      }, true);
    },
  };
  // eslint-disable-next-line no-unused-expressions
  options[type] && options[type]();
};
