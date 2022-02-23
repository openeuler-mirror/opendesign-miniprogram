let appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getMsgList: function (keyword, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'MSG_LIST',
      data: {
        search: keyword,
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
    keyword: '',
    list: [
      {
        id:24,
        name:'上海',
        group_type:2
      },
      {
        id:25,
        name:'北京',
        group_type:2
      },
      {
        id:26,
        name:'深圳',
        group_type:2
      },{
        id:27,
        name:'成都',
        group_type:2
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    remoteMethods.getMsgList('', function (list) {
      that.setData({
        list: list,
      });
    });
  },
  toAddMember: function (e) {
    wx.navigateTo({
      url:
        '/package-meeting/sig/add-sig-member?id=' +
        e.currentTarget.dataset.id +
        '&name=' +
        e.currentTarget.dataset.name,
    });
  },
  searchInput: function (e) {
    let that = this;
    remoteMethods.getMsgList(e.detail.value, function (list) {
      that.setData({
        list: list,
      });
    });
  },

  
})