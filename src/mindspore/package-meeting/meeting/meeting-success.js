// pages/meeting/meeting-success.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    imageUrl: '',
    msgText: [],
    btnText: '',
    isHome: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id ? options.id : '',
      msgText: options.delete ? ['删除成功！', '您已成功删除会议'] : ['预定成功', '您已成功预定会议'],
      btnText: options.delete ? '查看会议列表' : '查看此会议',
      imageUrl: options.delete ? '/static/sig/del-success.png' : '/static/sig/add-success.png',
      isHome: options.ishome ? options.ishome : '',
    });
    wx.setNavigationBarTitle({
      title: options.delete ? '会议列表' : '预定会议',
    });
  },
  toDetail: function () {
    if (this.data.id) {
      wx.redirectTo({
        url: '/package-meeting/meeting/detail?id=' + this.data.id,
      });
    } else {
      if (this.data.isHome === 'true') {
        wx.switchTab({
          url: '/pages/index/index',
        });
      } else {
        wx.navigateBack();
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
});
