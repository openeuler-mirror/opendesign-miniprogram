// pages/my/my-meetings.js

Page({
  /**
   * 页面的初始数据
   */
  data: {},
  onReachBottom() {
    const customComponent = this.selectComponent('#meeting');
    customComponent.getMoreData();
  },
});
