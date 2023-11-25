// pages/sig/member-detail.js
const appAjax = require('./../../utils/app-ajax');
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
        gitee_name: postData.gitee_name,
      },
      success: function (ret) {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000,
        });
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
    gitee_name: '',
    rawName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      avatar: options.avatar,
      nickname: options.nickname,
      gitee_name: options.name,
      rawName: options.name,
    });
  },
  confirm: function () {
    let that = this;
    if (!that.data.gitee_name) {
      wx.showToast({
        title: '请输入ID',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    remoteMethods.saveMemberGiteeName(
      {
        id: that.data.id,
        gitee_name: that.data.gitee_name,
      },
      function (data) {
        if (data.code === 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000,
          });
          that.setData({
            rawName: that.data.gitee_name,
          });
        }
      }
    );
  },
  onInput: function (e) {
    if (e.target.dataset.index === 'id') {
      this.setData({
        gitee_name: e.detail.value,
      });
    }
  },
  reset: function () {
    this.setData({
      gitee_name: '',
    });
  },
});
