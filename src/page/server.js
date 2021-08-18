const { Fw } = require('flash-wolves');
const fs = require('fs');
const { getConfig, getJSON, getFileContent } = require('../utils');

const app = new Fw((req, res) => {
  // 开启CORS
  const { method } = req;
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  // 跨域允许的header类型
  res.setHeader('Access-Control-Allow-Headers', '*');
  // 允许跨域携带cookie
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // 允许的方法
  res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  // 设置响应头
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  // 对预检请求放行
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
  }
});

app.get('/json', (req, res) => {
  const config = getConfig();
  const { recordFilepath } = config;
  if (fs.existsSync(recordFilepath)) {
    res.success(getJSON(getFileContent(recordFilepath)));
    return;
  }
  res.fail(500, 'not set default recordFilepath');
});

app.get('/config', (req, res) => {
  const config = getConfig();
  res.success(config);
});

app.listen(3001);
