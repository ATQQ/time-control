const spawn = require('cross-spawn');
const path = require('path');

module.exports = function () {
  const cwd = path.resolve(__dirname, '../../');
  const viteConfigPath = path.join(cwd, 'src/page/vite.config.js');
  const serveService = spawn('node_modules/.bin/vite', ['src/page', '--host', '--config', viteConfigPath], {
    cwd,
    stdio: 'inherit',
  });
  const server = spawn('node', ['src/page/server.js'], {
    cwd,
    stdio: 'inherit',
  });
  serveService.on('close', (code) => {
    server.kill('SIGSTOP');
    process.exit(code);
  });
};
