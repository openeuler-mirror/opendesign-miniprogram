// pages/my/help.js
const resourceUrl = 'https://openeuler-website.obs.ap-southeast-1.myhuaweicloud.com/help';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [
            {
                name: '会议攻略',
                contentImg: [
                    resourceUrl + '/11.png',
                    resourceUrl + '/12.png',
                    resourceUrl + '/13.png'
                ]
            },
            {
                name: '活动攻略',
                contentImg: [
                    resourceUrl + '/21.png',
                    resourceUrl + '/22.png',
                    resourceUrl + '/23.png'
                ]
            }
        ],
        curIndex: 0
    },
    switchTab(e) {
        this.setData({
            curIndex: e.currentTarget.dataset.index
        })
    }
})