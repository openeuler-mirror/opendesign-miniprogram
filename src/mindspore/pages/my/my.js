// pages/my/my.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');

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
  getCounts:function(_callback){
    appAjax.postJson({
      type: 'GET',
      service: 'GET_COUNTS',
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  }
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
    collectedMeetingsCount: 5,
    createdMeetingsCount: 8,
    draftsCount: 0,
    publishedActivitiesCount: 0,
    publishingActivitiesCount: 0,
    registerTableCount: 0,
    registerdActivitiesCount: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      iphoneX: this.getTabBar().data.iPhoneX,
      avatarUrl: sessionUtil.getUserInfoByKey('avatarUrl'),
      nickName: sessionUtil.getUserInfoByKey('nickName'),
      level: sessionUtil.getUserInfoByKey('level'),
      avtivityLevel:sessionUtil.getUserInfoByKey('eventLevel')
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
    remoteMethods.getCounts((res)=>{
      this.setData({
        collectedActivitiesCount: res.collected_activities_count||0,
        collectedMeetingsCount: res.collected_meetings_count||0,
        createdMeetingsCount: res.created_meetings_count||0,
        draftsCount: res.drafts_count||0,
        publishedActivitiesCount: res.published_activities_count||0,
        publishingActivitiesCount: res.publishing_activities_count||0,
        registerTableCount: res.register_table_count||0,
        registerdActivitiesCount: res.registerd_activities_count||0,
      });
    })
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
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    remoteMethods.getCounts((res)=>{
      this.setData({
        collectedActivitiesCount: res.collected_activities_count||0,
        collectedMeetingsCount: res.collected_meetings_count||0,
        createdMeetingsCount: res.created_meetings_count||0,
        draftsCount: res.drafts_count||0,
        publishedActivitiesCount: res.published_activities_count||0,
        publishingActivitiesCount: res.publishing_activities_count||0,
        registerTableCount: res.register_table_count||0,
        registerdActivitiesCount: res.registerd_activities_count||0,
      });
    })
    
  },
});
