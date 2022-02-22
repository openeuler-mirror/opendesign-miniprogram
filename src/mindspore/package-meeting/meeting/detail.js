// pages/meeting/detail.js
var appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getMeetingDetail: function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GET_MEETING_DETAIL',
      otherParams: {
        id: id,
      },
      headers: {
        Authorization: '',
      },
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
    id: '',
    info: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    });
  },
  copy: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.copy,
      success: function () {},
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    remoteMethods.getMeetingDetail(this.data.id, function (data) {
      if (data) {
        that.setData({
          info: data,
        });
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: '会议详情',
      path: `/package-meeting/meeting/detail?id=${this.data.id}`,
    };
  },
});
