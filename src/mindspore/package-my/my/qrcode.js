const { OBS_URL } = require('./../../utils/url-config');
const resourceUrl = `${OBS_URL}/mindsporeMini/`;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    data: [
      {
        avatar: resourceUrl + 'official-acc.png',
      },
      {
        avatar: resourceUrl + 'live-b.png',
      },
      {
        avatar: resourceUrl + 'headline.png',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type - 1,
    });
  },
  saveQrcode() {
    const that = this;
    wx.getSetting({
      success() {
        wx.downloadFile({
          url: that.data.data[that.data.type].avatar,
          success: function (res) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function () {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000,
                });
              },
              fail: function () {
                wx.showModal({
                  title: '保存失败~',
                  content: '请尝试点击右上角 “...” => “设置” 同意添加到相册后再保存~',
                });
              },
            });
          },
        });
      },
    });
  },
});
