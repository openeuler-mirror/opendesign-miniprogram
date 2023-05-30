// pages/sig/add-member.js
const appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getExcludeMemberList: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'ENTERPRISE_EXCLUDE_MEMBER_LIST',
      data: {
        search: postData.nickname || '',
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  addMemberList: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'ENTERPRISE_ADD_MEMBER_LIST',
      data: postData,
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
    result: [],
    keyword: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    remoteMethods.getExcludeMemberList({}, function (data) {
      that.setData({
        list: data,
      });
    });
  },
  onChange: function (e) {
    this.setData({
      result: e.detail,
    });
  },
  comfirm: function () {
    if (!this.data.result.length) {
      wx.showToast({
        title: '请选择人员',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    let postData = {
      ids: this.data.result.join('-'),
    };
    remoteMethods.addMemberList(postData, function (data) {
      if (data.code === 201) {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000,
        });
        wx.navigateBack();
      } else {
        wx.showToast({
          title: '操作失败',
          icon: 'none',
          duration: 2000,
        });
      }
    });
  },
  searchInput: function (e) {
    let that = this;
    this.setData({
      keyword: e.detail.value,
    });
    remoteMethods.getExcludeMemberList(
      {
        nickname: this.data.keyword,
      },
      function (data) {
        that.setData({
          list: data,
        });
      }
    );
  },
});
