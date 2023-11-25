// components/message/message.js
Component({
  /**
   * 组件的属性列表
   *
   */
  properties: {
    imgUrl: {
      type: String,
      value: '/static/sig/add-success.png',
    },
    msgText: {
      type: Array,
      value: ['添加成员成功！', '您已成功添加此成员'],
    },
    btnText: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},
  /**
   * 组件的方法列表
   */
  methods: {
    backTo() {
      wx.navigateBack();
    },
  },
});
