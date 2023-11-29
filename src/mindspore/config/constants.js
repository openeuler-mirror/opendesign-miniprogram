let _ = require('../utils/underscore-extend.js');

// 服务连接配置
let serviceConfig = {
  SERVICE_URL: 'https://meetingserver-mindspore-icsl.test.osinfra.cn', // 灰度环境、
};

// 存储配置
let storageConfig = {
  APP_USERINFO_SESSION: '_app_userinfo_session',
};

// 所有配置
let constants = _.deepExtend(true, serviceConfig, storageConfig);

module.exports = constants;
