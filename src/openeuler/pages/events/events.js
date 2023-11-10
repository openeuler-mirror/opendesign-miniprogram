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
    list: [],
    pageParams: {
      page: 1,
      size: 50,
    },
    total: 0,
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
          list: res.data,
          total: res.total,
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
    if (url.includes('publish') && !sessionUtil.getUserInfoByKey('access')) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
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
  onReachBottom() {
    if (this.data.total < this.data.pageParams.size * this.data.pageParams.page) {
      return false;
    }
    this.setData({
      'pageParams.page': this.data.pageParams.page + 1,
    });
    this.initData();
  },
  initData: function () {
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
        return;
      } else {
        this.setData({
          underDialogShow: true,
        });
      }
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
  toUpdateSchedule(e) {
    if (!sessionUtil.getUserInfoByKey('access')) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    wx.navigateTo({
      url: `/package-events/events/event-detail?id=${e.currentTarget.dataset.id}&type=5`,
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.onLoad();
  },
});
