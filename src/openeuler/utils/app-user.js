const appAjax = require('./app-ajax.js');
const appSession = require('./app-session.js');
const constants = require('../config/constants');
const app = getApp();

const privateMethods = {
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
        appAjax.postJson({
          headers: {
            Authorization: '',
          },
          service: 'LOGIN',
          data: {
            code: data.code,
          },
          success: function (result) {
            let userInfo = {};
            userInfo.agreePrivacy = result.agree_privacy_policy;
            userInfo.access = result.access;
            userInfo.level = result.level;
            userInfo.nickName = result.nickname;
            userInfo.avatarUrl = result.avatar;
            userInfo.eventLevel = result.activity_level;
            userInfo.gitee = result.gitee_name;
            userInfo.userId = result.user_id;
            userInfo.refresh = result.refresh;
            // 缓存用户信息
            appUser.saveLoginInfo(userInfo || {});
            // 回调
            callback && callback(userInfo || {});
          },
          complete() {
            wx.hideToast();
          },
        });
      },
    });
  },
};

const appUser = {
  /**
   * 需要登录的跳转
   * page为空不能传null 要 ""
   */
  loginRedirect: function (page, callback) {
    // 是否有登录
    if (!appSession.loginCheck()) {
      appUser.login(function (result) {
        if (result && !result.phone) {
          wx.navigateTo({
            url: '../register/bind-phone?page=' + page,
          });
        } else {
          wx.navigateTo({
            url: page,
          });
        }

        // 支持回调
        callback && callback();
      });
    } else {
      wx.navigateTo({
        url: page,
      });
    }
  },

  /**
   * 需要登录的操作
   * @param page  操作页 page为空不能传null 要 ""
   * @param callback
   */
  loginHandle: function (page, callback) {
    // 是否有登录
    if (!appSession.loginCheck()) {
      appUser.login(function (result) {
        if (result && !result.phone) {
          wx.navigateTo({
            url: '../register/bind-phone?page=' + page,
          });
        } else {
          callback && callback();
        }
      });
    } else {
      callback && callback();
    }
  },

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
            // 更新userInfo数据
            userInfo = wx.getStorageSync(constants.APP_USERINFO_SESSION);
            userInfo.gitee = ret.gitee_name;
            userInfo.level = ret.level;
            userInfo.nickName = ret.nickname;
            userInfo.avatarUrl = ret.avatar;
            userInfo.eventLevel = ret.activity_level;
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
            code: data.code,
          },
          success: function (result) {
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
