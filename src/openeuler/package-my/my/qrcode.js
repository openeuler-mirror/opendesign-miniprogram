// package-my/my/qrcode.js
const resourceUrl = 'https://openeuler-website.obs.ap-southeast-1.myhuaweicloud.com/qrcode/';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
        type: 0,
        data: [
            {
                avatar: resourceUrl + '编组.png',
                name: 'openEuler',
                qrcode: resourceUrl + 'openeuler公众号.png'
            },
            {
                avatar: resourceUrl + 'Bilibili-B站.png',
                name: 'bilibili',
                qrcode: resourceUrl + 'openeuler哩哩哔哔.png'
            },
            {
                avatar: resourceUrl + '今日头条.png',
                name: '今日头条',
                qrcode: resourceUrl + 'openeuler今日头条.png'
            }
        ]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
        this.setData({
            type: options.type - 1
        })
	},
    saveQrcode() {
        const that = this;
        wx.getSetting({
            success(res) {
              wx.downloadFile({
                url: that.data.data[that.data.type].qrcode,
                success: function(res) {
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function(data) {
                      wx.showToast({
                        title: "保存成功",
                        icon: "success",
                        duration: 2000
                      });
                    },
                    fail: function(err) {
                      console.log(err);
                    },
                    complete(res) {
                      console.log(res);
                    }
                  });
                }
              });
            }
          });
    }
})