// package-meeting/meeting/meeting-list.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    meetingConponent: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      meetingConponent: this.selectComponent('#meeting'),
    });
  },
  onReachBottom() {
    const customComponent = this.selectComponent('#meeting');
    customComponent.getMoreData();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.data.meetingConponent?.initData();
  },
});
