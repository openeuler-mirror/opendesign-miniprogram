const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');
let that = null;

let remoteMethods = {
  getList: function (params, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'ALL_EVENTS_LIST',
      data: {
        ...params,
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
    pageParams: {
      page: 1,
      size: 50,
    },
    total: 0,
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    that = this;
    this.initData();
    remoteMethods.getCount(async (res) => {
      this.setData({
        'pageParams.page': 1,
        level: (await sessionUtil.getUserInfoByKey('eventLevel')) || 1,
        user: await sessionUtil.getUserInfoByKey('userId'),
        allNum: res.all_activities_count,
        signUpNum: res.registering_activities_count,
        goingNum: res.going_activities_count,
        complatedNum: res.completed_activities_count,
      });
    });
  },
  initData() {
    let renderData = [];
    remoteMethods.getList(this.data.pageParams, (data) => {
      if (this.data.pageParams.page === 1) {
        renderData = data.data;
      } else {
        renderData = this.data.list;
        renderData.push(...data.data);
      }
      this.setData({
        list: renderData,
        total: data.total,
      });
    });
  },
  onReachBottom() {
    if (this.data.total <= this.data.pageParams.size * this.data.pageParams.page) {
      return false;
    }
    this.setData({
      'pageParams.page': this.data.pageParams.page + 1,
    });
    this.initData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
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
    if (this.data.level === 3) {
      if (e.detail.operaType === 1) {
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
      if (e.detail.operaType === 1) {
        if (this.data.collectionId) {
          remoteMethods.unCollect(() => {
            this.onLoad();
          });
        } else {
          remoteMethods.collect(() => {
            this.onLoad();
          });
        }
      } else if (e.detail.operaType === 3) {
        return;
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
    });
    const strTemp = this.data.collectionId ? '取消收藏' : '收藏活动';
    if (this.data.level === 3) {
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
      if (this.data.user === this.data.userId) {
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
