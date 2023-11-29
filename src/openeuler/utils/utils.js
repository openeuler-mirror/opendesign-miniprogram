/**
 * 工具类
 */

let utils = {
  /**
   * 日期格式化
   */
  formateDate: function () {
    Date.prototype.Format = function (fmt) {
      let o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      Object.keys(o).forEach((k) => {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
      });
      return fmt;
    };
  },
  setStorageSync(key, data) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: key,
        data: data,
        encrypt: true,
        success: resolve,
        fail: reject,
      });
    });
  },
  getStorageSync(key) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        encrypt: true,
        success: (res) => {
          resolve(res.data);
        },
        fail: reject,
      });
    });
  },
};

module.exports = utils;
