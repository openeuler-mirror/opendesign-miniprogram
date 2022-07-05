// pages/auth/auth.js
const mixin = require("../../utils/page-mixin.js").$pageMixin;
const appUser = require("../../utils/app-user.js");
const app = getApp();
let that = null;
Page(mixin({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        canIUseGetUserProfile: false
    },
    onLoad(options) {
        that = this;
        if (options.id) {
            this.setData({
                id: options.id
            })
        }
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
    },
    onShow() {

    },
    /**
     * 绑定获取用户信息
     */
    bindGetUserInfo: function (e) {

        wx.getSetting({
            success: function (res) {

                if (res.authSetting['scope.userInfo']) {
                    appUser.wxLogin(function (result) {
                        const pages = getCurrentPages(); // 当前页面
                        const beforePage = ((pages[pages.length - 2].route === 'pages/auth/auth') ? pages[pages.length - 3] : pages[pages.length - 2]); // 前一个页面
                        const id = beforePage.options.id || beforePage.options.scene || that.data.id;
                        const url = id ? '/' + beforePage.route + '?id=' + id : '/' + beforePage.route
                        wx.reLaunch({
                            url: url
                        })
                    });
                }
            }
        });
    },
    bindGetUserProfile() {
        wx.getUserProfile({
            desc: '用于会议和活动所需信息',
            success: (res) => {
                appUser.wxGetUserProfileLogin(function (result) {
                    const pages = getCurrentPages(); // 当前页面
                    const beforePage = ((pages[pages.length - 2].route === 'pages/auth/auth') ? pages[pages.length - 3] : pages[pages.length - 2]); // 前一个页面
                    const id = beforePage.options.id || beforePage.options.scene || that.data.id;
                    const url = id ? '/' + beforePage.route + '?id=' + id : '/' + beforePage.route
                    wx.reLaunch({
                        url: url
                    })
                }, res.userInfo);
            }
        })
    },
    toPrivacy() {
        wx.navigateTo({
            url: '/package-my/my/privecy'
        })
    }
}))