// package-my/my/qrcode.js
const resourceUrl = 'https://mindspore-website.obs.cn-north-4.myhuaweicloud.com:443/mindsporeMini/';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        type: 0,
        data: [{
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
                            fail: function (err) {
                                console.log(err);
                            },
                            complete(res) {
                                console.log(res);
                            },
                        });
                    },
                    failL: function (err) {
                        console.log(err);
                    }
                });
            },
        });
    },
});