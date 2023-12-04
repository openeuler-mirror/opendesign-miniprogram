const underscore = require('./underscore-extend.js');
const servicesConfig = require('../config/services-config.js');
const CONSTANTS = require('../config/constants.js');
const sessionUtil = require('./app-session.js');
const { getStorageSync, setStorageSync } = require('./utils');

let remoteMethods = {
  refreshToken: function (refresh, _callback) {
    appAjax.postJson({
      type: 'POST',
      service: 'REFRESH',
      data: {
        refresh,
      },
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
  Object.keys(params.otherParams).forEach((key) => {
    interfaceUrl = (interfaceUrl || servicesConfig[params['service']]).replace(
      '{' + key + '}',
      params.otherParams[key]
    );
  });
  return interfaceUrl;
};

const _addUrlParam = function (data) {
  let postData = '';
  Object.keys(data).forEach((key, index) => {
    if (index === 0) {
      postData = '?' + key + '=' + data[key];
    } else {
      postData += '&' + key + '=' + data[key];
    }
  });
  return postData;
};

let messageQueue = [];
let isRefreshing = false;

const handleSuccessfulRefresh = async function (newTokens, userData) {
  userData.access = newTokens.access;
  userData.refresh = newTokens.refresh;
  await setStorageSync(CONSTANTS.APP_USERINFO_SESSION, userData);
  processMessageQueue();
  isRefreshing = false;
};

const clearUserDataAndNavigate = function () {
  messageQueue = [];
  sessionUtil.clearUserInfo();
  isRefreshing = false;
  wx.navigateTo({ url: '/pages/auth/auth' });
};

const processMessageQueue = function () {
  while (messageQueue.length) {
    appAjax.postJson(messageQueue.shift());
  }
};
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
  postJson: async function (params) {
    // 默认参数
    let storage;
    try {
      storage = await getStorageSync(CONSTANTS.APP_USERINFO_SESSION);
    } catch (error) {
      storage = null;
    }
    let defaultParams = {
      service: '', // 服务的配置名称
      success: function () {}, // 成功后回调
      error: null, // 失败后回调
      autoShowWait: false, // 自动显示loading
      loadingText: '加载中...', // 加载的提示语
      autoCloseWait: true, // 自动关闭loading
      headers: {
        Authorization: storage?.access ? 'Bearer ' + storage.access : '',
      },
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
      success: async function (res) {
        if (res?.data?.access && storage?.access) {
          storage.access = res.data.access;
          await setStorageSync(CONSTANTS.APP_USERINFO_SESSION, storage);
        }
        ajaxParams.success(res.data, res);

        if (res.statusCode.toString()[0] !== '2') {
          let message = '';
          if (res?.data?.detail && res.statusCode === 400) {
            message = res.data.detail;
          } else if (res.statusCode === 401) {
            message = '请重新登录~';
          } else if (res.statusCode === 418) {
            message = '您的请求疑似攻击行为！';
          } else {
            message = '有点忙开个小差，稍后再试~';
          }
          // 刷新token
          if (res.statusCode === 401 && storage?.access && params.service !== 'REFRESH') {
            messageQueue.push(params);
            if (!isRefreshing) {
              isRefreshing = true;
              remoteMethods.refreshToken(storage?.refresh, (res) => {
                if (!res.refresh) {
                  clearUserDataAndNavigate();
                } else {
                  handleSuccessfulRefresh(res, storage);
                }
                isRefreshing = false;
              });
            }
            return;
          }
          if (res.statusCode === 401 && !storage?.access) {
            clearUserDataAndNavigate();
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
      },
      fail: function (res) {
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
