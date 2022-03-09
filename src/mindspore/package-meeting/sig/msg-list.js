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
  addCity: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'ADDCITY',
      data: postData,
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
    addCityPopShow:false,
    cityName:''
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
        e.currentTarget.dataset.name+
        '&type=MSG',
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
  AddMember:function(){
    this.setData(
      {
        addCityPopShow:true
      }
    )
  },
  addCityConfirm:function(){
    let that=this
    let postData = {
      name: this.data.cityName,
    };
    remoteMethods.addCity(postData, function (data) {
      if (data&&data.id) {
        that.setData({
          isShowMes: true,
          cityName:''
        });
        remoteMethods.getMsgList('', function (list) {
          that.setData({
            list: list,
          });
        });
        wx.showToast({
          title: '添加成功',
          duration: 2000,
        });
      } else {
        wx.showToast({
          title: '操作失败',
          icon: 'none',
          duration: 2000,
        });
      }
    });
    this.setData(
      {
        addCityPopShow:false
      }
    )
  },
  addCityCancel:function(){
    this.setData(
      {
        addCityPopShow:false,
        cityName:''
      }
    )
  },
  onInput:function(e){
    this.setData({
      cityName: e.detail.value
    })
  }
  
})