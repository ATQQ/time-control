/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const player = require('play-sound')();

const { floor } = Math;

/**
 * 获取md文件的JSON描述
 * @param {string} fileContent
 */
function getJSON(fileContent) {
  const lines = fileContent.split('\n');
  const resData = [];
  let item = null;
  for (const line of lines) {
    // 判断是否新的一天
    if (line.startsWith('# ')) {
      // 存储旧的
      if (item) {
        resData.push(item);
      }

      const title = line.replace(/#|\s/g, '');
      item = {
        title,
        tasks: [],
      };
    }

    // 判断是否是任务
    if (line.startsWith('## ')) {
      const title = line.replace(/#|\s/g, '');
      const task = {
        title,
        things: [],
      };
      item.tasks.push(task);
    }

    // 判断是否是做的具体事务
    if (line.startsWith('* ')) {
      const task = item.tasks.pop();
      const { things } = task;
      const rTime = /((\d+.\d*)|(\d*))?$/;

      const time = line.match(rTime)[0] || '0';
      let step = -1;
      let text = '';
      text = line.replace(/\*|\s/g, '');
      step = text.lastIndexOf(time);
      const content = step === -1 ? text : text.slice(0, step);
      const thing = {
        time,
        content,
      };

      things.push(thing);

      item.tasks.push(task);
    }
  }
  if (item && item !== resData[resData.length - 1]) {
    resData.push(item);
  }
  return resData;
}

function getJSONByRange(fileContent, startTime, endTime) {
  let jsonSchema = getJSON(fileContent);
  // 从小到大排
  jsonSchema = jsonSchema.sort((a, b) => {
    const d1 = new Date(a.title);
    const d2 = new Date(b.title);
    return d1 - d2;
  }).filter((v) => {
    const d = new Date(v.title);
    const s = new Date(startTime);
    const e = new Date(endTime);
    return d >= s && d <= e;
  });
  return jsonSchema;
}

/**
 * 创建一个不存在的目录
 * @param {string} path
 */
function createDir(filepath) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath, { recursive: true });
    return true;
  }
  return false;
}

/**
 * 创建一个新文件
 * @param {string} path
 * @param {string} content
 * @param {boolean} judgeRepeat
 */
function createFile(filepath, content, judgeRepeat = true) {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, content, { encoding: 'utf-8' });
    return true;
  }
  if (judgeRepeat) {
    print(chalk.red('文件已存在'), chalk.bold(filepath));
    return false;
  }
  fs.writeFileSync(getNoRepeatFilePath(filepath), content, { encoding: 'utf-8' });
  return true;
}

/**
 * 获取文件内容
 * @param {string} filepath
 */
function getFileContent(filepath) {
  return fs.readFileSync(filepath, { encoding: 'utf-8' });
}

/**
 * 获取多个文件的内容
 * @param {string[]} files
 */
function getFilesContent(files) {
  return files.reduce((pre, now) => {
    pre += '\n';
    pre += getFileContent(now);
    return pre;
  }, '');
}

function getFilePath(...p) {
  return path.join(...p);
}

/**
 * 获取与原文件不重复的一个文件路经
 * @param {string} originPath
 */
function getNoRepeatFilePath(originPath) {
  let num = 1;
  const { dir, name, ext } = path.parse(originPath);
  if (!fs.existsSync(originPath)) {
    return originPath;
  }
  // todo：待优化
  while (fs.existsSync(getFilePath(dir, `${name}-${num}${ext}`))) {
    num += 1;
  }
  return getFilePath(dir, `${name}-${num}${ext}`);
}

/**
 * 毫秒转时分秒
 */
function mmsToNormal(mms) {
  let str = '';
  mms = floor(mms / 1000);
  const day = floor(mms / (24 * 60 * 60));
  if (day) {
    str += `${day}天 `;
  }
  mms -= day * 24 * 60 * 60;
  const hour = floor(mms / (60 * 60));
  if (hour) {
    str += `${hour}时 `;
  }
  mms -= hour * 60 * 60;
  const minute = floor(mms / 60);
  if (minute) {
    str += `${minute}分 `;
  }
  mms -= minute * 60;
  str += `${mms}秒`;
  return str;
}

function getCWD() {
  return process.cwd();
}

const configPath = path.join(__dirname, '../../.config/record.json');
function getConfig() {
  delete require.cache[configPath];
  return require(configPath);
}

function updateConfig(cfg) {
  cfg = Object.assign(getConfig(), cfg);
  return fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
}

function getOutFilename() {
  return 'timec-res';
}
const { log } = console;

function print(...str) {
  log(...str);
}

Object.assign(print, {
  success(...str) {
    log(chalk.green('success:'), ...str);
  },
  fail(...str) {
    log(chalk.red('fail:'), ...str);
  },
  advice(...str) {
    log(chalk.blue('advice'), ...str);
  },
});

function playRemindAudio(cb) {
  player.play(getFilePath(__dirname, './../assets/success.wav'), (err) => {
    if (err) throw err;
    setTimeout(() => {
      if (typeof cb === 'function') {
        cb();
      }
    }, 3000);
  });
}

module.exports = {
  getJSON,
  createDir,
  getFileContent,
  createFile,
  getFilesContent,
  getFilePath,
  getJSONByRange,
  mmsToNormal,
  getCWD,
  getConfig,
  getOutFilename,
  updateConfig,
  configPath,
  print,
  playRemindAudio,
};
