// package-meeting/sig/group.js
const appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getALLGroupList: function (data, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'ALL_GROUP_LIST',
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
    list: [
      {
        id: 'SIG',
        group_name: 'SIG Leader',
      },
      {
        id: 'MSG',
        group_name: 'MSG组织者',
      },
      {
        id: '',
        group_name: '专家委员会',
      },
    ],
  },
  toAddMember: function (e) {
    if (e.currentTarget.dataset.id === 'SIG') {
      wx.navigateTo({
        url: '/package-meeting/sig/sig-list',
      });
    } else if (e.currentTarget.dataset.id === 'MSG') {
      wx.navigateTo({
        url: '/package-meeting/sig/msg-list',
      });
    } else {
      wx.navigateTo({
        url:
          '/package-meeting/sig/add-sig-member?id=' +
          e.currentTarget.dataset.id +
          '&name=' +
          e.currentTarget.dataset.name +
          '&type=Tech',
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    remoteMethods.getALLGroupList('', function (list) {
      let techID = '';
      list.forEach((item) => {
        if (item.name !== 'MSG') {
          techID = item.id;
        }
      });
      that.setData({
        list: [
          {
            id: 'SIG',
            group_name: 'SIG Leader',
          },
          {
            id: 'MSG',
            group_name: 'MSG组织者',
          },
          {
            id: techID,
            group_name: '专家委员会',
          },
        ],
      });
    });
  },
});
