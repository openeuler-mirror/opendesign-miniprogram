// pages/sig/del-member.js
const appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getCludeMemberList: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GROUP_MEMBER_LIST',
      data: {
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
  getCityCludeMemberList: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GROUP_CITY_MEMBER_LIST',
      data: {
        city: postData.id,
        page: postData.page,
        size: postData.size,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  delMemberList: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'DEL_MEMBER_LIST',
      data: postData,
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  delCityMemberList: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'DEL_CITY_MEMBER_LIST',
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
    isShowMes: false,
    group_id: '',
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
      this.initData.call(this, remoteMethods.getCludeMemberList);
    } else {
      this.initData.call(this, remoteMethods.getCityCludeMemberList);
    }
  },
  initData: function (remoteMethod) {
    remoteMethod(
      {
        ...this.data.pageParams,
        id: this.data.group_id,
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
  onChange: function (e) {
    this.setData({
      result: e.detail,
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
  del: function () {
    let that = this;
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
    if (type != 'MSG') {
      remoteMethods.delMemberList(postData, function (data) {
        if (data.code === 200) {
          that.setData({
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
      remoteMethods.delCityMemberList(postData, function (data) {
        if (data.code === 200) {
          that.setData({
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
});
