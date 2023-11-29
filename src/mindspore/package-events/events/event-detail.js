// package-events/events/event-detail.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');
const { getBetweenDateStr } = require('./../../utils/utils.js');

let that = null;
let remoteMethods = {
  getDraftDetail: function (_callback) {
    let service = 'EVENT_DETAIL';
    if (that.data.type === 5) {
      service = 'EVENT_DETAIL';
    } else if (that.data.type === 1) {
      service = 'EXAMINE_DETAIL';
    } else if (that.data.type === 4) {
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
    showReplay: false,
    id: '',
    startTime: '',
    endTime: '',
    steps: [],
    tabIndex: 0,
    activeNames: 0,
    betweenDay: [],
    showDialog: false,
    showRegister: false,
    type: 0,
    level: 1,
    user: '',
    scene: '',
    isIphoneX: false,
  },

  onLoad: async function (options) {
    that = this;
    this.setData({
      id: options.id || decodeURIComponent(options.scene),
      scene: decodeURIComponent(options.scene) || '',
      type: Number(options.type),
      level: (await sessionUtil.getUserInfoByKey('eventLevel')) || 1,
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

  onShow: async function () {
    this.setData({
      user: await sessionUtil.getUserInfoByKey('userId'),
    });
    remoteMethods.getDraftDetail((res) => {
      if (!res.start_date) {
        return false;
      }
      let betweenDay = getBetweenDateStr(res.start_date, res.end_date);
      this.setData({
        info: res,
        startTime: res.start_date.replaceAll('-', '.'),
        endTime: res.end_date.replaceAll('-', '.'),
        betweenDay: betweenDay,
      });
      let arr = [];
      try {
        JSON.parse(res.schedules).forEach((dayTime, index) => {
          arr.push([]);
          dayTime.forEach((item) => {
            if (item.speakerList) {
              arr[index].push({
                duration: item.start + '-' + item.end,
                title: item.topic,
                speakerList: item.speakerList,
              });
            } else {
              arr.push({
                duration: item.start + '-' + item.end,
                title: item.topic,
                speakerList: [
                  {
                    name: item.speaker || '',
                    title: item.desc || '',
                  },
                ],
              });
            }
          });
        });
      } catch (error) {
        arr = [];
      }
      this.setData({
        steps: arr,
      });
    });
  },
  linkClick() {
    this.setData({
      showDialog: true,
    });
  },
  colseDiglog() {
    this.setData({
      showReplay: false,
      showDialog: false,
      showRegister: false,
    });
  },
  maskClick() {
    if (this.data.info.replay_url && this.data.info.status === 5) {
      this.setData({
        showReplay: true,
      });
    } else {
      this.setData({
        showDialog: true,
      });
    }
  },
  copyLink(e) {
    let link = e.currentTarget.dataset.link;
    let that = this;
    wx.setClipboardData({
      data: link,
      success: function () {
        that.setData({
          showDialog: false,
          showReplay: false,
          showRegister: false,
        });
      },
      fail: function () {
        that.setData({
          showDialog: false,
          showReplay: false,
          showRegister: false,
        });
      },
    });
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
  toEditDraft() {
    wx.redirectTo({
      url: `/package-events/publish/publish?id=${this.data.id}&type=${this.data.type}`,
    });
  },
  draftPublish() {
    let postData = this.data.info;
    try {
      postData.schedules = JSON.parse(postData.schedules);
    } catch (error) {
      return;
    }
    postData.agree = true;
    remoteMethods.draftPublish(postData, (res) => {
      if (res.code === 200) {
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
    this.setData({
      showRegister: true,
    });
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
