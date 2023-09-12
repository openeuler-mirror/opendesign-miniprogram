// components/user-info/user-info.js
const sessionUtil = require("../../utils/app-session.js");
const localMethods = {
    getCurText() {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        var n = timestamp * 1000;
        var date = new Date(n);
        var h = date.getHours();
        var m = date.getMinutes();
        var hm = parseFloat(h + '.' + m);
        if (23 < hm || hm <= 6) {
            return '请睡吧';
        }
        if (6 < hm && hm <= 12) {
            return '上午好';
        }
        if (12 < hm && hm <= 14) {
            return '中午好';
        }
        if (14 < hm && hm <= 18) {
            return '下午好';
        }
        if (18 < hm && hm <= 23) {
            return '晚上好';
        }
    }
}
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        isLogin: false,
        avatarUrl: '',
        text: '',
        nickName: ''
    },
    pageLifetimes: {
        // 组件所在页面的生命周期函数

        show: function () {
            this.setData({
                isLogin: sessionUtil.getUserInfoByKey('access') || false
            })
            if (this.data.isLogin) {
                this.setData({
                    avatarUrl: sessionUtil.getUserInfoByKey('avatarUrl'),
                    text: localMethods.getCurText(),
                    nickName: sessionUtil.getUserInfoByKey('nickName')
                })
            }
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        login() {
            wx.navigateTo({
                url: '/pages/auth/auth'
            })
        }
    }
})