// package-events/sign-up/sign-up.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require("../../utils/app-session.js");
const validationConfig = require('./../../config/field-validate-rules');

let that = null;

let remoteMethods = {
    getUserInfo: function (_callback) {
        appAjax.postJson({
            autoShowWait: true,
            type: 'GET',
            service: 'APPLICANT_INFO',
            otherParams: {
                id: sessionUtil.getUserInfoByKey('userId')
            },
            success: function (ret) {
                _callback && _callback(ret);
            }
        });
    },
    signUp: function (postData, _callback) {
        appAjax.postJson({
            autoShowWait: true,
            type: 'POST',
            data: postData,
            service: 'SAVE_SIGNUP_INFO',
            success: function (ret) {
                _callback && _callback(ret);
            }
        });
    }
}

let localMethods = {
    validation() {
        if (!that.data.name) {
            this.toast('请输入您的姓名');
            return;
        }
        if (!validationConfig.phone.regex.test(that.data.tel)) {
            this.toast('请输入正确的手机号码');
            return;
        }
        if (!validationConfig.email.regex.test(that.data.mail)) {
            this.toast('请输入正确的邮箱地址');
            return;
        }
        if (!that.data.enterprise) {
            this.toast('请输入您的工作单位名称');
            return;
        }
        return true;
    },
    toast(msg) {
        wx.showToast({
            title: msg,
            icon: "none",
            duration: 2000
        });
    }
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        tel: '',
        mail: '',
        enterprise: '',
        occupation: '',
        gitee: '',
        id: '',
        eventTitle: '',
        poster: 1,
        tips: 'Gitee ID为https://gitee.com/{{gitee_id}} 中的gitee_id'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        that = this;
        this.setData({
            id: options.id,
            eventTitle: options.title,
            poster: options.poster,
            isScan: options.isScan || 0
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        remoteMethods.getUserInfo(res => {
            this.setData({
                name: res.name || '',
                tel: res.telephone || '',
                mail: res.email || '',
                enterprise: res.company || '',
                occupation: res.profession || '',
                gitee: res.gitee_name || ''
            })
        })
    },
    nameInput(e) {
        this.setData({
            name: e.detail.value
        })
    },
    telInput(e) {
        this.setData({
            tel: e.detail.value
        })
    },
    mailInput(e) {
        this.setData({
            mail: e.detail.value
        })
    },
    enterpriseInput(e) {
        this.setData({
            enterprise: e.detail.value
        })
    },
    occupationInput(e) {
        this.setData({
            occupation: e.detail.value
        })
    },
    giteeInput(e) {
        this.setData({
            gitee: e.detail.value
        })
    },
    signUp() {
        if (!localMethods.validation()) {
            return;
        }
        const postData = {
            company: this.data.enterprise,
            email: this.data.mail,
            gitee_name: this.data.gitee,
            name: this.data.name,
            profession: this.data.occupation,
            telephone: this.data.tel,
            activity: this.data.id
        }
        remoteMethods.signUp(postData, (res) => {
            if (res.code === 400) {
                wx.showToast({
                    title: res.msg,
                    icon : "none",
                    duration: 2000
                });
                return;
            }
            if (this.data.isScan) {
                wx.redirectTo({
                    url: `/package-events/events/sign-success?id=${this.data.id}`
                })
                return;
            }
            wx.redirectTo({
                url: `/package-events/sign-up/sign-up-success?name=${encodeURIComponent(this.data.name)}&title=${encodeURIComponent(this.data.eventTitle)}&tel=${encodeURIComponent(this.data.tel)}&poster=${encodeURIComponent(this.data.poster)}&id=${encodeURIComponent(this.data.id)}`
            })
        })
    },
    back() {
        if (this.data.isScan) {
            wx.switchTab({
                url: '/pages/events/events'
            })
            return;
        }
        wx.navigateBack();
    }
})