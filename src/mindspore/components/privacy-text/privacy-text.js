//获取应用实例

Page({
  data: {},
  navigateTo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
    return;
  },
});
