// pages/meeting/meeting-success.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    });
  },
  toDetail: function () {
    wx.redirectTo({
      url: '/package-meeting/meeting/detail?id=' + this.data.id,
    });
  },
});
