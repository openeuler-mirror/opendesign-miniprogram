// package-events/manage/enterprise-list.js
const appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getMemberList: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'ENTERPRISE_MEMBER_LIST',
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
    memberList: [],
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    remoteMethods.getMemberList(function (list) {
      that.setData({
        memberList: list,
      });
    });
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
        e.currentTarget.dataset.nickname +
        '&email=' +
        (e.currentTarget.dataset.email || '') +
        '&telephone=' +
        (e.currentTarget.dataset.telephone || ''),
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
