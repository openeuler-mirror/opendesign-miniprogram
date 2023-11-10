/**
 * 请求方法
 */

const appSession = require('./app-session.js');
const underscore = require('./underscore-extend.js');
const servicesConfig = require('../config/services-config.js');
const CONSTANTS = require('../config/constants.js');
const RETRY = require('./retry-ajax.js');

const aa = new RETRY({
  url: 'REFRESH',
  unauthorizedCode: 401,
  getRefreshToken: () => '555',
  onSuccess: (res) => {
    const accessToken = JSON.parse(res.data).accessToken;
    localStorage.setItem(LOCAL_ACCESS_KEY, accessToken);
  },
  onError: () => {
    console.log('refreshToken 过期了，乖乖去登录页');
  },
});
console.log(aa);

let remoteMethods = {
  refreshToken: function (_callback) {
    appAjax.postJson({
      type: 'POST',
      service: 'REFRESH',
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
};

/**
 * 获取service
 * @param {Object} params
 */
const _getInterfaceUrl = function (params) {
  let interfaceUrl;
  if (!params.otherParams) {
    return servicesConfig[params['service']];
  }
  for (let key in params.otherParams) {
    interfaceUrl = (interfaceUrl || servicesConfig[params['service']]).replace(
      '{' + key + '}',
      params.otherParams[key]
    );
  }
  return interfaceUrl;
};

const _addUrlParam = function (data) {
  let postData = '';
  for (let key in data) {
    if (!postData) {
      postData = '?' + key + '=' + data[key];
    } else {
      postData += '&' + key + '=' + data[key];
    }
  }

  return postData;
};
const loginQueue = [];
let isLoginning = false;

/**
 * 获取sessionId
 * 参数：undefined
 * 返回值：[promise]sessionId
 */
function getSessionId() {
  return new Promise((res, rej) => {
    // 本地sessionId缺失，重新登录
    if (!sessionId) {
      loginQueue.push({ res, rej });

      if (!isLoginning) {
        isLoginning = true;

        login()
          .then((r1) => {
            isLoginning = false;
            while (loginQueue.length) {
              loginQueue.shift().res(r1);
            }
          })
          .catch((err) => {
            isLoginning = false;
            while (loginQueue.length) {
              loginQueue.shift().rej(err);
            }
          });
      }
    } else {
      res(sessionId);
    }
  });
}

const appAjax = {
  /**
   * 提交请求
   * @param {Object} options
   * service: ""			// 接口名
   * data: "",			// 请求参数
   * otherParams: "",		// 通过url传递的参数
   * type : "",			// 请求类型
   * success: "",			// 成功回调
   * error: "",			// 失败回调
   * complete: ""			// 完成回调
   */
  postJson: function (params) {
    // 默认参数
    let defaultParams = {
      service: '', // 服务的配置名称
      success: function (d) {}, // 成功后回调
      error: null, // 失败后回调
      autoShowWait: false, // 自动显示菊花
      loadingText: '加载中...', // 加载的提示语
      autoCloseWait: true, // 自动关闭菊花
      headers: {
        Authorization: appSession.getToken() ? 'Bearer ' + appSession.getToken() : '',
      },
      isAsync: true,
    };
    let isShowToast = false;
    let ajaxParams = underscore.deepExtend(true, defaultParams, params);
    // rest请求路径
    ajaxParams['url'] = CONSTANTS['SERVICE_URL'] + _getInterfaceUrl(ajaxParams);
    if (
      (ajaxParams.type === 'GET' || ajaxParams.type === 'DELETE') &&
      ajaxParams.data &&
      typeof ajaxParams.data === 'object'
    ) {
      ajaxParams['url'] = ajaxParams['url'] + _addUrlParam(ajaxParams.data);
    }

    // 是否展示loading
    if (ajaxParams.autoShowWait && wx.showLoading) {
      wx.showLoading({
        title: ajaxParams.loadingText,
        mask: true,
      });
    }
    wx.request({
      url: ajaxParams.url,
      header: ajaxParams.headers,
      method: ajaxParams['type'] || 'POST',
      data: ajaxParams.data,
      success: function (res) {
        if (res?.data?.access && wx.getStorageSync(CONSTANTS.APP_USERINFO_SESSION)) {
          let data = wx.getStorageSync(CONSTANTS.APP_USERINFO_SESSION);
          data.access = res.data.access;
          wx.setStorageSync(CONSTANTS.APP_USERINFO_SESSION, data);
        }
        if (res.statusCode === 401) {
          wx.removeStorageSync('_app_userinfo_session');
          ajaxParams.success(0, res);
          wx.navigateTo({
            url: '/pages/auth/auth',
          });
          return;
        }
        if (res.statusCode.toString()[0] != 2) {
          let message = '';
          if (res?.data?.detail && res.statusCode === 400) {
            message = res.data.detail;
          } else if (res.statusCode === 418) {
            message = '您的请求疑似攻击行为！';
          } else {
            message = '有点忙开个小差，稍后再试~';
          }
          if (ajaxParams.error) {
            ajaxParams.error(message, res);
          } else {
            isShowToast = true;
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 2000,
            });
          }
          return;
        }
        ajaxParams.success(res.data, res);
      },
      fail: function (res) {
        if (res?.data?.access) {
          if (res.data.access && wx.getStorageSync(CONSTANTS.APP_USERINFO_SESSION)) {
            let data = wx.getStorageSync(CONSTANTS.APP_USERINFO_SESSION);
            data.access = res.data.access;
            wx.setStorageSync(CONSTANTS.APP_USERINFO_SESSION, data);
          }
        }
        let message = res?.data?.detail && res.statusCode === 400 ? res.data.detail : '有点忙开个小差，稍后再试~';
        ajaxParams.error && ajaxParams.error(message, res);
      },
      complete: function (res) {
        if (!res.errMsg.includes('ok')) {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 2000,
          });
        }
        // 关闭loading
        if (ajaxParams.autoShowWait) {
          if (isShowToast) {
            setTimeout(() => {
              wx.hideLoading();
              isShowToast = false;
            }, 2000);
          } else {
            wx.hideLoading();
          }
        }
      },
    });
  },

  /**
   * 上下拉
   */
  datalistParam: function () {
    return {
      lastdate: 0,
      pageSize: 20,
      type: 'DOWN', // DOWN UP
    };
  },

  // 下拉
  scrollDown: 'DOWN',
  // 上拉
  scrollUp: 'UP',
};

module.exports = appAjax;
