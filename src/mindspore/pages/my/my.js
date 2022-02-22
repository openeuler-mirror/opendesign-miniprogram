// pages/my/my.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');

let remoteMethods = {
  getMyMeeting: function (_callback) {
    appAjax.postJson({
      type: 'GET',
      service: 'GET_MY_MEETING',
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  getMyCollect: function (_callback) {
    appAjax.postJson({
      type: 'GET',
      service: 'GET_MY_COLLECT',
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
    meetingCount: 0,
    collectCount: 0,
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
      avtivityLevel: sessionUtil.getUserInfoByKey('eventLevel'),
    });
    remoteMethods.getMyMeeting((res) => {
      this.setData({
        meetingCount: res.length,
      });
    });
    remoteMethods.getMyCollect((res) => {
      this.setData({
        collectCount: res.length,
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
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    remoteMethods.getMyMeeting((res) => {
      this.setData({
        meetingCount: res.length,
      });
    });
    remoteMethods.getMyCollect((res) => {
      this.setData({
        collectCount: res.length,
      });
    });
  },
});
