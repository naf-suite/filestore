'use strict';

const { sep } = require('path');
const ErrorConfig = require('./config.error.js');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1515578157616_3792';

  // add your config here
  config.middleware = [];
  config.cluster = {
    listen: {
      port: 8009,
    },
  };

  // 安全配置
  config.security = {
    csrf: {
      // ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
      enable: false,
    },
  };

  config.cdn = {
    repos_root_path: `${appInfo.baseDir}${sep}upload`,
    repos_root_url: '',
  };

  config.onerror = ErrorConfig;

  return config;
};
