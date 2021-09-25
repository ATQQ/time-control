const spawn = require('cross-spawn');
const { getCWD, getConfig, playRemindAudio } = require('../utils');

module.exports = function remindCommand(cmdObj) {
// 提醒周期（minute）
  const time = +cmdObj.cycle;
  const oneMinute = 1000 * 60;
  const loop = () => {
    setTimeout(() => {
      playRemindAudio(loop);
      // 自动记录一下
      const cwd = getCWD();
      const { thing } = getConfig();
      spawn('timec', ['thing', thing.name], {
        cwd,
        stdio: 'inherit',
      });
    }, time * oneMinute);
  };
  loop();
};
