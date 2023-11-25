// package-events/events/poster.js
const appAjax = require('./../../utils/app-ajax');

let that = null;
let remoteMethods = {
  getDraftDetail: function (_callback) {
    let service = 'EVENT_DETAIL';
    if (that.data.isDraft) {
      service = 'DRAFT_DETAIL';
    }
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service,
      otherParams: {
        id: that.data.id,
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
    isDraft: '',
    info: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      id: options.id || '',
      isDraft: options.isDraft,
    });
    if (this.data.id) {
      remoteMethods.getDraftDetail((res) => {
        res.start_date = res.start_date.replaceAll('-', '.');
        res.end_date = res.end_date.replaceAll('-', '.');
        this.setData({
          info: res,
        });
      });
    } else {
      this.setData({
        info: {
          title: options.title,
          start_date: options.starTime.replaceAll('-', '.'),
          end_date: options.endTime.replaceAll('-', '.'),
          detail_address: options.address || '',
          poster: Number(options.poster),
          live_address: options.liveAddress || '',
          activity_type: options.activity_type,
        },
        isDraft: 1,
      });
    }
  },
  back() {
    wx.navigateBack();
  },
});
