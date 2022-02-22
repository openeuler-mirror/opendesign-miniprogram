var appAjax = require('./../../utils/app-ajax');
let remoteMethods = {
  getSigList: function (keyword, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'SIG_LIST',
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
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    remoteMethods.getSigList('', function (list) {
      that.setData({
        list: list,
      });
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
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
    remoteMethods.getSigList(e.detail.value, function (list) {
      that.setData({
        list: list,
      });
    });
  },
});
