/**
 * 请求方法
 */

const appSession = require('./app-session.js');
const underscore = require('./underscore-extend.js');
const servicesConfig = require('../config/services-config.js');
const CONSTANTS = require('../config/constants.js');

/* 基础通信参数  */
const _authClient = function () {
    const deviceId = "miniprogram";

    const auth = {
        authParams: {
            timestamp: new Date().getTime(),
            deviceId: deviceId,
        },
        clientParams: {
            os: "mini",
            network: "",
            deviceId: deviceId,
            appVersion: CONSTANTS.APP_VERSION
        },
        openId: appSession.getUserInfoByKey("openId") || '',
        appId: CONSTANTS.APP_ID,
        areaCode: CONSTANTS.AREA_CODE,
        miniId: CONSTANTS.MINI_ID
    };

    return auth;
};

/**
 * 获取service
 * @param {Object} params
 */
const _getInterfaceUrl = function (params) {
    let interfaceUrl;
    if (!params.otherParams) {
        return servicesConfig[params["service"]];
    }
    for (let key in params.otherParams) {
        interfaceUrl = (interfaceUrl || servicesConfig[params["service"]]).replace("{" + key + "}", params.otherParams[key]);
    }

    return interfaceUrl;
};

const _addUrlParam = function (data) {

    let postData = "";
    for (let key in data) {
        if (!postData) {
            postData = "?" + key + "=" + data[key];
        } else {
            postData += "&" + key + "=" + data[key];
        }
    }

    return postData;
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
    postJson: function (params) {

        let authClient = _authClient();

        // 默认参数
        let defaultParams = {
            service: "", // 服务的配置名称
            success: function (d) {}, // 成功后回调
            error: null, // 失败后回调
            autoShowWait: false, // 自动显示菊花
            loadingText: "加载中...", // 加载的提示语
            autoCloseWait: true, // 自动关闭菊花
            headers: {
                "base-params": JSON.stringify(authClient),
                "Authorization": appSession.getToken() ? ("Bearer " + appSession.getToken()) : ""
            },
            isAsync: true
        };
        let ajaxParams = underscore.deepExtend(true, defaultParams, params);
        // rest请求路径
        ajaxParams["url"] = CONSTANTS["SERVICE_URL"] + _getInterfaceUrl(ajaxParams);
        if ((ajaxParams.type == "GET" || ajaxParams.type == "DELETE") && ajaxParams.data && typeof (ajaxParams.data) == "object") {
            ajaxParams["url"] = ajaxParams["url"] + _addUrlParam(ajaxParams.data);
        }



        // 是否展示loading
        if (ajaxParams.autoShowWait && wx.showLoading) {
            wx.showLoading({
                title: ajaxParams.loadingText,
                mask: true
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
                    let message = '有点忙开个小差，稍后再试~';
                    if (ajaxParams.error) {
                        ajaxParams.error(message, res);
                    } else {
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
                let message = '有点忙开个小差，稍后再试~';
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
                if (ajaxParams.autoShowWait && wx.hideLoading) {
                    wx.hideLoading();
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
            type: "DOWN" // DOWN UP
        };
    },

    // 下拉
    scrollDown: "DOWN",
    // 上拉
    scrollUp: "UP"
};

module.exports = appAjax;