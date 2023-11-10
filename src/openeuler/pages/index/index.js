//index.js
const mixin = require('../../utils/page-mixin.js').$pageMixin;
const sessionUtil = require('../../utils/app-session.js');
const appUser = require('../../utils/app-user.js');
const { OBS_BJ_URL } = require('./../../utils/url-config');

let that = null;
Page(
  mixin({
    data: {
      imgUrls: [
        {
          type: 2,
          url: `${OBS_BJ_URL}/detail-banner/mooc-banner.png`,
        },
      ],
      iphoneX: false,
      meetingConponent: null,
      autoplay: false,
    },
    handleContact(e) {
      if (!sessionUtil.getUserInfoByKey('access')) {
        wx.navigateTo({
          url: '/pages/auth/auth',
        });
        return;
      }
      wx.navigateTo({
        url: e.currentTarget.dataset.src,
      });
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
          meetingConponent: that.selectComponent('#meeting'),
          iphoneX: that.getTabBar().data.iPhoneX,
        });
      });
    },
    onShow: function () {
      this.getTabBar().setData({
        _tabbat: 0,
      });
    },
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
      appUser.updateUserInfo(function () {
        that.data.meetingConponent?.initData();
      });
    },
    onReachBottom() {
      const customComponent = this.selectComponent('#meeting');
      customComponent.getMoreData();
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
        return;
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
