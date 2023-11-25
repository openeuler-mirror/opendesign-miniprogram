// pages/my/my.js
const appAjax = require('./../../utils/app-ajax');

let remoteMethods = {
  getMyMeeting: function (_callback) {
    appAjax.postJson({
      type: 'GET',
      service: 'GET_MY_MEETING',
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  getMyCollect: function (_callback) {
    appAjax.postJson({
      type: 'GET',
      service: 'GET_MY_COLLECT',
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  getCounts: function (_callback) {
    appAjax.postJson({
      type: 'GET',
      service: 'GET_COUNTS',
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
    iphoneX: false,
    avatarUrl: '',
    nickName: '',
    level: 1,
    avtivityLevel: 1,
    collectedActivitiesCount: 0,
    collectedMeetingsCount: 0,
    createdMeetingsCount: 0,
    draftsCount: 0,
    publishedActivitiesCount: 0,
    publishingActivitiesCount: 0,
    registerTableCount: 0,
    userId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    wx.getStorage({
      key: '_app_userinfo_session',
      encrypt: true,
      success(res) {
        that.setData({
          iphoneX: that.getTabBar().data.iPhoneX,
          avatarUrl: res.data?.avatarUrl,
          nickName: res.data?.nickName,
          level: res.data?.level,
          userId: res.data?.userId,
          avtivityLevel: res.data?.eventLevel,
        });
      },
    });
    remoteMethods.getMyMeeting((res) => {
      this.setData({
        meetingCount: res.length,
      });
    });
    remoteMethods.getMyCollect((res) => {
      this.setData({
        collectCount: res.length,
      });
    });
    remoteMethods.getCounts((res) => {
      this.setData({
        collectedActivitiesCount: res.collected_activities_count || 0,
        collectedMeetingsCount: res.collected_meetings_count || 0,
        createdMeetingsCount: res.created_meetings_count || 0,
        draftsCount: res.drafts_count || 0,
        publishedActivitiesCount: res.published_activities_count || 0,
        publishingActivitiesCount: res.publishing_activities_count || 0,
      });
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({
      _tabbat: 3,
    });
  },
  go(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
  },
  copy: function (e) {
    wx.setClipboardData({
      data: `${e.currentTarget.dataset.copy}`,
    });
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    remoteMethods.getCounts((res) => {
      this.setData({
        collectedActivitiesCount: res.collected_activities_count || 0,
        collectedMeetingsCount: res.collected_meetings_count || 0,
        createdMeetingsCount: res.created_meetings_count || 0,
        draftsCount: res.drafts_count || 0,
        publishedActivitiesCount: res.published_activities_count || 0,
        publishingActivitiesCount: res.publishing_activities_count || 0,
      });
    });
  },
});
