// components/meeting-list/meeting-list.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');
let that = null;
const remoteMethods = {
  getMeettingData: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: that.properties.apiUrl,
      success: function (ret) {
        ret.forEach((item) => {
          if (item.group_name == 'MSG') {
            item.named = 'MindSpore MSG 会议';
            item.group_names = item.city + 'MSG组';
          } else if (item.group_name == 'Tech') {
            item.named = 'MindSpore 专家委员会议';
            item.group_names = '专家委员会';
          } else {
            item.named = 'MindSpore SIG 会议';
            item.group_names = item.group_name + ' SIG组';
          }
          let tempdate = item.date.split('-');
          if (tempdate.length > 2) {
            item.dates = parseInt(tempdate[1]) + '月' + parseInt(tempdate[2]) + '日';
          }
        });
        _callback && _callback(ret);

        if (that.properties.pageType === 2) {
          that.setData({
            list: ret,
          });
          localMethod.filterData();
        }
      },
    });
  },
  delMeeting: function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'PUT',
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
  filterData: function () {
    let listTemp = [];
    if (that.data.curFilterId === '' && that.data.curKeyword === '') {
      that.setData({
        list: that.data.filterList,
      });
      return;
    }
    if (that.data.curFilterId === '') {
      that.data.filterList.forEach(function (item) {
        if (
          item.topic.toLowerCase().includes(that.data.curKeyword.toLowerCase()) ||
          item.group_name.toLowerCase().includes(that.data.curKeyword.toLowerCase())
        ) {
          listTemp.push(item);
        }
      });
      that.setData({
        list: listTemp,
      });
      return;
    }
    if (that.data.curKeyword === '') {
      if (that.data.curFilterId === 'All') {
        listTemp = that.data.filterList;
      } else {
        that.data.filterList.forEach(function (item) {
          if (item.group_name === that.data.curFilterId) {
            listTemp.push(item);
          } else if (item.group_name !== 'MSG' && item.group_name !== 'Tech' && that.data.curFilterId === 'SIG') {
            listTemp.push(item);
          }
        });
      }
      that.setData({
        list: listTemp,
      });
      return;
    }
    that.data.filterList.forEach(function (item) {
      if (
        item.group_name == that.data.curFilterId &&
        item.topic.toLowerCase().includes(that.data.curKeyword.toLowerCase())
      ) {
        listTemp.push(item);
      } else if (
        item.group_name !== 'MSG' &&
        item.group_name !== 'Tech' &&
        that.data.curFilterId === 'SIG' &&
        item.topic.toLowerCase().includes(that.data.curKeyword.toLowerCase())
      ) {
        listTemp.push(item);
      } else if (
        (that.data.curFilterId === 'All' && item.topic.toLowerCase().includes(that.data.curKeyword.toLowerCase())) ||
        item.group_name.toLowerCase().includes(that.data.curKeyword.toLowerCase())
      ) {
        listTemp.push(item);
      }
    });
    that.setData({
      list: listTemp,
    });
  },
  checkLogin() {
    if (!sessionUtil.getUserInfoByKey('access')) {
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
    curMmid: '',
    curMid: '',
    curJoinUrl: '',
    collectionId: '',
    id: '',
    showDialog: false,
    showDialogDel: false,
    actionShow: false,
    actions: [],
    popShow: false,
    columns: [
      {
        group_name: '全部',
        id: 'All',
      },
      {
        group_name: 'SIG Leader',
        id: 'SIG',
      },
      {
        group_name: 'MSG组织者',
        id: 'MSG',
      },
      {
        group_name: '专家委员会',
        id: 'Tech',
      },
    ],
    curKeyword: '',
    curFilterId: '',
    curFilterName: '类型',
    filterList: [],
  },
  attached() {},
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
    collect: function () {
      if (this.data.collectionId) {
        remoteMethods.uncollect(this.data.collectionId, function () {
          remoteMethods.getMeettingData(function (data) {
            setTimeout(() => {
              that.setData({
                list: data,
              });
            }, 0);
          });
        });
      } else {
        wx.requestSubscribeMessage({
          tmplIds: ['tK51rqE72oFo5e5ajCnvkPwnsCncfydgcV1jb9ed6Qc', 'kKkokqmaH62qp_txDQrNnyoRbM5wCptTAymhmsfHT7c'],
          complete() {
            remoteMethods.collect(that.data.id, function (res) {
              if (res.code == 201) {
                remoteMethods.getMeettingData(function (data) {
                  setTimeout(() => {
                    that.setData({
                      list: data,
                    });
                  }, 0);
                });
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
        success: function () {
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
      that = this;
      remoteMethods.delMeeting(this.data.curMid, function (data) {
        if (data.code == 200) {
          wx.redirectTo({
            url: that.properties.isHome
              ? '/package-meeting/meeting/meeting-success?delete=1&ishome=true'
              : '/package-meeting/meeting/meeting-success?delete=1',
          });
        } else {
          wx.showToast({
            title: '删除会议失败',
            icon: 'error',
            duration: 2000,
          });
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
        url:
          '/package-meeting/meeting/detail?id=' +
          e.currentTarget.dataset.id +
          '&collection_id=' +
          e.currentTarget.dataset.collection_id,
      });
    },
    initData() {
      remoteMethods.getMeettingData(function (data) {
        let listData = data;
        that.setData({
          list: listData,
          filterList: listData,
        });
      });
    },
    getMore(e) {
      if (!localMethod.checkLogin()) {
        return;
      }
      this.setData({
        curMmid: e.currentTarget.dataset.item.mmid,
        curMid: e.currentTarget.dataset.item.mid,
        curJoinUrl: e.currentTarget.dataset.item.join_url,
        collectionId: e.currentTarget.dataset.item.collection_id || '',
        id: e.currentTarget.dataset.item.id,
      });
      const collectDesc = this.data.collectionId ? '取消收藏' : '收藏会议';
      const userId = e.currentTarget.dataset.item.user_id;
      if (sessionUtil.getUserInfoByKey('level') === 1) {
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
      } else if (sessionUtil.getUserInfoByKey('level') === 2) {
        if (sessionUtil.getUserInfoByKey('userId') === userId) {
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
      if (this.data.curFilterName === '类型') {
        this.setData({
          popShow: true,
          curFilterName: '全部',
          curFilterId: 'All',
        });
      } else {
        this.setData({
          popShow: true,
        });
      }
    },
    pickerChange: function (e) {
      this.setData({
        curFilterId: e.detail.value.id,
        curFilterName: e.detail.value.group_name,
      });
    },
    popConfirm: function () {
      this.setData({
        popShow: false,
      });
      localMethod.filterData();
    },
    popCancel: function () {
      this.setData({
        popShow: false,
      });
    },
    search: function (e) {
      this.setData({
        curKeyword: e.detail.value,
      });
      localMethod.filterData();
    },
  },
  ready() {
    if (this.properties.pageType === 1 || this.properties.pageType === 2) {
      this.initData();
    }
  },
});
