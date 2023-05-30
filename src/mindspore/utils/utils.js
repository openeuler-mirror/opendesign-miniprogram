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
   * 获取时间差(小于一天)
   * @param {Object} startTime 开始时间    long  毫秒数
   * @param {Object} endTime   结束时间    long  毫秒数
   * return {
   * 	"days"    : days,
   *	"hours"   : hours,
   *	"minutes" : minutes,
   *	"seconds" : seconds
   * }
   */
  getDiffTime: function (startTime, endTime) {
    // 相差时间
    let diffTime = endTime - startTime;
    if (diffTime <= 0) {
      return false;
    }
    // 计算出相差天数
    let days = Math.floor(diffTime / (24 * 3600 * 1000));
    // 计算出小时数
    let leave1 = diffTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    let hours = Math.floor(leave1 / (3600 * 1000));
    // 计算相差分钟数
    let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave2 / (60 * 1000));
    // 计算相差秒数
    let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    let seconds = Math.round(leave3 / 1000);

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  },

  /**
   * 返回定时器格式（若天和小时为0则隐藏天和小时）
   * @param {Object} time
   */
  getTiktokStr: function (time) {
    let str = time.seconds + '秒';
    if (time.days != 0) {
      str = time.days + '天' + time.hours + '小时' + time.minutes + '分钟' + str;
    } else if (time.hours != 0) {
      str = time.hours + '小时' + time.minutes + '分钟' + str;
    } else if (time.minutes != 0) {
      str = time.minutes + '分钟' + str;
    }
    return str;
  },

  /**
   * 倒计时方法
   * @param {Object} startTime  long 开始时间
   * @param {Object} endTime    long 结束时间
   * @param {Object} renderFunc 回调渲染函数
   * @param {Object} endFunc    倒计时结束回调函数
   */
  intervalTime: function (startTime, endTime, renderFunc, endFunc) {
    if (!startTime || !endTime) {
      return;
    }
    startTime = parseInt(startTime);
    endTime = parseInt(endTime);

    let that = this;

    let diffTime = that.getDiffTime(startTime, endTime);
    diffTime = that.getTiktokStr(diffTime);
    renderFunc && renderFunc(diffTime);
    startTime += 1000;

    let interval = setInterval(function () {
      diffTime = that.getDiffTime(startTime, endTime);
      if (diffTime) {
        startTime += 1000;
        diffTime = that.getTiktokStr(diffTime);
        renderFunc && renderFunc(diffTime);
      } else {
        clearInterval(interval);
        endFunc && endFunc();
      }
    }, 1000);
  },

  /**
   * 判断对象是否为空
   */
  isEmptyObject: function (obj) {
    let t;
    for (t in obj) {
      return false;
    }
    return true;
  },

  /**
   * 获取当前页面url
   */
  getCurrentUrl: function () {
    let pageStack = getCurrentPages();
    let thisPage = pageStack[pageStack.length - 1];

    let baseUrl = thisPage.route;
    let paramObj = thisPage.options;
    let params = '';

    if (this.isEmptyObject(paramObj)) {
      return baseUrl;
    } else {
      for (let i in paramObj) {
        if (params.indexOf('?') >= 0) {
          params += '&';
        } else {
          params += '?';
        }
        params += i + '=' + paramObj[i];
      }
    }

    return baseUrl + params;
  },

  /**
   * 替换html特殊字符串
   */
  replaceHtmlString: function (str) {
    str = str.replace(/&nbsp;/g, ' ');
    return str;
  },

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

  /**
   * 静态资源定时清理缓存用的后缀
   */
  resourceSuffix: function () {
    let randomStr = '?' + new Date().getTime().toString().slice(0, 7) + '000000';
    return randomStr;
  },

  /**
   * 资讯跳转方法（文章、图集）
   * @param {Object} options
   * 		jumpType:跳转方法名,
   * 		infoType：资讯类型1文章  2图集  3视频  4链接(不支持),
   * 		id:资讯详情id
   */
  jumpToInfo: function (options) {
    let id = options.id ? options.id : '';
    let type = options.infoType ? options.infoType : 1;
    let jumpType =
      options.jumpType && options.jumpType in wx && typeof wx[options.jumpType] == 'function'
        ? options.jumpType
        : 'navigateTo';

    // 1文章  2图集  3视频  4链接(不支持)
    let infoConfig = {
      1: '/pages/discovery/info',
      2: '/pages/discovery/picture-info',
    };

    let path = type in infoConfig ? infoConfig[type] + '?id=' + id : infoConfig[1] + '?id=' + id;

    wx[jumpType]({
      url: path,
    });
  },
};

module.exports = utils;
