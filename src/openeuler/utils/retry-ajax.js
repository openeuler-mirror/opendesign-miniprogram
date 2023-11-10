const appAjax = require('./app-ajax');

class ajaxRetry {
  constructor({ url, getRefreshToken, unauthorizedCode = 401, onSuccess, onError }) {
    this.url = url;
    this.getRefreshToken = getRefreshToken;
    this.unauthorizedCode = unauthorizedCode;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  requestWrapper(request) {
    return new Promise((resolve, reject) => {
      // 先把请求函数保存下来
      const requestFn = request;
      return request()
        .then(resolve)
        .catch((err) => {
            console.log(err);
          if (err?.status === this.unauthorizedCode && !(err?.config?.url === this.url)) {
            if (!this.fetchNewTokenPromise) {
              this.fetchNewTokenPromise = this.fetchNewToken();
            }
            this.fetchNewTokenPromise
              .then(() => {
                // 获取token成功后，重新执行请求
                requestFn().then(resolve).catch(reject);
              })
              .finally(() => {
                // 置空
                this.fetchNewTokenPromise = null;
              });
          } else {
            reject(err);
          }
        });
    });
  }
  // 获取token的函数
  refreshToken() {
    appAjax.postJson({
      type: 'POST',
      service: this.url,
      success: function () {
        this.onSuccess;
      },
      fail: function () {
        this.onError();
        return Promise.reject();
      },
    });
  }
  //   fetchNewToken() {
  //     return new Axios()
  //       .get(this.url, {
  //         headers: {
  //           Authorization: this.getRefreshToken(),
  //         },
  //       })
  //       .then(this.onSuccess)
  //       .catch(() => {
  //         this.onError();
  //         return Promise.reject();
  //       });
  //   }
}
module.exports = ajaxRetry;
