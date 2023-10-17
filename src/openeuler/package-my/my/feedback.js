// package-my/my/feedback.js
Page({
  /**
   * 页面的初始数据
   */
  copyEmail: function () {
    let that = this;
    wx.setClipboardData({
      data: 'contact@openeuler.io',
      success: function () {
        that.setData({
          showDialog: false,
        });
      },
    });
  },
});
