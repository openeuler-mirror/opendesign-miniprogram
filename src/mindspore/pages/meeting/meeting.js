// pages/meeting/meeting.js
const mixin = require('../../utils/page-mixin.js').$pageMixin;
const sessionUtil = require('../../utils/app-session.js');
const appUser = require('../../utils/app-user.js');

Page(
  mixin({
    /**
     * 页面的初始数据
     */
    data: {
      noAuthDialogShow: false,
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
      appUser.updateUserInfo(async () => {
        this.setData({
          level: await sessionUtil.getUserInfoByKey('level'),
        });
      });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      this.getTabBar().setData({
        _tabbat: 1,
      });
    },
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
      appUser.updateUserInfo(async () => {
        this.setData({
          level: await sessionUtil.getUserInfoByKey('level'),
        });
      });
      this.data.meetingConponent.initData();
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
    async navigateTo(e) {
      const url = e.currentTarget.dataset.url;
      if (url.includes('reserve') && !(await sessionUtil.getUserInfoByKey('access'))) {
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
        data: 'mindspore0328',
        success: () => {
          this.setData({
            noAuthDialogShow: false,
          });
        },
      });
    },
  })
);
