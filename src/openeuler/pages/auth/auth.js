// pages/auth/auth.js
const mixin = require('../../utils/page-mixin.js').$pageMixin;
const appUser = require('../../utils/app-user.js');
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');

let that = null;
Page(
    mixin({
        /**
         * 页面的初始数据
         */
        data: {
            url: '',
            id: '',
            record: false,
            canIUseGetUserProfile: false,
            isPrivecyShown: false,
        },
        onLoad(options) {
            that = this;
            if (options.id) {
                this.setData({
                    id: options.id,
                });
            }

            if (wx.getUserProfile) {
                this.setData({
                    canIUseGetUserProfile: true,
                });
            }
        },
        /**
         * 绑定获取用户信息
         */
        bindGetUserInfo: function () {
            wx.getSetting({
                success: function (res) {
                    if (res.authSetting['scope.userInfo']) {
                        appUser.wxLogin(function () {
                            const pages = getCurrentPages(); // 当前页面
                            const beforePage =
                                pages[pages.length - 2].route === 'pages/auth/auth' ? pages[pages.length - 3] : pages[pages.length - 2]; // 前一个页面
                            const id = beforePage?.options.id || that.data.id;
                            const url = id ? '/' + beforePage?.route + '?id=' + id : '/' + beforePage?.route;
                            if (!sessionUtil.getUserInfoByKey('agreePrivacy')) {
                                this.setData({
                                    isPrivecyShown: true,
                                    url
                                });
                            }
                            wx.reLaunch({
                                url: url,
                            });
                        });
                    }
                },
            });
        },
        bindGetUserProfile() {
            if (!this.data.record) {
                wx.showToast({
                        title: '请先阅读并同意隐私声明',
                        icon: 'none',
                        duration: 2000,
                    },
                    100
                );
                return false;
            }
            wx.getUserProfile({
                desc: '用于会议和活动所需信息',
                success: (res) => {
                    appUser.wxGetUserProfileLogin(function () {
                        const pages = getCurrentPages(); // 当前页面
                        const beforePage =
                            pages[pages.length - 2]?.route === 'pages/auth/auth' ? pages[pages.length - 3] : pages[pages.length - 2]; // 前一个页面
                        const id = beforePage?.options.id || that.data.id;
                        const url = id ? '/' + beforePage?.route + '?id=' + id : '/' + beforePage?.route;
                        if (!sessionUtil.getUserInfoByKey('agreePrivacy')) {
                            that.setData({
                                isPrivecyShown: true,
                                url: url
                            });
                        } else {
                            wx.reLaunch({
                                url: url,
                            });
                        }
                    }, res.userInfo);
                },
                fail:(err) => {
                    console.log(err);
                }
            });
        },
        recordoOnChange: function (event) {
            this.setData({
                record: event.detail,
            });
        },
        toPrivacy() {
            wx.navigateTo({
                url: '/package-my/my/privecy',
            });
        },
        handleDotAgree: function () {
            sessionUtil.clearUserInfo();
            this.setData({
                isPrivecyShown: false,
            });
            wx.switchTab({
                url: '/pages/index/index',
            });
        },
        setAgreeState: function (_callback) {
            appAjax.postJson({
                type: 'PUT',
                service: 'AGREE',
                success: function (ret) {
                    _callback && _callback(ret);
                },
                fail: function () {
                    this.setData({
                        isPrivecyShown: false,
                    });
                }
            });
        },
        setStorage: function () {
            let data = wx.getStorageSync("_app_userinfo_session");
            data.agreePrivacy = true;
            wx.setStorageSync("_app_userinfo_session", data);
        },
        handleClick: function () {
            this.setAgreeState(() => {
                this.setStorage();
                this.setData({
                    isPrivecyShown: false,
                });
                wx.reLaunch({
                    url: this.data.url || '/pages/index/index',
                });
            })
        },
    })
);