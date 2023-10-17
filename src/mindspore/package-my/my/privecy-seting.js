const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');

let that = null;
let remoteMethods = {
  handleLogout: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'LOGOUT',
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  handleLogoff: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'LOGOFF',
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  handleRevoke: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'REVOKE',
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
};
Page({
  data: {
    isPrivecyDiaShown: false,
    isLogoffDiaShown: false,
    content: '',
  },
  onShow: function () {
    that = this;
  },
  shownDialog: function (e) {
    const operate = e.currentTarget.dataset.operate;
    let setDataObject = {};
    setDataObject[operate] = true;
    this.setData(setDataObject);
  },
  confirmCancel: function () {
    remoteMethods.handleRevoke((res) => {
      console.log(res);
    });
  },
  cancel: function () {
    this.setData({
      isLogoffDiaShown: false,
      isPrivecyDiaShown: false,
      isLogoutDiaShown: false,
    });
  },
});
