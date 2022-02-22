// package-my/events/send-email.js
const appAjax = require('./../../utils/app-ajax');
const validationConfig = require('./../../config/field-validate-rules');

let that = null;

let remoteMethods = {
  sendEmail: function (_callback) {
    if (!validationConfig.email.regex.test(that.data.emailAddress)) {
      wx.showToast({
        title: '请输入正确的邮箱地址',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'SEND_SIGNUP_INFO',
      data: {
        activity: that.data.id,
        mailto: that.data.emailAddress,
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
    emailAddress: '',
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      id: options.id,
    });
  },
  onInput: function (e) {
    this.setData({
      emailAddress: e.detail.value,
    });
  },
  confirm() {
    remoteMethods.sendEmail(() => {
      wx.showToast({
        title: '发送成功',
        icon: 'success',
        duration: 2000,
        mask: true,
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    });
  },
});
