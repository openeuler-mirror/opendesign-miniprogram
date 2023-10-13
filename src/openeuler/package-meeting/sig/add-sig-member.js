// pages/sig/add-sig-member.js
const appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
    getSigMemberList: function (id, _callback) {
        appAjax.postJson({
            autoShowWait: true,
            type: 'GET',
            service: "SIG_MEMBER_LIST",
            otherParams: {
                id: id
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
        memberList: [],
        id: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: options.name
        })
        this.setData({
            id: options.id
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        remoteMethods.getSigMemberList(this.data.id, function (list) {
            that.setData({
                memberList: list
            })
        });
    },
    toDetail: function (e) {
       
    },
    addMember: function () {
        wx.navigateTo({
            url: '/package-meeting/sig/add-member?sigId=' + this.data.id
        })
    },
    delMember: function () {
        wx.navigateTo({
            url: '/package-meeting/sig/del-member?sigId=' + this.data.id
        })
    }
})