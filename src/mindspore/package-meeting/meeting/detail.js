// pages/meeting/detail.js
const { rest } = require('../../utils/underscore');
var appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');
let remoteMethods = {
  getMeetingDetail: function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GET_MEETING_DETAIL',
      otherParams: {
        id: id,
      },
      // headers: {
      //   Authorization: '',
      // },
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
    collection_id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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
  onShow: function () {
    let that = this;
    remoteMethods.getMeetingDetail(this.data.id, function (data) {
      if (data) {
        that.setData({
          info: data,
          collection_id:data.collection_id||null
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
  collect: function () {
    let that=this
    if (!sessionUtil.getUserInfoByKey('access')) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    if (this.data.collection_id!=null) {
      remoteMethods.uncollect(this.data.collection_id, function (res) {
       that.setData({
        collection_id:null
       })       
      });
    } else {
      wx.requestSubscribeMessage({
        tmplIds: ['tK51rqE72oFo5e5ajCnvkPwnsCncfydgcV1jb9ed6Qc', 'kKkokqmaH62qp_txDQrNnyoRbM5wCptTAymhmsfHT7c'],
        complete() {
          remoteMethods.collect(that.data.id, function (res) {
            if (res.code == 201) {
              that.setData({
                collection_id:res.collection_id||''
               })  
            }
          });
        },
      });
    }
  },
});
