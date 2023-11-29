const appAjax = require('./app-ajax.js');
const constants = require('../config/constants');
const { getStorageSync, setStorageSync } = require('./utils');

const appUser = {
  /**
   * 保存用户信息
   * @param {Object} result
   */
  saveLoginInfo: async function (result) {
    await setStorageSync(constants.APP_USERINFO_SESSION, result);
  },

  updateUserInfo: async function (callback) {
    let userInfo;
    try {
      userInfo = await getStorageSync(constants.APP_USERINFO_SESSION);
    } catch (error) {
      userInfo = null;
    }
    if (userInfo && userInfo.userId) {
      appAjax.postJson({
        type: 'GET',
        service: 'GET_USER_STATUS',
        otherParams: {
          id: userInfo.userId,
        },
        success: async function (ret) {
          if (ret) {
            // 更新userInfo数据
            userInfo = await getStorageSync(constants.APP_USERINFO_SESSION);
            userInfo.gitee = ret.gitee_name;
            userInfo.level = ret.level;
            userInfo.nickName = ret.nickname;
            userInfo.avatarUrl = ret.avatar;
            userInfo.eventLevel = ret.activity_level;
            await setStorageSync(constants.APP_USERINFO_SESSION, userInfo);
          }
          callback && callback();
        },
      });
    } else {
      callback && callback();
    }
  },
  /**
   * 兼容登录方法
   * @param {Object} callback
   * @param {Object} userInfo
   */
  wxGetUserProfileLogin(isAgree, callback) {
    wx.showToast({
      title: '登录中',
      icon: 'loading',
      mask: true,
    });
    wx.login({
      success: function (data) {
        appAjax.postJson({
          headers: {
            Authorization: '',
          },
          service: 'LOGIN',
          data: {
            agree: isAgree,
            code: data.code,
          },
          success: async function (result) {
            let userInfo = {};
            userInfo.agreePrivacy = result.agree_privacy_policy;
            userInfo.access = result.access;
            userInfo.level = result.level;
            userInfo.eventLevel = result.activity_level;
            userInfo.gitee = result.gitee_name;
            userInfo.userId = result.user_id;
            userInfo.nickName = result.nickname;
            userInfo.avatarUrl = result.avatar;
            userInfo.refresh = result.refresh;
            // // 缓存用户信息
            await appUser.saveLoginInfo(userInfo || {});
            // 回调
            callback && callback(userInfo || {});
          },
        });
      },
      complete() {
        wx.hideToast();
      },
    });
  },
};

module.exports = appUser;
