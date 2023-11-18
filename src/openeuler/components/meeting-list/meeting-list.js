// components/meeting-list/meeting-list.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');
let that = null;
const remoteMethods = {
  getSigList: function (_callback) {
    appAjax.postJson({
      type: 'GET',
      service: 'MEETING_SIG_LIST',
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  getMeettingData: function (params, _callback) {
    if (that.properties.pageType === 2) {
      params = {
        ...params,
        search: that.data.curKeyword,
        group_name: that.data.filterSigName === '全部SIG' ? '' : that.data.filterSigName,
      };
    }
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: that.properties.apiUrl,
      success: function (ret) {
        _callback && _callback(ret);
      },
      data: params,
    });
  },
  delMeeting: function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'DELETE',
      service: 'DEL_MEETING',
      otherParams: {
        id: id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  collect: function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'COLLECT',
      data: {
        meeting: id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  uncollect: function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'DELETE',
      service: 'UNCOLLECT',
      otherParams: {
        id: id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
};
const localMethod = {
  async checkLogin() {
    if (!(await sessionUtil.getUserInfoByKey('access'))) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    return true;
  },
};
Component({
  /**
   * 组件的属性列表
   * apiUrl: 接口资源路径
   * pageType: 1、首页  2、会议列表页 3、我的会议页面 4、我的收藏会议页面
   */
  properties: {
    apiUrl: {
      type: String,
      value: 'GET_MEETING_DAILY',
    },
    pageType: {
      type: Number,
      value: 1,
    },
    isHome: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    curMid: '',
    curJoinUrl: '',
    collectionId: '',
    platformList: [
      {
        value: 'zoom',
        name: 'Zoom',
      },
      {
        value: 'welink',
        name: 'WeLink(蓝版)',
      },
      {
        value: 'tencent',
        name: '腾讯会议',
      },
    ],
    id: '',
    pageParams: {
      page: 1,
      size: 50,
    },
    total: 0,
    showDialog: false,
    showDialogDel: false,
    actionShow: false,
    actions: [],
    popShow: false,
    filterSigId: '',
    filterSigName: '全部SIG',
    columns: [],
    curKeyword: '',
    curFilterSigId: '',
    curFilterSigName: '全部SIG',
    filterList: [],
  },
  attached() {
    this.properties.pageType === 2 &&
      remoteMethods.getSigList(function (data) {
        if (data && data.length) {
          data.unshift({
            group_name: '全部SIG',
            id: '',
          });
          that.setData({
            columns: data,
          });
        }
      });
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      that = this;
      if (this.properties.pageType === 3 || this.properties.pageType === 4) {
        this.initData();
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getMoreData() {
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
      remoteMethods.getMeettingData(this.data.pageParams, (data) => {
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
    collect: function () {
      if (this.data.collectionId) {
        remoteMethods.uncollect(this.data.collectionId, () => {
          this.setData({
            'pageParams.page': 1,
          });
          this.initData();
        });
      } else {
        wx.requestSubscribeMessage({
          // tmplIds 对应消息模板
          tmplIds: ['2xSske0tAcOVKNG9EpBjlb1I-cjPWSZrpwPDTgqAmWI', 'UpxRbZf8Z9QiEPlZeRCgp_MKvvqHlo6tcToY8fToK50'],
          success() {
            remoteMethods.collect(that.data.id, (res) => {
              if (res.code == 200) {
                that.setData({
                  'pageParams.page': 1,
                });
                that.initData();
              }
            });
          },
        });
      }
    },
    getAddr: function () {
      this.setData({
        showDialog: true,
      });
    },
    getPlatform: function (key) {
      return this.data.platformList.find((item) => item.name === key)?.value;
    },
    copyLink: function () {
      wx.setClipboardData({
        data: this.data.curJoinUrl,
        success: function () {
          that.setData({
            showDialog: false,
          });
        },
      });
    },
    copyId: function () {
      wx.setClipboardData({
        data: this.data.curMid,
        success: function (res) {
          that.setData({
            showDialog: false,
          });
        },
      });
    },
    closeDialog: function () {
      this.setData({
        showDialog: false,
      });
    },
    delMeeting: function () {
      this.setData({
        showDialogDel: true,
      });
    },
    del: function () {
      remoteMethods.delMeeting(this.data.curMid, (data) => {
        if (data.code == 200) {
          this.setData({
            showDialogDel: false,
            'pageParams.page': 1,
          });
          this.initData();
        }
      });
    },
    delCancel: function () {
      this.setData({
        showDialogDel: false,
      });
    },
    toDetail: function (e) {
      wx.navigateTo({
        url: '/package-meeting/meeting/detail?id=' + e.currentTarget.dataset.id,
      });
    },
    async getMore(e) {
      if (!(await localMethod.checkLogin())) {
        return;
      }
      this.setData({
        curMid: e.currentTarget.dataset.item.mid,
        curJoinUrl: e.currentTarget.dataset.item.join_url,
        collectionId: e.currentTarget.dataset.item.collection_id || '',
        id: e.currentTarget.dataset.item.id,
      });
      const collectDesc = this.data.collectionId ? '取消收藏' : '收藏会议';
      const userId = e.currentTarget.dataset.item.user_id;
      if ((await sessionUtil.getUserInfoByKey('level')) === 1) {
        this.setData({
          actions: [
            {
              name: collectDesc,
              operaType: 1,
            },
            {
              name: '获取地址',
              operaType: 2,
            },
          ],
        });
      } else if ((await sessionUtil.getUserInfoByKey('level')) === 2) {
        if ((await sessionUtil.getUserInfoByKey('userId')) === userId) {
          this.setData({
            actions: [
              {
                name: collectDesc,
                operaType: 1,
              },
              {
                name: '获取地址',
                operaType: 2,
              },
              {
                name: '删除会议',
                operaType: 3,
              },
            ],
          });
        } else {
          this.setData({
            actions: [
              {
                name: collectDesc,
                operaType: 1,
              },
              {
                name: '获取地址',
                operaType: 2,
              },
            ],
          });
        }
      } else {
        this.setData({
          actions: [
            {
              name: collectDesc,
              operaType: 1,
            },
            {
              name: '获取地址',
              operaType: 2,
            },
            {
              name: '删除会议',
              operaType: 3,
            },
          ],
        });
      }
      this.setData({
        actionShow: true,
      });
      this.triggerEvent('action-status', 1);
    },
    onActionClose() {
      this.setData({
        actionShow: false,
      });
      this.triggerEvent('action-status', 0);
    },
    onActionSelect(e) {
      if (e.detail.operaType === 1) {
        this.collect();
      } else if (e.detail.operaType === 2) {
        this.getAddr();
      } else {
        this.delMeeting();
      }
    },
    filterSig: function () {
      this.setData({
        popShow: true,
      });
    },
    popCancel: function () {
      this.setData({
        popShow: false,
      });
      this.setData({
        filterSigId: this.data.curFilterSigId,
        filterSigName: this.data.curFilterSigName,
      });
    },
    pickerChange: function (e) {
      this.setData({
        filterSigId: e.detail.value.id,
        filterSigName: e.detail.value.group_name,
      });
    },
    popConfirm: function () {
      this.setData({
        popShow: false,
        curFilterSigId: this.data.filterSigId,
        curFilterSigName: this.data.filterSigName,
      });
      this.initData();
    },
    popCancel: function () {
      this.setData({
        popShow: false,
        filterSigId: this.data.curFilterSigId,
        filterSigName: this.data.curFilterSigName,
      });
    },
    search: function (e) {
      this.setData({
        curKeyword: e.detail.value,
      });
      this.initData();
    },
  },
  ready() {
    if (this.properties.pageType === 1 || this.properties.pageType === 2) {
      this.initData();
    }
  },
});
