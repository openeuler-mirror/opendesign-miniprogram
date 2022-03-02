// pages/events/events.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');
const appUser = require('../../utils/app-user.js');
let that = null;

let remoteMethods = {
  getList: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'LATEST_EVENTS',
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
    iphoneX: false,
    level: 1,
    noAuthDialogShow: false,
    user: '',
    // 模拟数据上线删除
    list: [{
      activity_type: 2,
      address: null,
      collection_id: null,
      date: "2022-02-24",
      detail_address: null,
      end: "21:00",
      enterprise: "openEuler",
      id: 61,
      join_url: "https://us06web.zoom.us/j/82607632995?pwd=UUY2OC9RSTlvOWZidFRHZG51aTRtdz09",
      latitude: null,
      live_address: null,
      longitude: null,
      poster: 1,
      register_count: 0,
      register_id: null,
      replay_url: null,
      sign_url: "https://openeuler-mini-program.obs.ap-southeast-1.myhuaweicloud.com/openeuler/miniprogram/activity/61/sign_url.jpeg",
      start: "19:30",
      status: 3,
      synopsis: "openEuler OpenStack SIG于2020年7月由联通发起成立，经历1年多的发展，目前已吸引了电信、华胜天成、华云数据等多家公司的加入，拥有活跃开发者10+，SIG用户130+。在多个openEuler的版本中共发布了5个OpenStack版本，满足了用户的使用。并在容器化、虚拟化等方面与其他SIG密切交流，推动了iSula等技术与OpenStack的结合，还在OpenStack上游社区成功推动了openEuler的原生支持，是openEuler中表现优秀的SIG之一。这些成果离不开SIG成员的共同努力，在这一年多的社区开发活动中，SIG成员在开源开发和运营能力方面都有了较大提升，本次分享邀请了SIG的几个主力开发者和maintianer，以圆桌讨论的形式，给大家带来SIG运作经验的分享，与会者也可以参与其中，进行在线提问和讨论。希望大家踊跃报名，积极参与。",
      title: "openEuler OpenStack SIG运作经验分享",
      user: 647,
      wx_code: "https://openeuler-mini-program.obs.ap-southeast-1.myhuaweicloud.com/openeuler/miniprogram/activity/61/wx_code.jpeg",
    }],
    actionShow: false,
    actions: [],
    underDialogShow: false,
    showDialogDel: false,
    curId: '',
    userId: '',
    collectionId: '',
    registerId: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    that = this;
    this.setData({
      iphoneX: this.getTabBar().data.iPhoneX,
    });
    appUser.updateUserInfo(function () {
      that.setData({
        level: sessionUtil.getUserInfoByKey('eventLevel') || 1,
        user: sessionUtil.getUserInfoByKey('userId'),
      });
      remoteMethods.getList((res) => {
        that.setData({
          list: res,
        });
      });
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({
      _tabbat: 2,
    });
  },
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    if (this.data.level === 1 && url.includes('publish')) {
      this.setData({
        noAuthDialogShow: true,
      });
      return;
    }
    wx.navigateTo({
      url,
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    appUser.updateUserInfo(function () {
      that.setData({
        level: sessionUtil.getUserInfoByKey('eventLevel') || 1,
      });
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
  onActionClose() {
    this.setData({
      actionShow: false,
    });
    this.getTabBar().setData({
      show: true,
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
          showDialoogDel: true,
        });
      }
    } else if (e.detail.operaType == 1) {
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
  },
  del() {
    this.setData({
      showDialogDel: false,
    });
    remoteMethods.delEvent(() => {
      remoteMethods.getList((res) => {
        this.setData({
          list: res,
        });
      });
    });
  },
  delCancel() {
    this.setData({
      showDialogDel: false,
    });
  },
  onMore(e) {
    this.getTabBar().setData({
      show: false,
    });
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
        actions: [{
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
          actions: [{
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
          actions: [{
            name: strTemp,
            operaType: 1,
          }, ],
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
  toUpdateSchedule(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: `/package-events/events/event-detail?id=${e.currentTarget.dataset.id}&type=5`,
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.onLoad();
  },
});