//app.js
App({
  onLaunch: function (options) {
    let self = this;
    wx.getSystemInfo({
      success(res) {
        if (res.model.indexOf('iPhone X') >= 0) {
          self.globalData.iPhoneX = true;
        }
      },
    });
    if ((options.scene == 1011 && options.query.id) || (options.scene == 1011 && options.id)) {
      //这里写入相关业务代码
      wx.navigateTo({
        url: `/package-events/events/sign-success?id=${options.query.id || options.id}`,
      });
    }
  },
  onShow() {},
  loginCallback: null,
  globalData: {
    iphoneX: false,
  },
});
