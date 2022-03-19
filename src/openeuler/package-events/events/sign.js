// package-events/events/sign.js
const appAjax = require('./../../utils/app-ajax');

let that = null;
let remoteMethods = {
    getDraftDetail: function (_callback) {
        let service = 'EVENT_DETAIL';
        appAjax.postJson({
            autoShowWait: true,
            type: 'GET',
            service,
            otherParams: {
                id: that.data.id
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
        id: '',
        info: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
        that = this;
        this.setData({
            id: options.id || ''
        })
        remoteMethods.getDraftDetail(res => {
            this.setData({
                info: res
            })
        }) 
	}
})