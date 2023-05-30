// custom-tab-bar/index.js
const sessionUtil = require('./../utils/app-session.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    show: true,
    _tabbat: 0,
    iPhoneX: null,
    urls: ['/pages/index/index', '/pages/meeting/meeting', '/pages/events/events', '/pages/my/my'],
  },
  attached() {
    let self = this;
    wx.getSystemInfo({
      success(res) {
        if (res.model.indexOf('iPhone X') >= 0 || res.model.indexOf('iPhone 11') >= 0) {
          self.setData({
            iPhoneX: true,
          });
        }
      },
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    switchTap: function (e) {
      if (!sessionUtil.getUserInfoByKey('access') && Number(e.currentTarget.dataset.index) === 3) {
        wx.navigateTo({
          url: '/pages/auth/auth',
        });
        return;
      }
      let self = this;
      let index = e.currentTarget.dataset.index;
      let urls = self.data.urls;
      wx.switchTab({
        url: urls[index],
      });
    },
  },
});
