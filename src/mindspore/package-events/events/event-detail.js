// package-events/events/event-detail.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');

let that = null;
let remoteMethods = {
  getDraftDetail: function (_callback) {
    let service = 'EVENT_DETAIL';
    if (that.data.type == 5) {
      service = 'EVENT_DETAIL';
    } else if (that.data.type == 1) {
      service = 'EXAMINE_DETAIL';
    } else if (that.data.type == 4) {
      service = 'DRAFT_DETAIL';
    }
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service,
      otherParams: {
        id: that.data.id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  reject: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'PUT',
      service: 'REJECT_PUBLISH',
      otherParams: {
        id: that.data.id || '',
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  resolve: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'PUT',
      service: 'RESOLVE_PUBLISH',
      otherParams: {
        id: that.data.id || '',
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  draftPublish: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'PUT',
      service: 'EDIT_DETAIL_PUBLISH',
      data: postData,
      otherParams: {
        id: that.data.id || '',
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  collect: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'EVENT_COLLECT',
      data: {
        activity: that.data.id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  unCollect: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'DELETE',
      service: 'EVENT_UNCOLLECT',
      otherParams: {
        id: that.data.info.collection_id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
};
Page({
  /**
   * 页面的初始数据
   */

  data: {
    info: {},
    showReplay:false,
    id: '',
    startTime:'',
    endTime:'',
    steps: [],
    tabIndex: 0,
    activeNames:0,
    betweenDay:[],
    showDialog:false,
    type: 0,
    level: 1,
    user: '',
    scene: '',
    isIphoneX: false,
  },

  onLoad: function (options) {
    that = this;
    this.setData({
      id: options.id || decodeURIComponent(options.scene),
      scene: decodeURIComponent(options.scene) || '',
      type: options.type,
      level: sessionUtil.getUserInfoByKey('eventLevel') || 1,
    });
    wx.getSystemInfo({
      success(res) {
        if (res.model.indexOf('iPhone X') >= 0 || res.model.indexOf('iPhone 11') >= 0) {
          that.setData({
            isIphoneX: true,
          });
        }
      },
    });
  },

  onShow: function () {
    this.setData({
      user: sessionUtil.getUserInfoByKey('userId'),
    });
    remoteMethods.getDraftDetail((res) => {
      let betweenDay = this.getBetweenDateStr(res.start_date,res.end_date)
      this.setData({
        info: res,
        startTime:res.start_date.replaceAll('-','.'),
        endTime:res.end_date.replaceAll('-','.'),
        betweenDay:betweenDay
      });
      let arr = [];
      JSON.parse(res.schedules).forEach((dayTime,index) => {
        arr.push([])
        dayTime.forEach(item => {
          if(item.speakerList){
            arr[index].push({
                duration: item.start + '-' + item.end,
                title: item.topic,
                speakerList: item.speakerList
            })
          } else {
            arr.push({
                duration: item.start + '-' + item.end,
                title: item.topic,
                speakerList: [{
                    name: item.speaker || '',
                    title: item.desc || ''
                }]
            })
         }
        })
    });
      this.setData({
        steps: arr,
      });
    });
  },
  linkClick() {
    this.setData({
      showDialog:true
    })
  },
  colseDiglog() {
    this.setData({
      showReplay:false,
      showDialog:false
    })
  },
  maskClick () {
    if (this.data.info.replay_url && this.data.info.status == 5) {
      this.setData({
        showReplay:true
      })
    } else {
      this.setData({
        showDialog:true
      })
    }
   
  },
  copyLink(e) {
    let link = e.currentTarget.dataset.link
    let that = this
    wx.setClipboardData({
      data: link,
      success: function () {
          that.setData({
              showDialog: false,
              showReplay:false
          })
      },
      fail:function () {
        that.setData({
          showDialog: false,
          showReplay:false
      })
      }
  })
  },
  getBetweenDateStr(start, end) {
    let startDate = Date.parse(start);
    let endDate = Date.parse(end);
    if (startDate > endDate) {
      return false;
    } else if (startDate == endDate) {
      return [start]
    }
    let result = [];
    let beginDay = start.split("-");
    let endDay = end.split("-");
    let diffDay = new Date();
    let dateList = new Array;
    let i = 0;
    diffDay.setDate(beginDay[2]);
    diffDay.setMonth(beginDay[1] - 1);
    diffDay.setFullYear(beginDay[0]);
    result.push(start);
    while (i == 0) {
      let countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
      diffDay.setTime(countDay);
      dateList[2] = diffDay.getDate();
      dateList[1] = diffDay.getMonth() + 1;
      dateList[0] = diffDay.getFullYear();
      if (String(dateList[1]).length == 1) {
        dateList[1] = "0" + dateList[1]
      }
      if (String(dateList[2]).length == 1) {
        dateList[2] = "0" + dateList[2]
      }
      result.push(dateList[0] + "-" + dateList[1] + "-" + dateList[2]);
      if (dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]) {
        i = 1;
      }
    }
    return result;
  },
  dateChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  switchTab(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
    });
  },
  openLocation(e) {
    if (e.currentTarget.dataset.item.activity_type == 2) {
      return;
    }
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset.item.latitude),
      longitude: Number(e.currentTarget.dataset.item.longitude),
      name: e.currentTarget.dataset.item.detail_address, // 名称
      address: e.currentTarget.dataset.item.address, // 地址
    });
  },
  toEditDraft() {
    wx.redirectTo({
      url: `/package-events/publish/publish?id=${this.data.id}&type=${this.data.type}`,
    });
  },
  draftPublish() {
    let postData = this.data.info;
    postData.schedules = JSON.parse(postData.schedules);
    remoteMethods.draftPublish(postData, (res) => {
      if (res.code === 201) {
        wx.redirectTo({
          url: '/package-events/publish/success?type=2',
        });
      } else {
        setTimeout(function () {
          wx.showToast(
            {
              title: res.message,
              icon: 'none',
              duration: 2000,
            },
            100
          );
        });
      }
    });
  },
  reject() {
    remoteMethods.reject(() => {
      wx.navigateBack();
    });
  },
  resolve() {
    remoteMethods.resolve(() => {
      wx.navigateBack();
    });
  },
  editSchedule() {
    wx.redirectTo({
      url: `/package-events/publish/publish?id=${this.data.id}&type=${this.data.type}`,
    });
  },
  switchTab2() {
    this.setData({
      tabIndex: 1,
    });
  },
  toSignUp() {
    if (!sessionUtil.getUserInfoByKey('access')) {
        wx.navigateTo({
            url: '/pages/auth/auth'
        })
        return;
    }
    wx.navigateTo({
        url: `/package-events/sign-up/sign-up?id=${this.data.info.id}&title=${this.data.info.title}&poster=${this.data.info.poster}`
    })
},
  onShareAppMessage() {
    return {
      title: '活动详情',
      path: `/package-events/events/event-detail?id=${that.data.id}&type=5`,
    };
  },
  toPoster(e) {
    wx.navigateTo({
      url: `/package-events/events/poster?isDraft=${e.currentTarget.dataset.flag || ''}&id=${this.data.info.id}`,
    });
  },
  redrictLogin() {
    if (this.data.scene) {
      wx.navigateTo({
        url: '/pages/auth/auth?id=' + that.data.id,
      });
    } else {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
    }
  },
  collect() {
    if (!this.data.info.collection_id) {
      remoteMethods.collect(() => {
        this.onShow();
      });
    } else {
      remoteMethods.unCollect(() => {
        this.onShow();
      });
    }
  },
});
