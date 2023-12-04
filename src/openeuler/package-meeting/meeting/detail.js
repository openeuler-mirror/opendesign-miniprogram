// pages/meeting/detail.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');
const { MEETING_START_TEMPLATE, MEETING_CANCELLATION_TEMPLATE } = require('../../utils/config');

let remoteMethods = {
  getMeetingDetail: function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GET_MEETING_DETAIL',
      otherParams: {
        id: id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  collect: function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'COLLECT',
      data: {
        meeting: id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  uncollect: function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'DELETE',
      service: 'UNCOLLECT',
      otherParams: {
        id: id,
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
    info: {},
    collection_id: null,
    isLogin: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    });
  },
  getPlatform: function (target) {
    return this.data.platformList.find((item) => {
      return item.name === target;
    });
  },
  copy: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.copy,
      success: function () {},
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let that = this;
    this.setData({
      isLogin: (await sessionUtil.getUserInfoByKey('access')) ? true : false,
    });
    remoteMethods.getMeetingDetail(this.data.id, function (data) {
      if (data) {
        that.setData({
          info: data,
          collection_id: data.collection_id || null,
        });
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: '会议详情',
      path: `/package-meeting/meeting/detail?id=${this.data.id}`,
    };
  },
  collect: async function () {
    let that = this;
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    if (this.data.collection_id) {
      remoteMethods.uncollect(this.data.collection_id, function () {
        that.setData({
          collection_id: null,
        });
      });
    } else {
      wx.requestSubscribeMessage({
        tmplIds: [MEETING_START_TEMPLATE, MEETING_CANCELLATION_TEMPLATE],
        success() {
          remoteMethods.collect(that.data.id, function (res) {
            if (res.code === 200) {
              that.setData({
                collection_id: res.collection_id || '',
              });
            }
          });
        },
      });
    }
  },
});
