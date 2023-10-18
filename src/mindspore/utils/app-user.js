let constants = require('../config/constants');
let appAjax = require('./app-ajax.js');
let app = getApp();

let privateMethods = {
  /**
   * 登录
   * @param {Object} callback
   */
  _login: function (callback) {
    wx.showToast({
      title: '登录中',
      icon: 'loading',
      mask: true,
    });

    wx.login({
      success: function (data) {
        wx.getUserInfo({
          success: function (res) {
            // 登录
            appAjax.postJson({
              headers: {
                Authorization: '',
              },
              service: 'LOGIN',
              data: {
                userInfo: res.userInfo,
                code: data.code,
              },
              success: function (result) {
                res.userInfo.agreePrivacy = result.agree_privacy_policy;
                res.userInfo.access = result.access;
                res.userInfo.level = result.level;
                res.userInfo.eventLevel = result.activity_level;
                res.userInfo.gitee = result.gitee_name;
                res.userInfo.userId = result.user_id;
                // // 缓存用户信息
                appUser.saveLoginInfo(res.userInfo || {});

                // 			// 回调
                callback && callback(res.userInfo || {});
              },
            });
          },
          fail: function () {
            wx.hideToast();
          },
        });
      },
    });
  },
};

let appUser = {
  /**
   * 登录
   * @param {Object} successCallback
   * @param {Object} failCallback
   */
  login: function (callback) {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          privateMethods._login(callback);
        } else {
          app.loginCallback = function () {
            privateMethods._login(callback);
          };
          wx.navigateTo({
            url: '/pages/auth/auth',
          });
        }
      },
    });
  },

  /**
   * 获取微信地址
   * @param {Object} callback 回调
   */

  /**
   * 微信登录
   * @param {Object} callback
   * @param {Object} failCallback
   */
  wxLogin: function (callback, failCallback) {
    appUser.login(function (result) {
      callback && callback(result || {});
    }, failCallback);
  },

  /**
   * 保存用户信息
   * @param {Object} result
   */
  saveLoginInfo: function (result) {
    wx.setStorageSync(constants.APP_USERINFO_SESSION, result);
  },

  updateUserInfo: function (callback) {
    let userInfo = wx.getStorageSync(constants.APP_USERINFO_SESSION);
    if (userInfo && userInfo.userId) {
      appAjax.postJson({
        type: 'GET',
        service: 'GET_USER_STATUS',
        otherParams: {
          id: userInfo.userId,
        },
        success: function (ret) {
          if (ret) {
            userInfo.gitee = ret.gitee_name;
            userInfo.level = ret.level;
            wx.setStorageSync(constants.APP_USERINFO_SESSION, userInfo);
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
  wxGetUserProfileLogin(callback, userInfo) {
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
            userInfo: userInfo,
            code: data.code,
          },
          success: function (result) {
            userInfo.access = result.access;
            userInfo.level = result.level;
            userInfo.eventLevel = result.activity_level;
            userInfo.gitee = result.gitee_name;
            userInfo.userId = result.user_id;
            userInfo.agreePrivacy = result.agree_privacy_policy;
            // // 缓存用户信息
            appUser.saveLoginInfo(userInfo || {});

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
