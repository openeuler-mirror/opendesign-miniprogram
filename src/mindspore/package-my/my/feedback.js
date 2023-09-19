// package-my/my/feedback.js
Page({

	/**
	 * 页面的初始数据
	 */
    copyEmail: function () {
        let that = this;
        wx.setClipboardData({
            data: 'contact@mindspore.cn',
            success: function (res) {
                that.setData({
                    showDialog: false
                })
            }
        })
    },
})