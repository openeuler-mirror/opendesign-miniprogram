// pages/my/help.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        name: '会议攻略',
        contentImg: [],
      },
      {
        name: '活动攻略',
        contentImg: [],
      },
    ],
    curIndex: 0,
  },
  switchTab(e) {
    this.setData({
      curIndex: e.currentTarget.dataset.index,
    });
  },
});
