// pages/my/help.js
const { OBS_URL } = require('./../../utils/url-config');
const resourceUrl = `${OBS_URL}/help`;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        name: '会议攻略',
        contentImg: [resourceUrl + '/11.png', resourceUrl + '/12.png', resourceUrl + '/13.png'],
      },
      {
        name: '活动攻略',
        contentImg: [resourceUrl + '/21.png', resourceUrl + '/22.png', resourceUrl + '/23.png'],
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
