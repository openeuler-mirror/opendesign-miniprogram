// pages/sig/add-member.js
var appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getExcludeMemberList: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GROUP_EXCLUDE_MEMBER_LIST',
      data: {
        group: postData.id,
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
    group_id: '',
    keyword: '',
    isShowMes: false,
    btnText: '',
    group_name: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      group_id: options.group_id,
      btnText: '返回' + options.grouptitle,
    });
    if (options.grouptitle.includes('MSG')) {
      this.setData({
        group_name: 'MSG',
      });
    } else if (options.grouptitle.includes('专家')) {
      this.setData({
        group_name: 'Tech',
      });
    } else {
      this.setData({
        group_name: options.grouptitle,
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    remoteMethods.getExcludeMemberList(
      {
        id: that.data.group_name,
      },
      function (data) {
        that.setData({
          list: data,
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
    remoteMethods.addMemberList(postData, function (data) {
      if (data.code === 201) {
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
  },
  searchInput: function (e) {
    let that = this;
    this.setData({
      keyword: e.detail.value,
    });
    remoteMethods.getExcludeMemberList(
      {
        id: this.data.group_name,
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
