const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('./../../utils/app-session.js');
const remoteMethods = {
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
    iphoneX: false,
    avatarUrl: '',
    nickName: '',
    isPrivecyDiaShown: false,
    isLogoffDiaShown: false,
    content: '',
    deleteText: '',
    gitee: ''
  },
  onLoad: function () {
    this.setData({
      avatarUrl: sessionUtil.getUserInfoByKey('avatarUrl'),
      nickName: sessionUtil.getUserInfoByKey('nickName'),
      gitee: sessionUtil.getUserInfoByKey('gitee'),
    });
  },
  shownDialog: function (e) {
    const operate = e.currentTarget.dataset.operate;
    let setDataObject = {};
    setDataObject[operate] = true;
    this.setData(setDataObject);
  },
  confirmRevoke: function () {
    remoteMethods.handleRevoke(() => {
      this.handleLogout();
    });
  },
  confirmLogoff: function () {
    if (this.data.deleteText !== 'delete') {
      wx.showToast({
        title: '请按提示正确输入',
        icon: 'none',
        duration: 2000,
      });
      return false;
    }
    remoteMethods.handleLogoff(() => {
      this.handleLogout();
    });
  },
  confirmLogout: function () {
    remoteMethods.handleLogout(() => {
      this.handleLogout();
    });
  },
  handleLogout: function () {
    wx.removeStorageSync('_app_userinfo_session');
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  logoffInput: function (e) {
    this.setData({
      deleteText: e.detail.value,
    });
  },
  cancel: function () {
    this.setData({
      isLogoffDiaShown: false,
      isPrivecyDiaShown: false,
    });
  },
});