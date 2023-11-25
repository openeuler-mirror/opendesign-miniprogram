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
  data: {
    list: [],
    pageParams: {
      page: 1,
      size: 50,
    },
    total: 0,
  },
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
  toDetail: function (e) {
    wx.navigateTo({
      url:
        '/package-events/manage/member-detail?id=' +
        e.currentTarget.dataset.id +
        '&avatar=' +
        e.currentTarget.dataset.avatar +
        '&name=' +
        e.currentTarget.dataset.name +
        '&nickname=' +
        e.currentTarget.dataset.nickname,
    });
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
