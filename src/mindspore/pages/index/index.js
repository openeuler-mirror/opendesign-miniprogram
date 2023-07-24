//index.js
const mixin = require('../../utils/page-mixin.js').$pageMixin;
const sessionUtil = require('../../utils/app-session.js');
const appUser = require('../../utils/app-user.js');
let that = null;
Page(
  mixin({
    data: {
      imgUrls: [
        {
          url: '/static/index/banner-1.png',
        },
      ],
      isPrivecyShown:false,
      iphoneX: false,
      meetingConponent: null,
      autoplay: true,
    },
    swithTab(e) {
      wx.switchTab({
        url: e.currentTarget.dataset.url,
      });
    },
    previewImage(e) {
      const current = e.target.dataset.src; //获取当前点击的 图片 url
      wx.previewImage({
        current,
        urls: [current],
      });
    },
    onLoad: function () {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline'],
      });
      that = this;
      appUser.updateUserInfo(function () {
        that.setData({
          meetingConponent: that.selectComponent('.meeting1'),
          iphoneX: that.getTabBar().data.iPhoneX,
        });
      });

    },
    onShow: function () {
      this.getTabBar().setData({
        _tabbat: 0,
      });
      if (!wx.getStorageSync('privecy')) {
        this.setData({
          isPrivecyShown: true,
        });
      } 
    },
    handleClick:function () {
      wx.setStorageSync('privecy', true);
      this.setData({
        isPrivecyShown: false,
      });
    },
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
      appUser.updateUserInfo(function () {
        that.data.meetingConponent.initData();
      });
    },
    actionStatus(e) {
      if (e.detail === 1) {
        this.getTabBar().setData({
          show: false,
        });
      } else {
        this.getTabBar().setData({
          show: true,
        });
      }
    },
    checkLogin() {
      if (!sessionUtil.getUserInfoByKey('access')) {
        wx.navigateTo({
          url: '/pages/auth/auth',
        });
      }
    },
    play() {
      this.setData({
        autoplay: false,
      });
    },
    pause() {
      this.setData({
        autoplay: true,
      });
    },
    ended() {
      this.setData({
        autoplay: true,
      });
    },
  })
);
