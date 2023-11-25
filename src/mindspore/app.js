App({
  onLaunch: function () {
    let self = this;
    wx.getSystemInfo({
      success(res) {
        if (res.model.indexOf('iPhone X') >= 0) {
          self.globalData.iPhoneX = true;
        }
      },
    });
  },
  loginCallback: null,
  globalData: {
    iphoneX: false,
  },
});
