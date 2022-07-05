// package-my/my/feedback.js
const appAjax = require('./../../utils/app-ajax');
const validationConfig = require('./../../config/field-validate-rules');

let that = null;

let remoteMethods = {
    saveFeedback: function (_callback) {
        if(!that.data.content){
            wx.showToast({
                title: '请输入留言反馈',
                icon: "none",
                duration: 2000
            });
            return;
        }
        if(!validationConfig.email.regex.test(that.data.email)){
            wx.showToast({
                title: '请输入正确的邮箱地址',
                icon: "none",
                duration: 2000
            });
            return;
        }
        appAjax.postJson({
            autoShowWait: true,
            type: 'POST',
            service: "SAVE_FEEDBACK",
            data: {
                feedback_type: that.data.type,
                feedback_content: that.data.content,
                feedback_email: that.data.email
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
        type: 1,
        content: '',
        email: ''
    },
    onLoad() {
        that = this;
    },
    switchTab(e) {
        this.setData({
            type: e.currentTarget.dataset.index
        })
    },
    contentInput(e) {
        this.setData({
            content: e.detail.value
        })
    },
    emailInput(e) {
        this.setData({
            email: e.detail.value
        })
    },
    saveFeedback() {
        remoteMethods.saveFeedback(() => {
            wx.showToast({
                title: '提交成功',
                icon: "success",
                duration: 2000,
                mask: true
            });
            setTimeout(() => {
                wx.navigateBack();
            }, 2000)
        })
    }
	
})