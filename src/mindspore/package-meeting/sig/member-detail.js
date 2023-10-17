// pages/sig/member-detail.js
const appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  saveMemberGiteeName: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'PUT',
      service: 'SAVE_MEMBER_DETAIL',
      otherParams: {
        id: postData.id,
      },
      data: {
        gitee_name: postData.gitee_name,
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
    gitee_name: '',
    name: '',
    nickname: '',
    btnText: '',
    isShowMes: false,
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
      gitee_name: options.name,
      btnText: '返回' + options.grouptitle,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
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
      function () {
        that.setData({
          isShowMes: true,
        });
      }
    );
  },
  onInput: function (e) {
    if (e.target.dataset.index === 'id') {
      this.setData({
        gitee_name: e.detail.value,
      });
    } else {
      return false;
    }
  },
  reset: function () {
    this.setData({
      name: '',
    });
  },
});
