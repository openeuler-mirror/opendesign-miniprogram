/**
 * 页面通用方法
 */

const _ = require('./underscore-extend');
const { deepExtend: $extend } = _;
const app = getApp();

// 页面数据
const data = {
  isIphoneX: app.globalData.isIphoneX,
};

// 页面方法
const methods = {
  /**
   * 设置监听器
   */
  $setWatcher(data, watch) {
    // 接收index.js传过来的data对象和watch对象
    watch &&
      Object.keys(watch).forEach((v) => {
        // 将watch对象内的key遍历
        this.$observe(data, v, watch[v]); // 监听data内的v属性，传入watch内对应函数以调用
      });
  },

  /**
   * 监听属性 并执行监听函数
   */
  $observe(obj, key, watchFun) {
    let val = obj[key]; // 给该属性设默认值
    let that = this;
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set(value) {
        val = value;
        watchFun.call(that, value, val); // 赋值(set)时，调用对应函数
      },
      get() {
        return val;
      },
    });
  },

  /**
   * 页面跳转
   */
  $navigateTo(event) {
    wx.navigateTo({
      url: event.currentTarget.dataset.url,
    });
  },

  $stopPropagation() {},
};

// 生命周期
const lifeCycle = {
  onLoad: {
    before() {
      this.$setWatcher(this.data, this.watch); // 设置监听器
    },
  },

  onShow: {
    before() {
      wx.hideHomeButton && wx.hideHomeButton();
    },
  },
};

let local = {
  getLifeCycle(rewriteList, lifeCycle, pageConfig) {
    let config = {};
    rewriteList.forEach((i) => {
      if (i in pageConfig) {
        config[i] = function () {
          i in lifeCycle && 'before' in lifeCycle[i] && lifeCycle[i].before.call(this, ...arguments);
          pageConfig[i].call(this, ...arguments);
          i in lifeCycle && 'after' in lifeCycle[i] && lifeCycle[i].after.call(this, ...arguments);
        };
      }
    });

    return config;
  },
};

let $pageMixin = function (pageConfig) {
  let rewriteList = [
    'onLoad', // 生命周期函数--监听页面加载
  ];

  let lifeConfig = local.getLifeCycle(rewriteList, lifeCycle, pageConfig);

  let baseConfig = {
    data,
    ...methods,
  };

  return $extend({}, baseConfig, pageConfig, lifeConfig);
};

module.exports = {
  _,
  $pageMixin,
  $extend,
};
