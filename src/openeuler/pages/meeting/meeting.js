// pages/meeting/meeting.js
const mixin = require('../../utils/page-mixin.js').$pageMixin;
const sessionUtil = require('../../utils/app-session.js');
const appUser = require('../../utils/app-user.js');
let that = null;

Page(
  mixin({
    /**
     * 页面的初始数据
     */
    data: {
      noAuthDialogShow: false,
      level: 1,
      iphoneX: false,
      meetingConponent: null,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
      this.setData({
        iphoneX: this.getTabBar().data.iPhoneX,
        meetingConponent: this.selectComponent('#meeting'),
      });
      let that = this;

      appUser.updateUserInfo(function () {
        that.setData({
          level: sessionUtil.getUserInfoByKey('level'),
        });
      });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      that = this;
      this.getTabBar().setData({
        _tabbat: 1,
      });
    },
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
      appUser.updateUserInfo(() => {
        this.setData({
          level: sessionUtil.getUserInfoByKey('level') || 1,
        });
      });
      this.data.meetingConponent?.initData();
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
    navigateTo(e) {
      const url = e.currentTarget.dataset.url;
      if (url.includes('reserve') && !sessionUtil.getUserInfoByKey('access')) {
        wx.navigateTo({
          url: '/pages/auth/auth',
        });
        return;
      }
      if (this.data.level === 1 && url.includes('reserve')) {
        this.setData({
          noAuthDialogShow: true,
        });
        return;
      }
      wx.navigateTo({
        url,
      });
    },
    copyWechat() {
      wx.setClipboardData({
        data: 'openeuler123',
        success: () => {
          this.setData({
            noAuthDialogShow: false,
          });
        },
      });
    },
  })
);
