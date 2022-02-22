// package-events/sign-up/sign-up-success.js
const { wxml, style } = require('./wxml-to-canvas.js');
let that = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    poster: 1,
    title: '',
    name: '',
    tel: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.widget = this.selectComponent('.widget');
    this.setData({
      poster: decodeURIComponent(options.poster),
      title: decodeURIComponent(options.title),
      name: decodeURIComponent(options.name),
      tel: decodeURIComponent(options.tel),
    });
  },
  saveToAlbum() {
    wx.showLoading({
      title: '保存中',
      mask: true,
    });
    const p1 = this.widget.renderToCanvas({
      wxml: wxml({
        title: that.data.title,
        name: that.data.name,
        tel: that.data.tel,
        poster: that.data.poster,
      }),
      style: style(),
    });
    p1.then(() => {
      const p2 = this.widget.canvasToTempFilePath();
      p2.then((res) => {
        wx.getSetting({
          success() {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function () {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000,
                });
              },
              fail: function (err) {
                console.log(err);
              },
              complete(res) {
                wx.hideLoading();
                console.log(res);
              },
            });
          },
        });
      });
    });
  },
});
