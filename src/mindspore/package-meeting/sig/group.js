// package-meeting/sig/group.js
var appAjax = require('./../../utils/app-ajax');
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
        id: '',
        group_name: 'MSG组织者',
      },
      {
        id: '',
        group_name: '专家委员会',
      },
    ],
  },
  toAddMember: function (e) {
    if (e.target.dataset.id === 'SIG') {
      wx.navigateTo({
        url: '/package-meeting/sig/sig-list',
      });
    } else {
      wx.navigateTo({
        url:
          '/package-meeting/sig/add-sig-member?id=' +
          e.currentTarget.dataset.id +
          '&name=' +
          e.currentTarget.dataset.name,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    remoteMethods.getALLGroupList('', function (list) {
      let msgID = '';
      let techID = '';
      list.forEach((item) => {
        if (item.name === 'MSG') {
          msgID = item.id;
        } else {
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
            id: msgID,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
