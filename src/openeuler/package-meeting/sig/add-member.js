// pages/sig/add-member.js
const appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getExcludeMemberList: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'SIG_EXCLUDE_MEMBER_LIST',
      otherParams: {
        id: postData.id,
      },
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
      service: 'ADD_MEMBER_LIST',
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
    sigId: '',
    pageParams: {
      page: 1,
      size: 50,
    },
    total: 0,
    keyword: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sigId: options.sigId,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData();
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
  initData: function () {
    let renderData = [];
    remoteMethods.getExcludeMemberList(
      {
        ...this.data.pageParams,
        id: this.data.sigId,
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
      group_id: this.data.sigId,
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
    this.setData({
      keyword: e.detail.value,
    });
    this.initData();
  },
});
