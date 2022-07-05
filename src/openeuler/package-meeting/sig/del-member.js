// pages/sig/del-member.js
var appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
    getCludeMemberList: function (postData, _callback) {
        appAjax.postJson({
            autoShowWait: true,
            type: 'GET',
            service: "SIG_CLUDE_MEMBER_LIST",
            otherParams: {
                id: postData.id
            },
            success: function (ret) {
                _callback && _callback(ret);
            }
        });
    },
    delMemberList: function (postData, _callback) {
        appAjax.postJson({
            autoShowWait: true,
            type: 'POST',
            service: "DEL_MEMBER_LIST",
            data: postData,
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
        list: [],
        result: [],
        sigId: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            sigId: options.sigId
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        remoteMethods.getCludeMemberList({
            id: this.data.sigId
        }, function (data) {
            that.setData({
                list: data
            })
        })
    },
    onChange: function (e) {
        this.setData({
            result: e.detail
        })
    },
    del: function () {
        let that = this;
        if (!this.data.result.length) {
            wx.showToast({
                title: '请选择人员',
                icon: "none",
                duration: 2000
            });
            return;
        }
        let postData = {
            ids: this.data.result.join('-'),
            group_id: this.data.sigId
        }
        remoteMethods.delMemberList(postData, function (data) {
            if (data.code === 204) {
                wx.showToast({
                    title: '操作成功',
                    icon: "success",
                    duration: 2000
                });
                wx.navigateBack();
            } else {
                wx.showToast({
                    title: '操作失败',
                    icon: "none",
                    duration: 2000
                });
            }
        })
    }
})