// pages/events/events.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');
const appUser = require('../../utils/app-user.js');
let that = null;

let remoteMethods = {
  getList: function (params, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'LATEST_EVENTS',
      success: function (ret) {
        _callback && _callback(ret);
      },
      data: params,
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
  data: {
    iphoneX: false,
    level: 1,
    noAuthDialogShow: false,
    user: '',
    list: [],
    typeList: ['课程', 'MSG', '赛事', '其他'],
    actionShow: false,
    actions: [],
    underDialogShow: false,
    showDialogDel: false,
    curId: '',
    userId: '',
    collectionId: '',
    registerId: '',
    pageParams: {
      page: 1,
      size: 50,
    },
    total: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    that = this;
    this.setData({
      iphoneX: this.getTabBar().data.iPhoneX,
    });
    appUser.updateUserInfo(async () => {
      that.setData({
        level: (await sessionUtil.getUserInfoByKey('eventLevel')) || 1,
        user: await sessionUtil.getUserInfoByKey('userId'),
      });
    });
    this.initData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({
      _tabbat: 2,
    });
  },
  async navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    if (url.includes('publish') && !(await sessionUtil.getUserInfoByKey('access'))) {
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  copyWechat() {
    wx.setClipboardData({
      data: 'mindspore0328',
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
  onReachBottom() {
    if (this.data.total <= this.data.pageParams.size * this.data.pageParams.page) {
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
  onActionSelect(e) {
    if (this.data.level === 3) {
      if (e.detail.operaType === 1) {
        if (this.data.collectionId) {
          remoteMethods.unCollect(() => {
            this.initializeData();
          });
        } else {
          remoteMethods.collect(() => {
            this.initializeData();
          });
        }
      } else if (e.detail.operaType === 2) {
        this.setData({
          showDialogDel: true,
        });
      } else {
        this.setData({
          showDialoogDel: true,
        });
      }
    } else if (e.detail.operaType === 1) {
      if (this.data.collectionId) {
        remoteMethods.unCollect(() => {
          this.initializeData();
        });
      } else {
        remoteMethods.collect(() => {
          this.initializeData();
        });
      }
    } else if (e.detail.operaType === 3) {
      return;
    } else {
      this.setData({
        underDialogShow: true,
      });
    }
  },
  initializeData() {
    this.setData({
      'pageParams.page': 1,
    });
    this.initData();
  },
  del() {
    this.setData({
      showDialogDel: false,
    });
    remoteMethods.delEvent(() => {
      this.initializeData();
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
  toUpdateSchedule(e) {
    wx.navigateTo({
      url: `/package-events/events/event-detail?id=${e.currentTarget.dataset.id}&type=5`,
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.onLoad();
  },
});
