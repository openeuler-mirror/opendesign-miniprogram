// package-events/manage/enterprise-list.js
const appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getMemberList: function (params, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'ENTERPRISE_MEMBER_LIST',
      data: {
        page: params.page,
        size: params.size,
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
    list: [],
    pageParams: {
      page: 1,
      size: 50,
    },
    total: 0,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData();
  },
  initData: function () {
    let renderData = [];
    remoteMethods.getMemberList({ ...this.data.pageParams, id: this.data.id }, (data) => {
      if (this.data.pageParams.page === 1) {
        renderData = data.data;
      } else {
        renderData = this.data.list;
        renderData.push(...data.data);
      }
      this.setData({
        list: renderData,
        total: data.total,
      });
    });
  },
  onReachBottom() {
    if (this.data.total <= this.data.pageParams.size * this.data.pageParams.page) {
      return false;
    }
    this.setData({
      'pageParams.page': this.data.pageParams.page + 1,
    });
    this.initData();
  },
  addMember: function () {
    wx.navigateTo({
      url: '/package-events/manage/add-member',
    });
  },
  delMember: function () {
    wx.navigateTo({
      url: '/package-events/manage/del-member',
    });
  },
});
