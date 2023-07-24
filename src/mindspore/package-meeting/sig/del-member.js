// pages/sig/del-member.js
const appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getCludeMemberList: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GROUP_MEMBER_LIST',
      data: {
        group: postData.id,
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
    group_name: '',
    options: '',
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
    const { type } = this.data.options;
    if (type != 'MSG') {
      remoteMethods.getCludeMemberList(
        {
          id: this.data.group_name,
        },
        function (data) {
          that.setData({
            list: data,
          });
        }
      );
    } else {
      remoteMethods.getCityCludeMemberList(
        {
          id: this.data.group_name,
        },
        function (data) {
          that.setData({
            list: data,
          });
        }
      );
    }
  },
  onChange: function (e) {
    this.setData({
      result: e.detail,
    });
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
        if (data.code === 204) {
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
        if (data.code === 204) {
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
