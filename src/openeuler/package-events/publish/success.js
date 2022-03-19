// package-events/publish/success.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 1,
        typeCn: '',
        typeDesc: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.type == 1) {
            this.setData({
                type: 1,
                typeCn: '保存',
                typeDesc: '您可以在“我的 > 我的活动 > 草稿箱”查看此活动并继续修改内容'
            })
        } else if(options.type == 2) {
            this.setData({
                type: 2,
                typeCn: '申请',
                typeDesc: '审核通过后您的活动将在openEuler官网和小程序上发布，请耐心等待，您可以在“我的 > 我的活动 > 发布中”查看此活动'
            })
        } else if(options.type == 3) {
            this.setData({
                type: 2,
                typeCn: '修改',
                typeDesc: '您可以在“我的 > 我的活动 > 已发布”查看此活动并继续修改日程'
            })
        }
    },
    toList() {
        wx.switchTab({
            url: '/pages/events/events'
        })
    }
})