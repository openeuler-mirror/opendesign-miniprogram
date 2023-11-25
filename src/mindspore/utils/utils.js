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
      for (let k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      return fmt;
    };
  },
  /**
   * 加密存储数据 Promise 版本
   */
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
  /**
   * 获取加密数据 Promise 版本
   */
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
  /**
   * 返回两个日期之间所有日期的数组
   */
  getBetweenDateStr(starDay, endDay) {
    let startDate = new Date(starDay);
    let endDate = new Date(endDay);
    const dates = [];
    if (startDate > endDate) {
      return false;
    } else if (startDate.getTime() === endDate.getTime()) {
      const formattedDate = startDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      dates.push(formattedDate.replace(/\//g, '年').replace('-', '月') + '日');
      return dates;
    }
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const formattedDate = currentDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      dates.push(formattedDate.replace(/\//g, '年').replace('-', '月') + '日');
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  },
};

module.exports = utils;
