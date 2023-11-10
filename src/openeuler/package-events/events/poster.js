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
        this.setData({
          info: res,
        });
      });
    } else {
      this.setData({
        info: {
          title: options.title,
          date: options.date,
          detail_address: options.address || '',
          poster: options.poster,
          join_url: options.liveAddress || '',
          activity_type: options.address ? 1 : 2,
        },
        isDraft: 1,
      });
    }
  },
  onShow() {
    wx.showToast({
      title: '如有需要请截图保存海报~',
      icon: 'none',
      duration: 4000,
    });
  },
  back() {
    wx.navigateBack();
  },
});
