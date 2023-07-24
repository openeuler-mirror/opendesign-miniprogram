// pages/auth/auth.js
const mixin = require('../../utils/page-mixin.js').$pageMixin;
const appUser = require('../../utils/app-user.js');
let that = null;
Page(
  mixin({
    /**
     * 页面的初始数据
     */
    data: {
      id: '',
      record: false,
      canIUseGetUserProfile: false,
    },
    onLoad(options) {
      that = this;
      if (options.id) {
        this.setData({
          id: options.id,
        });
      }

      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true,
        });
      }
    },
    onShow() {},
    /**
     * 绑定获取用户信息
     */
    bindGetUserInfo: function () {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            appUser.wxLogin(function () {
              const pages = getCurrentPages(); // 当前页面
              const beforePage =
                pages[pages.length - 2].route === 'pages/auth/auth' ? pages[pages.length - 3] : pages[pages.length - 2]; // 前一个页面
              const id = beforePage.options.id || that.data.id;
              const url = id ? '/' + beforePage.route + '?id=' + id : '/' + beforePage.route;
              wx.reLaunch({
                url: url,
              });
            });
          }
        },
      });
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
      wx.getUserProfile({
        desc: '用于会议和活动所需信息',
        success: (res) => {
          appUser.wxGetUserProfileLogin(function () {
            const pages = getCurrentPages(); // 当前页面
            const beforePage =
              pages[pages.length - 2].route === 'pages/auth/auth' ? pages[pages.length - 3] : pages[pages.length - 2]; // 前一个页面
            const id = beforePage.options.id || that.data.id;
            const url = id ? '/' + beforePage.route + '?id=' + id : '/' + beforePage.route;
            wx.reLaunch({
              url: url,
            });
          }, res.userInfo);
        },
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
  })
);
