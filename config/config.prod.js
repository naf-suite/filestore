'use strict';

const { sep } = require('path');

module.exports = appInfo => {
  const config = exports = {};

  config.cdn = {
    repos_root_path: `${appInfo.baseDir}${sep}upload`,
    repos_root_url: '/files',
  };

  return config;
};
