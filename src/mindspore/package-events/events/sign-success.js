// package-events/events/sign-success.js
const appAjax = require('./../../utils/app-ajax');

let that = null;
let remoteMethods = {
    sign: function (_callback) {
        let service = 'SIGN';
        appAjax.postJson({
            autoShowWait: true,
            type: 'POST',
            service,
            data: {
                activity: that.data.id
            },
            success: function (ret) {
                _callback && _callback(ret);
            }
        });
    }
}
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
        status: 0,
        id: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
        that = this;
        this.setData({
            id: options.id || decodeURIComponent(options.scene)
        })
        remoteMethods.sign((res) => {
            if(res.code === 400) {
                this.setData({
                    status: 1
                })
            }

            if(res.code === 201) {
                this.setData({
                    status: 2
                })
            }
        })
    },
    back() {
        wx.switchTab({
            url: '/pages/events/events'
        })
    },
    toSignUp() {
        wx.redirectTo({
            url: `/package-events/sign-up/sign-up?isScan=1&id=${this.data.id}`
        })
    }
})