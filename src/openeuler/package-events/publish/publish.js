// package-events/publish/publish.js
const appAjax = require('./../../utils/app-ajax');
const utils = require("./../../utils/utils.js");
utils.formateDate();
let that = null;
let remoteMethods = {
    addEvents: function (postData, _callback) {
        let type = 'POST';
        let service = "PUBLISH_EVENT";
        if (that.data.detailType == 4) {
            type = 'PUT';
            service = 'EDIT_DETAIL_PUBLISH'
        }
        appAjax.postJson({
            autoShowWait: true,
            type,
            service,
            data: postData,
            otherParams: {
                id: that.data.id || ''
            },
            success: function (ret) {
                if (ret.code == 400) {
                    localMethods.toast(ret.msg);
                    return;
                }
                _callback && _callback(ret);
            }
        });
    },
    saveDraft: function (postData, _callback) {
        let type = 'POST';
        let service = "SAVE_DRAFT";
        if (that.data.detailType == 4) {
            type = 'PUT';
            service = 'EDIT_DETAIL'
        } else if (that.data.detailType == 5) {
            type = 'PUT';
            service = 'EDIT_SCHEDULE'
        }
        appAjax.postJson({
            autoShowWait: true,
            type,
            service,
            data: postData,
            otherParams: {
                id: that.data.id || ''
            },
            success: function (ret) {
                if (ret.code == 400) {
                    localMethods.toast(ret.msg);
                    return;
                }
                _callback && _callback(ret);
            }
        });
    },
    getDraftDetail: function (_callback) {
        let service = 'DRAFT_DETAIL';
        if (that.data.detailType == 5) {
            service = 'EVENT_DETAIL'
        }
        appAjax.postJson({
            autoShowWait: true,
            type: 'GET',
            service,
            otherParams: {
                id: that.data.id
            },
            success: function (ret) {
                _callback && _callback(ret);
            }
        });
    }
}
let localMethods = {
    validation: function (data) {
        if (data.activity_type === 1) {
            if (!data.title) {
                this.toast('请输入活动标题');
                return;
            }
            if (!data.date) {
                this.toast('请选择活动日期');
                return;
            }
            if (!data.register_url) {
                this.toast('请输入报名链接');
                return;
            }
            if (!data.address) {
                this.toast('请输入活动城市');
                return;
            }
            if (!data.detail_address) {
                this.toast('请输入具体地址');
                return;
            }
            let flag = true;
            data.schedules.forEach(item => {
                if (!item.start) {
                    flag = false;
                }
                if (!item.end) {
                    flag = false;
                }
                if (!item.topic) {
                    flag = false;
                }
                item.speakerList.forEach(item => {
                    if (!item.name) {
                        flag = false;
                    }
                })
            });
            if (!flag) {
                this.toast('请补充日程必填信息');
                return;
            }
        } else {
            if (!data.title) {
                this.toast('请输入活动标题');
                return;
            }
            if (!data.date) {
                this.toast('请选择活动日期');
                return;
            }
            if (!data.register_url) {
                this.toast('请输入报名链接');
                return;
            }
            if (!data.start && !data.end) {
                this.toast('请选择活动时间');
                return;
            }
            let flag = true;
            data.schedules.forEach(item => {
                if (!item.start) {
                    flag = false;
                }
                if (!item.end) {
                    flag = false;
                }
                if (!item.topic) {
                    flag = false;
                }
                item.speakerList.forEach(item => {
                    if (!item.name) {
                        flag = false;
                    }
                    if (!item.mail) {
                        flag = false;
                    }
                })
            });
            if (!flag) {
                this.toast('请补充填写日程必填信息');
                return;
            }
        }

        return true;
    },
    toast: function (msg) {
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
        id: '',
        detailType: 0,
        title: '',
        date: '',
        type: 1,
        address: '',
        addressName: '',
        registerUrl:'',
        desc: '',
        schedule: [{
            start: '',
            end: '',
            topic: '',
            speakerList: [{
                name: '',
                title: '',
                mail: ''
            }]
        }],
        datePopShow: false,
        timePopShow: false,
        curDate: new Date().getTime(),
        currentDate: new Date().getTime(),
        minDate: new Date().getTime(),
        startTimeIndex: 0,
        endTimeIndex: 0,
        start: '',
        end: '',
        currentTime: '08:00',
        minTime: 8,
        maxTime: 22,
        minEndTime: 8,
        maxEndTime: 22,
        filter(type, options) {
            if (type === 'minute') {
                return options.filter((option) => option % 5 === 0);
            }

            return options;
        },
        endTimePopShow: false,
        currentEndTime: '08:00',
        topicSelIndex: 1,
        longitude: '',
        latitude: '',
        onlineStartTime: '',
        onlineEndTime: '',
        isOnline: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        that = this;
        this.setData({
            id: options.id,
            detailType: options.type || 0
        })
        if ((this.data.id && (this.data.detailType == 5)) || (this.data.id && (this.data.detailType == 4))) {
            remoteMethods.getDraftDetail(res => {
                this.setData({
                    title: res.title,
                    date: res.date,
                    type: res.activity_type,
                    registerUrl: res.register_url || '',
                    longitude: res.longitude || '',
                    latitude: res.latitude || '',
                    address: res.address || '',
                    addressName: res.detail_address || '',
                    desc: res.synopsis || '',
                    topicSelIndex: res.poster,
                    schedule: JSON.parse(res.schedules),
                    onlineStartTime: res.start || '',
                    onlineEndTime: res.end || ''
                })
            })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    titleInput(e) {
        this.setData({
            title: e.detail.value
        })
    },
    selDate: function () {
        this.setData({
            datePopShow: true
        })
    },
    dateCancel: function () {
        this.setData({
            datePopShow: false
        })
    },
    dateOnInput: function (e) {
        this.setData({
            currentDate: e.detail
        })
    },
    dateConfirm: function () {
        this.setData({
            date: (new Date(this.data.currentDate)).Format("yyyy-MM-dd"),
            datePopShow: false
        })
    },
    radioOnChange(e) {
        let url;
        if (e.detail === 2) {
            url = 'https://space.bilibili.com/527064077'
        } else {
            url = '';
        }
        this.setData({
            type: e.detail,
            registerUrl:url
        })
    },
    selAddress() {
        wx.showModal({
            title: '提示',
            content: '即将唤起腾讯地图，是否同意？',
            success(res) {
                if (res.confirm) {
                    wx.chooseLocation({
                        success: function (res) {
                            that.setData({
                                address: res.address,
                                addressName: res.name,
                                longitude: res.longitude,
                                latitude: res.latitude,
                            });
                        },
                        fail: function (res) {
                            console.error(res);
                        },
                    });
                } else if (res.cancel) {
                    return false
                }
            }
        })

    },
    addressNameInput(e) {
        this.setData({
            addressName: e.detail.value
        })
    },
    registerUrlInput(e) {
        this.setData({
            registerUrl: e.detail.value,
        });
    },
    descInput(e) {
        this.setData({
            desc: e.detail.value
        })
    },
    scheduleTitleInput(e) {
        const key = `schedule[${e.currentTarget.dataset.index}].topic`;
        this.setData({
            [key]: e.detail.value
        })
    },
    nameInput(e) {
        const key = `schedule[${e.currentTarget.dataset.outindex}].speakerList[${e.currentTarget.dataset.innerindex}].name`;
        this.setData({
            [key]: e.detail.value
        })
    },
    speakerTitleInput(e) {
        const key = `schedule[${e.currentTarget.dataset.outindex}].speakerList[${e.currentTarget.dataset.innerindex}].title`;
        this.setData({
            [key]: e.detail.value
        })
    },
    mailInput(e) {
        const key = `schedule[${e.currentTarget.dataset.outindex}].speakerList[${e.currentTarget.dataset.innerindex}].mail`;
        this.setData({
            [key]: e.detail.value
        })
    },
    addSchedule() {
        let arrTemp = this.data.schedule;
        arrTemp.push({
            start: '',
            end: '',
            topic: '',
            speakerList: []
        })
        this.setData({
            schedule: arrTemp
        })
    },
    addSpeaker(e) {
        const length = this.data.schedule[e.currentTarget.dataset.index].speakerList.length;
        const key = `schedule[${e.currentTarget.dataset.index}].speakerList[${length}]`;
        this.setData({
            [key]: {
                name: '',
                title: '',
                mail: ''
            }
        })
    },
    delSchedule(e) {
        let arrTemp = this.data.schedule;
        arrTemp.splice(e.currentTarget.dataset.index, 1);
        this.setData({
            schedule: arrTemp
        })
    },
    delSpeaker(e) {
        let arrTemp = this.data.schedule[e.currentTarget.dataset.outindex].speakerList;
        let key = `schedule[${e.currentTarget.dataset.outindex}].speakerList`;
        arrTemp.splice(e.currentTarget.dataset.innerindex, 1);
        this.setData({
            [key]: arrTemp
        })
    },
    selTime: function (e) {
        this.setData({
            timePopShow: true,
            startTimeIndex: e.currentTarget.dataset.index
        })
    },
    selOnlineStartTime() {
        this.setData({
            timePopShow: true,
            isOnline: 1
        })
    },
    timeCancel: function () {
        this.setData({
            timePopShow: false,
            isOnline: 0
        })
    },
    timeOnInput: function (e) {
        this.setData({
            currentTime: e.detail
        })
    },
    timeConfirm: function (e) {
        if (this.data.isOnline) {
            this.setData({
                onlineStartTime: this.data.currentTime,
                isOnline: 0,
                timePopShow: false,
            })
            return;
        }
        const key = `schedule[${this.data.startTimeIndex}].start`;
        this.setData({
            [key]: this.data.currentTime,
            timePopShow: false,
            isOnline: 0
        })
    },
    timeCancel: function () {
        this.setData({
            timePopShow: false
        })
    },
    endTimeCancel: function () {
        this.setData({
            endTimePopShow: false
        })
    },
    selEndTime: function (e) {
        this.setData({
            endTimePopShow: true,
            endTimeIndex: e.currentTarget.dataset.index
        })
    },
    selOnlineEndTime() {
        this.setData({
            endTimePopShow: true,
            isOnline: 1
        })
    },
    endTimeOnInput: function (e) {
        this.setData({
            currentEndTime: e.detail
        })
    },
    endTimeConfirm: function () {
        if (this.data.isOnline) {
            this.setData({
                isOnline: 0,
                onlineEndTime: this.data.currentEndTime,
                endTimePopShow: false
            })
            return;
        }
        const key = `schedule[${this.data.endTimeIndex}].end`;
        this.setData({
            [key]: this.data.currentEndTime,
            endTimePopShow: false,
            isOnline: 0
        })
    },
    endTimeCancel: function () {
        this.setData({
            endTimePopShow: false,
            isOnline: 0
        })
    },
    selTop(e) {
        this.setData({
            topicSelIndex: e.currentTarget.dataset.index
        })
    },
    publish() {
        let postData = null;
        if (this.data.type === 1) {
            postData = {
                "title": this.data.title,
                "date": this.data.date,
                "activity_type": 1,
                "register_url": this.data.registerUrl || '',
                "synopsis": this.data.desc,
                "address": this.data.address,
                "detail_address": this.data.addressName,
                "longitude": this.data.longitude,
                "latitude": this.data.latitude,
                "poster": this.data.topicSelIndex,
                "schedules": this.data.schedule
            }
        } else {
            postData = {
                "title": this.data.title,
                "date": this.data.date,
                "activity_type": 2,
                "register_url": this.data.registerUrl || '',
                "synopsis": this.data.desc,
                "longitude": this.data.longitude,
                "latitude": this.data.latitude,
                "poster": this.data.topicSelIndex,
                "schedules": this.data.schedule,
                "start": this.data.onlineStartTime,
                "end": this.data.onlineEndTime
            }
        }
        if (!localMethods.validation(postData)) {
            return;
        }
        remoteMethods.addEvents(postData, (res) => {
            wx.redirectTo({
                url: '/package-events/publish/success?type=2'
            })
        })
    },
    saveDraft() {
        let postData = null;
        if (this.data.type === 1) {
            postData = {
                "title": this.data.title,
                "date": this.data.date,
                "activity_type": 1,
                "register_url": this.data.registerUrl || '',
                "synopsis": this.data.desc,
                "address": this.data.address,
                "detail_address": this.data.addressName,
                "longitude": this.data.longitude,
                "latitude": this.data.latitude,
                "poster": this.data.topicSelIndex,
                "schedules": this.data.schedule
            }
        } else {
            postData = {
                "title": this.data.title,
                "date": this.data.date,
                "activity_type": 2,
                "register_url": this.data.registerUrl || '',
                "synopsis": this.data.desc,
                "longitude": this.data.longitude,
                "latitude": this.data.latitude,
                "poster": this.data.topicSelIndex,
                "schedules": this.data.schedule,
                "start": this.data.onlineStartTime,
                "end": this.data.onlineEndTime
            }
        }
        if (!localMethods.validation(postData)) {
            return;
        }
        remoteMethods.saveDraft(postData, () => {
            wx.redirectTo({
                url: '/package-events/publish/success?type=1'
            })
        })
    },
    cancelEditSchedule() {
        wx.navigateBack();
    },
    editScheduleConfirm() {
        let postData = null;
        if (this.data.type === 1) {
            postData = {
                "title": this.data.title,
                "date": this.data.date,
                "activity_type": 1,
                "register_url": this.data.registerUrl || '',
                "synopsis": this.data.desc,
                "address": this.data.address,
                "detail_address": this.data.addressName,
                "longitude": this.data.longitude,
                "latitude": this.data.latitude,
                "poster": this.data.topicSelIndex,
                "schedules": this.data.schedule
            }
        } else {
            postData = {
                "title": this.data.title,
                "date": this.data.date,
                "activity_type": 2,
                "register_url": this.data.registerUrl || '',
                "synopsis": this.data.desc,
                "longitude": this.data.longitude,
                "latitude": this.data.latitude,
                "poster": this.data.topicSelIndex,
                "schedules": this.data.schedule,
                "start": this.data.onlineStartTime,
                "end": this.data.onlineEndTime
            }
        }
        if (!localMethods.validation(postData)) {
            return;
        }
        postData.schedules = JSON.stringify(this.data.schedule);
        remoteMethods.saveDraft(postData, () => {
            wx.redirectTo({
                url: '/package-events/publish/success?type=3'
            })
        })
    },
    toPoster() {
        const address = this.data.type == 1 ? this.data.addressName : '';
        wx.navigateTo({
            url: `/package-events/events/poster?title=${this.data.title}&date=${this.data.date}&address=${address}&poster=${this.data.topicSelIndex}`
        })
    }
})