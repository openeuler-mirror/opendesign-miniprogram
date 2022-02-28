// pages/sig/add-sig-member.js
var appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getSigMemberList: function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GROUP_MEMBER_LIST',
      data: {
        group: id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  getMsgMemberList:function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GROUP_CITY_MEMBER_LIST',
      data: {
        city: id,
      },
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
    memberList: [],
    id: '',
    groupTitle: '',
    urlGroup: '',
    options:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name,
    });
    this.setData({
      id: options.id,
      groupTitle: options.name,
      options:options
    });
  if (options.name.includes('专家')) {
      this.setData({
        urlGroup: 'Tech',
      });
    } else {
      this.setData({
        urlGroup: options.name,
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    const {type}=that.data.options
    if(type!='MSG'){
      remoteMethods.getSigMemberList(this.data.urlGroup, function (list) {
        that.setData({
          memberList: list,
        });
      });
    }else{
      remoteMethods.getMsgMemberList(this.data.urlGroup, function (list) {
        that.setData({
          memberList: list,
        });
      });
    }
  },
  toDetail: function (e) {
    wx.navigateTo({
      url:
        '/package-meeting/sig/member-detail?id=' +
        e.currentTarget.dataset.id +
        '&avatar=' +
        e.currentTarget.dataset.avatar +
        '&name=' +
        e.currentTarget.dataset.name +
        '&nickname=' +
        e.currentTarget.dataset.nickname +
        '&grouptitle=' +
        this.data.groupTitle,
    });
  },
  addMember: function () {
    const {type}=this.data.options
    wx.navigateTo({
      url: '/package-meeting/sig/add-member?group_id=' + this.data.id + '&grouptitle=' + this.data.groupTitle+'&type='+type,
    });
  },
  delMember: function () {
    const {type}=this.data.options
    wx.navigateTo({
      url: '/package-meeting/sig/del-member?group_id=' + this.data.id + '&grouptitle=' + this.data.groupTitle+'&type='+type,
    });
  },
});
