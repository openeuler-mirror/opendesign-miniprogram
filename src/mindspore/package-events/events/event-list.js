// package-events/events/test.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');
let that = null;

let remoteMethods = {
  getList: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'ALL_EVENTS_LIST',
      data: {
        activity: that.data.activity,
        activity_type: that.data.curFilterType,
        search: that.data.curKeyword,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  getCount: function (_callback) {
    appAjax.postJson({
      type: 'GET',
      service: 'GET_EVENTS_COUNT',
      data: {
        activity_type: that.data.curFilterType,
        search: that.data.curKeyword,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  delDraft: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'DELETE',
      service: 'DRAFT_DETAIL',
      otherParams: {
        id: that.data.curId,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  delEvent: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'PUT',
      service: 'DEL_EVENT',
      otherParams: {
        id: that.data.curId,
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
        activity: that.data.curId,
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
        id: that.data.collectionId,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  getSignUpInfo: function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GET_SIGNUP_INFO',
      otherParams: {
        id,
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
    level: 1,
    user: '',
    curKeyword: '',
    popShow: false,
    curFilterType: '',
    curfilterTypeName: '全部类型',
    filterType: '',
    filterTypeName: '全部类型',
    columns: [
      {
        type: '',
        name: '全部类型',
      },
      {
        type: 1,
        name: '线下',
      },
      {
        type: 2,
        name: '线上',
      },
    ],
    list: [],
    actionShow: false,
    actions: [],
    showDialogDel: false,
    underDialogShow: false,
    noAuthDialogShow: false,
    activity: '',
    allNum: 0,
    signUpNum: 0,
    goingNum: 0,
    complatedNum: 0,
    curId: '',
    registerId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    that = this;
    remoteMethods.getList((res) => {
      that.setData({
        list: res,
        level: sessionUtil.getUserInfoByKey('eventLevel') || 1,
        user: sessionUtil.getUserInfoByKey('userId'),
      });
    });
    remoteMethods.getCount((res) => {
      that.setData({
        allNum: res.all_activities_count,
        signUpNum: res.registering_activities_count,
        goingNum: res.going_activities_count,
        complatedNum: res.completed_activities_count,
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  search: function (e) {
    this.setData({
      curKeyword: e.detail.value,
    });
    this.onLoad();
  },
  filterType: function () {
    this.setData({
      popShow: true,
    });
  },
  popCancel: function () {
    this.setData({
      popShow: false,
      filterType: this.data.curFilterType,
      filterTypeName: this.data.curfilterTypeName,
    });
  },
  pickerChange: function (e) {
    this.setData({
      filterType: e.detail.value.type,
      filterTypeName: e.detail.value.name,
    });
  },
  popConfirm: function () {
    this.setData({
      popShow: false,
      curFilterType: this.data.filterType,
      curfilterTypeName: this.data.filterTypeName,
    });
    this.onLoad();
  },
  toUpdateSchedule(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: `/package-events/events/event-detail?id=${e.currentTarget.dataset.id}&type=5`,
    });
  },
  onActionClose() {
    this.setData({
      actionShow: false,
    });
  },

  onActionSelect(e) {
    if (this.data.level == 3) {
      if (e.detail.operaType == 1) {
        if (this.data.collectionId) {
          remoteMethods.unCollect(() => {
            this.onLoad();
          });
        } else {
          remoteMethods.collect(() => {
            this.onLoad();
          });
        }
      } else {
        this.setData({
          showDialogDel: true,
        });
      }
    } else {
      if (e.detail.operaType == 1) {
        if (this.data.collectionId) {
          remoteMethods.unCollect(() => {
            this.onLoad();
          });
        } else {
          remoteMethods.collect(() => {
            this.onLoad();
          });
        }
      } else if (e.detail.operaType == 3) {
        remoteMethods.getSignUpInfo(this.data.curId, (res) => {
          wx.navigateTo({
            url: `/package-events/sign-up/sign-up-success?name=${encodeURIComponent(
              res.name
            )}&title=${encodeURIComponent(res.title)}&tel=${encodeURIComponent(
              res.telephone
            )}&poster=${encodeURIComponent(res.poster)}`,
          });
        });
      } else {
        this.setData({
          underDialogShow: true,
        });
      }
    }
  },
  onMore(e) {
    this.setData({
      actionShow: true,
      curId: e.currentTarget.dataset.item.id,
      userId: e.currentTarget.dataset.item.user,
      collectionId: e.currentTarget.dataset.item.collection_id || '',
      registerId: e.currentTarget.dataset.item.register_id || '',
    });
    const strTemp = this.data.collectionId ? '取消收藏' : '收藏活动';
    if (this.data.level == 3) {
      this.setData({
        actions: [
          {
            name: strTemp,
            operaType: 1,
          },
          {
            name: '下架活动',
            operaType: 2,
          },
        ],
      });
    } else {
      if (this.data.user == this.data.userId) {
        this.setData({
          actions: [
            {
              name: strTemp,
              operaType: 1,
            },
            {
              name: '下架活动',
              operaType: 2,
            },
          ],
        });
      } else {
        this.setData({
          actions: [
            {
              name: strTemp,
              operaType: 1,
            },
          ],
        });
      }

      if (this.data.registerId) {
        let tempArr = this.data.actions;
        tempArr.unshift({
          name: '查看门票',
          operaType: 3,
        });
        this.setData({
          actions: tempArr,
        });
      }
    }
  },
  del() {
    this.setData({
      showDialogDel: false,
    });
    remoteMethods.delEvent(() => {
      this.onLoad();
    });
  },
  delCancel() {
    this.setData({
      showDialogDel: false,
    });
  },
  copyWechat() {
    wx.setClipboardData({
      data: 'openeuler123',
      success: () => {
        this.setData({
          noAuthDialogShow: false,
          underDialogShow: false,
        });
      },
    });
  },
  switchTab(e) {
    this.setData({
      activity: e.currentTarget.dataset.type || '',
    });
    this.onLoad();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.onLoad();
  },
});
