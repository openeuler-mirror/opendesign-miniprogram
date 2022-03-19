//index.js
const mixin = require("../../utils/page-mixin.js").$pageMixin;
const sessionUtil = require("../../utils/app-session.js");
const appUser = require("../../utils/app-user.js");
let that = null;
Page(mixin({
    data: {
        imgUrls: [{
                type: 1,
                url: 'https://openeuler-website-beijing.obs.cn-north-4.myhuaweicloud.com/MoocStudio/MoocStudio%E7%9A%84%E8%A7%86%E9%A2%911920X1080_small.mp4',
                poster: 'https://openeuler-website-beijing.obs.cn-north-4.myhuaweicloud.com/detail-banner/mooc-banner.png'
        }, ],
        iphoneX: false,
        meetingConponent: null,
        autoplay: false
    },
    handleContact(e) {
        if (!sessionUtil.getUserInfoByKey('access')) {
            wx.navigateTo({
                url: '/pages/auth/auth'
            })
            return;
        }
        wx.navigateTo({
            url: e.currentTarget.dataset.src
        })
    },
    swithTab(e) {
        if (!sessionUtil.getUserInfoByKey('access')) {
            wx.navigateTo({
                url: '/pages/auth/auth'
            })
            return;
        }
        wx.switchTab({
            url: e.currentTarget.dataset.url
        })
    },
    previewImage(e) {

        const current = e.target.dataset.src //获取当前点击的 图片 url
        wx.previewImage({
            current,
            urls: [current]
        })
    },
    onLoad: function () {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        that = this;
        appUser.updateUserInfo(function () {
            that.setData({
                meetingConponent: that.selectComponent('#meeting'),
                iphoneX: that.getTabBar().data.iPhoneX,
            })
        });
    },
    onShow: function () {
        this.getTabBar().setData({
            _tabbat: 0
        })
    },
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
        appUser.updateUserInfo(function () {
            that.data.meetingConponent.initData();
        });
    },
    actionStatus(e) {
        if (e.detail === 1) {
            this.getTabBar().setData({
                show: false
            })
        } else {
            this.getTabBar().setData({
                show: true
            })
        }
    },
    checkLogin() {
        if (!sessionUtil.getUserInfoByKey('access')) {
            wx.navigateTo({
                url: '/pages/auth/auth'
            })
            return;
        }
    },
    play() {
        this.setData({
            autoplay: false
        })
    },
    pause() {
        this.setData({
            autoplay: true
        })
    },
    ended() {
        this.setData({
            autoplay: true
        })
    }
}))