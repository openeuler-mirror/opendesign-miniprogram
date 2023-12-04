// pages/sig/add-member.js
const appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getExcludeMemberList: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GROUP_EXCLUDE_MEMBER_LIST',
      data: {
        search: postData.nickname || '',
        page: postData.page,
        size: postData.size,
      },
      otherParams: {
        id: postData.id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  getCityExcludeMemberList: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GROUP_CITY_EXCLUDE_MEMBER_LIST',
      data: {
        city: postData.id,
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
  addCityMemberList: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'ADD_CITY_MEMBER_LIST',
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
    group_id: '',
    keyword: '',
    isShowMes: false,
    btnText: '',
    options: '',
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
    this.setData({
      group_id: options.group_id,
      btnText: '返回' + options.grouptitle,
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
      this.initData.call(this, remoteMethods.getExcludeMemberList);
    } else {
      this.initData.call(this, remoteMethods.getCityExcludeMemberList);
    }
  },
  initData: function (remoteMethod) {
    remoteMethod(
      {
        ...this.data.pageParams,
        id: this.data.group_id,
        nickname: this.data.keyword,
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
  onReachBottom() {
    if (this.data.total <= this.data.pageParams.size * this.data.pageParams.page) {
      return false;
    }
    this.setData({
      'pageParams.page': this.data.pageParams.page + 1,
    });
    this.getListData();
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
      group_id: this.data.group_id,
    };
    const { type } = this.data.options;
    if (type !== 'MSG') {
      remoteMethods.addMemberList(postData, (data) => {
        if (data.code === 200) {
          this.setData({
            isShowMes: true,
          });
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 2000,
          });
        }
      });
    } else {
      postData = {
        ids: this.data.result.join('-'),
        city_id: this.data.group_id,
      };
      remoteMethods.addCityMemberList(postData, (data) => {
        if (data.code === 200) {
          this.setData({
            isShowMes: true,
          });
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 2000,
          });
        }
      });
    }
  },
  searchInput: function (e) {
    this.setData({
      keyword: e.detail.value,
      'pageParams.page': 1,
    });
    this.getListData();
  },
});
