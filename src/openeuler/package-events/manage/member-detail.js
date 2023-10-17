// pages/sig/member-detail.js
var appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  saveMemberGiteeName: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'PUT',
      service: 'ENTERPRISE_SAVE_MEMBER_DETAIL',
      otherParams: {
        id: postData.id,
      },
      data: {
        gitee_name: postData.name,
        enterprise: postData.enterprise,
        telephone: postData.telephone,
        email: postData.email,
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
    avatar: '',
    nickname: '',
    name: '',
    enterprise: '',
    telephone: '',
    email: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      avatar: options.avatar,
      nickname: options.nickname,
      name: options.name,
      enterprise: options.enterprise || '',
      telephone: options.telephone || '',
      email: options.email || '',
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  confirm: function () {
    let that = this;
    if (!that.data.name) {
      wx.showToast({
        title: '请输入ID',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!that.data.enterprise) {
      wx.showToast({
        title: '请输入企业名称',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    remoteMethods.saveMemberGiteeName(
      {
        id: that.data.id,
        name: that.data.name,
        enterprise: that.data.enterprise,
        telephone: that.data.telephone,
        email: that.data.email,
      },
      function (data) {
        if (data.code == 400) {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000,
          });
          return;
        }
        if (data.gitee_name) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000,
          });
          wx.navigateBack();
        }
      }
    );
  },
  onInput: function (e) {
    this.setData({
      name: e.detail.value,
    });
  },
  enterpriseOnInput(e) {
    this.setData({
      enterprise: e.detail.value,
    });
  },
  telephoneOnInput(e) {
    this.setData({
      telephone: e.detail.value,
    });
  },
  emailOnInput(e) {
    this.setData({
      email: e.detail.value,
    });
  },
  reset: function () {
    this.setData({
      name: '',
      enterprise: '',
    });
  },
});
