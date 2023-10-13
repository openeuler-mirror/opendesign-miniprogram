// package-events/events/poster.js
const appAjax = require('./../../utils/app-ajax');
const { wxml, style } = require('./wxml-to-canvas.js');

let that = null;
let remoteMethods = {
  getDraftDetail: function (_callback) {
    let service = 'EVENT_DETAIL';
    if (that.data.isDraft) {
      service = 'DRAFT_DETAIL';
    }
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service,
      otherParams: {
        id: that.data.id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    isDraft: '',
    info: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.widget = this.selectComponent('.widget');
    this.setData({
      id: options.id || '',
      isDraft: options.isDraft,
    });
    if (this.data.id) {
      remoteMethods.getDraftDetail((res) => {
        this.setData({
          info: res,
        });
      });
    } else {
      this.setData({
        info: {
          title: options.title,
          date: options.date,
          detail_address: options.address || '',
          poster: options.poster,
          join_url: options.liveAddress || '',
          activity_type: options.address ? 1 : 2,
        },
        isDraft: 1,
      });
    }
  },
  back() {
    wx.navigateBack();
  },
  saveToAlbum() {
    wx.showLoading({
      title: '保存中',
      mask: true,
    });
    const p1 = this.widget.renderToCanvas({
      wxml: wxml({
        title: that.data.info.title,
        date: that.data.info.date,
        address: that.data.info.detail_address,
        poster: that.data.info.poster,
        qrcode: that.data.info.wx_code,
        liveAddress: that.data.info.join_url,
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
                wx.showModal({
                  title: '保存失败~',
                  content: '请尝试点击右上角 “...” => “设置” 同意添加到相册后再保存~',
                });
              },
              complete(res) {
                wx.hideLoading();
              },
            });
          },
        });
      });
    });
  },
  setAndGetSysImage(data) {
    const fsm = wx.getFileSystemManager();
    const fileName = Date.now() + '.png';
    return new Promise((req, rej) => {
      const filePath = wx.env.USER_DATA_PATH + '/' + fileName;
      fsm.writeFile({
        filePath,
        data,
        encoding: 'base64',
        success: () => {
          req(filePath);
        },
        fail: (err) => {
          req(err);
        },
      });
    });
  },
});
