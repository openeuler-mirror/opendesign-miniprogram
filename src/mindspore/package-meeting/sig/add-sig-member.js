// pages/sig/add-sig-member.js
const appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getSigMemberList: function (params, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GROUP_MEMBER_LIST',
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
  getMsgMemberList: function (params, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GROUP_CITY_MEMBER_LIST',
      data: {
        city: params.id,
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
    groupTitle: '',
    options: '',
    pageParams: {
      page: 1,
      size: 10,
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
      groupTitle: options.name,
      options: options,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getListData();
  },
  getListData() {
    if (this.options.type !== 'MSG') {
      this.initData.call(this, remoteMethods.getSigMemberList);
    } else {
      this.initData.call(this, remoteMethods.getMsgMemberList);
    }
  },
  initData: function (remoteMethod) {
    remoteMethod(
      {
        ...this.data.pageParams,
        id: this.data.id,
      },
      (data) => {
        let renderData;
        if (this.data.pageParams.page === 1) {
          renderData = data.data;
        } else {
          renderData = [...this.data.list, ...data.data];
        }
        this.setData({
          list: renderData,
          total: data.total,
        });
      }
    );
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
        e.currentTarget.dataset.nickname +
        '&grouptitle=' +
        this.data.groupTitle,
    });
  },
  onReachBottom() {
    if (this.data.total <= this.data.pageParams.size * this.data.pageParams.page) {
      return false;
    }
    this.setData({
      'pageParams.page': this.data.pageParams.page + 1,
    });
    this.getListData();
  },
  addMember: function () {
    const { type } = this.data.options;
    wx.navigateTo({
      url:
        '/package-meeting/sig/add-member?group_id=' +
        this.data.id +
        '&grouptitle=' +
        this.data.groupTitle +
        '&type=' +
        type,
    });
  },
  delMember: function () {
    const { type } = this.data.options;
    wx.navigateTo({
      url:
        '/package-meeting/sig/del-member?group_id=' +
        this.data.id +
        '&grouptitle=' +
        this.data.groupTitle +
        '&type=' +
        type,
    });
  },
});
