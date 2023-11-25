// pages/sig/add-sig-member.js
const appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getSigMemberList: function (params, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'SIG_MEMBER_LIST',
      otherParams: {
        id: params.id,
      },
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
    id: '',
    pageParams: {
      page: 1,
      size: 50,
    },
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name,
    });
    this.setData({
      id: options.id,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData();
  },
  initData: function () {
    let renderData = [];
    remoteMethods.getSigMemberList({ ...this.data.pageParams, id: this.data.id }, (data) => {
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
        '/package-meeting/sig/member-detail?id=' +
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
      url: '/package-meeting/sig/add-member?sigId=' + this.data.id,
    });
  },
  delMember: function () {
    wx.navigateTo({
      url: '/package-meeting/sig/del-member?sigId=' + this.data.id,
    });
  },
});
