//app.js
App({
  onLaunch: function (options) {
    var self = this;
    wx.getSystemInfo({
      success(res) {
        if (res.model.indexOf('iPhone X') >= 0) {
          self.globalData.iPhoneX = true;
        }
      },
    });
    console.log("options:",options)
    if(options.scene == 1011&&options.query.id){
      //这里写入相关业务代码
      wx.navigateTo({
        url:`/package-events/events/sign-success?id=${options.query.id}`
      });
    }
  },
  onShow() {},
  loginCallback: null,
  globalData: {
    iphoneX: false,
  },
});
