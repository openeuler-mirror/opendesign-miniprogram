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
    gitee: '',
  },
  onLoad: async function () {
    this.setData({
      avatarUrl: await sessionUtil.getUserInfoByKey('avatarUrl'),
      nickName: await sessionUtil.getUserInfoByKey('nickName'),
      gitee: await sessionUtil.getUserInfoByKey('gitee'),
    });
  },
  shownDialog: function (e) {
    const operate = e.currentTarget.dataset.operate;
    let setDataObject = {};
    setDataObject[operate] = true;
    this.setData(setDataObject);
  },
  confirmRevoke: function () {
    remoteMethods.handleRevoke((res) => {
      if (res.code === 200) {
        this.handleLogout();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        });
      }
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
    remoteMethods.handleLogoff((res) => {
      if (res.code === 200) {
        this.handleLogout();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        });
      }
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
