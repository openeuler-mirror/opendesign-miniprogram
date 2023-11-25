const constants = require('../config/constants.js');
const { getStorageSync } = require('./utils');

/**
 * 获取用户信息
 */
const _getUserinfo = async function () {
  let userInfo;
  try {
    userInfo = await getStorageSync(constants.APP_USERINFO_SESSION);
  } catch (error) {
    userInfo = null;
  }
  return userInfo;
};

/**
 * 通过key获取值
 * @params key
 */
const _getValueByKey = async function (key) {
  if (!key) {
    return;
  }

  const userinfo = await _getUserinfo();

  if (!userinfo) {
    return;
  }
  return userinfo[key];
};

module.exports = {
  /**
   * 通过key获取对应信息
   */
  getUserInfoByKey: function (key) {
    return _getValueByKey(key);
  },

  /**
   * 获取用户信息
   */
  getUserinfo: function () {
    return _getUserinfo();
  },

  /**
   * 清除用户信息
   */
  clearUserInfo: function () {
    wx.removeStorageSync(constants.APP_USERINFO_SESSION);
  },

  /**
   * 判断是否登录
   */
  loginCheck: function () {
    if (_getUserinfo() && _getValueByKey('access')) {
      return true;
    }
    return false;
  },
};
