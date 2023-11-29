Page({
  data: {},
  navigateTo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
    return;
  },
});
