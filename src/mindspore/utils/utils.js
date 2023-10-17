/**
 * 工具类
 */

let _ = require('./underscore-extend');

let utils = {
  /**
   * underscore工具库
   */
  _: _,

  /**
   * 深拷贝工具
   */
  deepExtend: _.deepExtend,

  /**
   * 添加URL的参数
   * @param name   名称
   * @param value  值
   * @param url    链接地址
   */
  addUrlParam: function (name, value, url) {
    if (!value) {
      return url;
    }

    if (url.indexOf(name + '=') > -1) {
      return url;
    }
    let tmpUrl = url;

    // 判断是否已经有其他参数
    if (tmpUrl.indexOf('?') >= 0) {
      tmpUrl += '&';
    } else {
      tmpUrl += '?';
    }
    tmpUrl += name + '=' + value;

    return tmpUrl;
  },

  /**
   * 日期格式化
   */
  formateDate: function () {
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
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
      for (let k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      return fmt;
    };
  },

  /**
   * 版本比较
   * param {string} v1 > v2 ? 1 : -1 ;  相等返回0
   */
  compareVersion: function (v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    let len = Math.max(v1.length, v2.length);

    while (v1.length < len) {
      v1.push('0');
    }

    while (v2.length < len) {
      v2.push('0');
    }

    for (let i = 0; i < len; i++) {
      let num1 = parseInt(v1[i]);
      let num2 = parseInt(v2[i]);

      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }

    return 0;
  },
};

module.exports = utils;
