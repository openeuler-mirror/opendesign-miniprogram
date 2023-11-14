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
        page: postData.page,
        size: postData.size,
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
    remoteMethods.getExcludeMemberList(
      {
        ...this.data.pageParams,
        nickname: this.data.keyword,
      },
      (data) => {
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
      }
    );
  },
  onReachBottom() {
    if (this.data.total < this.data.pageParams.size * this.data.pageParams.page) {
      return false;
    }
    this.setData({
      'pageParams.page': this.data.pageParams.page + 1,
    });
    this.initData();
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
      if (data.code === 200) {
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
    this.setData({
      keyword: e.detail.value,
    });
    this.initData();
  },
});
