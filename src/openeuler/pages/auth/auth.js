// pages/auth/auth.js
const mixin = require('../../utils/page-mixin.js').$pageMixin;
const appUser = require('../../utils/app-user.js');
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');
const { getStorageSync, setStorageSync } = require('../../utils/utils');

let that = null;
Page(
  mixin({
    /**
     * 页面的初始数据
     */
    data: {
      url: '',
      id: '',
      record: false,
      isPrivecyShown: false,
    },
    onLoad(options) {
      that = this;
      if (options.id) {
        this.setData({
          id: options.id,
        });
      }
    },
    bindGetUserProfile() {
      if (!this.data.record) {
        wx.showToast(
          {
            title: '请先阅读并同意隐私声明',
            icon: 'none',
            duration: 2000,
          },
          100
        );
        return false;
      }
      appUser.wxGetUserProfileLogin(this.data.record, async function (res) {
        if (!res.access) {
          return false;
        }
        const pages = getCurrentPages(); // 当前页面
        const beforePage =
          pages[pages.length - 2]?.route === 'pages/auth/auth' ? pages[pages.length - 3] : pages[pages.length - 2]; // 前一个页面
        const id = beforePage?.options.id || that.data.id;
        const url = id ? '/' + beforePage?.route + '?id=' + id : '/' + beforePage?.route;
        if (!(await sessionUtil.getUserInfoByKey('agreePrivacy'))) {
          that.setData({
            isPrivecyShown: true,
            url: url,
          });
        } else {
          wx.reLaunch({
            url: url,
          });
        }
      });
    },
    recordoOnChange: function (event) {
      this.setData({
        record: event.detail,
      });
    },
    toPrivacy() {
      wx.navigateTo({
        url: '/package-my/my/privecy',
      });
    },
    handleDotAgree: function () {
      appAjax.postJson({
        type: 'POST',
        service: 'LOGOUT',
        success: (res) => {
          if (res.code === 200) {
            sessionUtil.clearUserInfo();
            this.setData({
              isPrivecyShown: false,
            });
            wx.switchTab({
              url: '/pages/index/index',
            });
          }
        },
      });
    },
    setAgreeState: function (_callback) {
      appAjax.postJson({
        type: 'PUT',
        service: 'AGREE',
        success: function (ret) {
          _callback && _callback(ret);
        },
        fail: function () {
          this.setData({
            isPrivecyShown: false,
          });
        },
      });
    },
    setStorage: async function () {
      try {
        let data = await getStorageSync('_app_userinfo_session');
        data.agreePrivacy = true;
        await setStorageSync('_app_userinfo_session', data);
      } catch (error) {
        wx.removeStorageSync('_app_userinfo_session');
      }
    },
    handleClick: function () {
      this.setAgreeState((res) => {
        if (res.code === 200) {
          this.setStorage();
        } else {
          wx.removeStorageSync('_app_userinfo_session');
        }
        this.setData({
          isPrivecyShown: false,
        });
        wx.reLaunch({
          url: this.data.url || '/pages/index/index',
        });
      });
    },
  })
);
