// pages/my/my.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');

let remoteMethods = {
  getMyCount: function (_callback) {
    appAjax.postJson({
      type: 'GET',
      service: 'GET_MY_COUNT',
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iphoneX: false,
    avatarUrl: '',
    nickName: '',
    level: 1,
    avtivityLevel: 1,
    myCount: {},
    userId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      iphoneX: this.getTabBar().data.iPhoneX,
      avatarUrl: sessionUtil.getUserInfoByKey('avatarUrl'),
      nickName: sessionUtil.getUserInfoByKey('nickName'),
      level: sessionUtil.getUserInfoByKey('level'),
      userId: sessionUtil.getUserInfoByKey('userId'),
      avtivityLevel: sessionUtil.getUserInfoByKey('eventLevel'),
    });
    remoteMethods.getMyCount((res) => {
      this.setData({
        myCount: res,
      });
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({
      _tabbat: 3,
    });
  },
  go(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
  },
  copy: function (e) {
    wx.setClipboardData({
      data: `${e.currentTarget.dataset.copy}`,
    });
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    remoteMethods.getMyCount((res) => {
      this.setData({
        myCount: res,
      });
    });
  },
});
