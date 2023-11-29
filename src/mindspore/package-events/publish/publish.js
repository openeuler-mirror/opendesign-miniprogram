// package-events/publish/publish.js
const appAjax = require('./../../utils/app-ajax');
const { formateDate, getBetweenDateStr } = require('./../../utils/utils.js');

let that = null;
let remoteMethods = {
  addEvents: function (postData, _callback) {
    let type = 'POST';
    let service = 'PUBLISH_EVENT';
    if (that.data.detailType === 4) {
      type = 'PUT';
      service = 'EDIT_DETAIL_PUBLISH';
    }
    appAjax.postJson({
      autoShowWait: true,
      type,
      service,
      data: postData,
      otherParams: {
        id: that.data.id || '',
      },
      success: function (ret) {
        if (ret.code === 400) {
          localMethods.toast(ret.msg);
          return;
        }
        _callback && _callback(ret);
      },
    });
  },
  saveDraft: function (postData, _callback) {
    let type = 'POST';
    let service = 'SAVE_DRAFT';
    if (that.data.detailType === 4) {
      type = 'PUT';
      service = 'EDIT_DETAIL';
    } else if (that.data.detailType === 5) {
      type = 'PUT';
      service = 'EDIT_SCHEDULE';
    }
    appAjax.postJson({
      autoShowWait: true,
      type,
      service,
      data: postData,
      otherParams: {
        id: that.data.id || '',
      },
      success: function (ret) {
        if (ret.code === 400) {
          localMethods.toast(ret.msg);
          return;
        }
        _callback && _callback(ret);
      },
    });
  },
  getDraftDetail: function (_callback) {
    let service = 'DRAFT_DETAIL';
    if (that.data.detailType === 5) {
      service = 'EVENT_DETAIL';
    }
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service,
      otherParams: {
        id: that.data.id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
};
let localMethods = {
  timeValid: function (startTime, endTime) {
    function timeToMinutes(time) {
      const parts = time.split(':');
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return timeToMinutes(endTime) > timeToMinutes(startTime);
  },
  validation: function (data) {
    const urlRegex = /^https:\/\//;
    if (!data.title) {
      this.toast('请输入活动标题');
      return;
    }
    if (!data.start_date) {
      this.toast('请选择活动起始日期');
      return;
    }
    if (!data.end_date) {
      this.toast('请选择活动结束日期');
      return;
    }
    if (data.register_url?.trim() === '') {
      this.toast('请输入报名链接');
      return;
    }
    if (!urlRegex.test(data.register_url.trim())) {
      this.toast('报名链接格式错误');
      return;
    }
    if (data.activity_type === 1) {
      if (!data.address) {
        this.toast('请输入活动城市');
        return;
      }
      if (!data.detail_address) {
        this.toast('请输入具体地址');
        return;
      }
      let flag = true;
      data.schedules.forEach((dayItem) => {
        dayItem.forEach((item) => {
          if (!item.start) {
            flag = false;
          }
          if (!item.end) {
            flag = false;
          }
          if (!item.topic) {
            flag = false;
          }
          item.speakerList.forEach((item) => {
            if (!item.name) {
              flag = false;
            }
          });
        });
      });
      if (!flag) {
        this.toast('请补充日程必填信息');
        return;
      }
    } else if (data.activity_type === 2) {
      if (!data.online_url) {
        this.toast('请输入线上链接地址');
        return;
      }
      if (!urlRegex.test(data.online_url.replace(/\s+/g, ''))) {
        this.toast('线上链接格式错误');
        return;
      }
      let flag = true;
      data.schedules.forEach((dayItem) => {
        dayItem.forEach((item) => {
          if (!item.start) {
            flag = false;
          }
          if (!item.end) {
            flag = false;
          }
          if (!item.topic) {
            flag = false;
          }
          item.speakerList.forEach((item) => {
            if (!item.name) {
              flag = false;
            }
          });
        });
      });
      if (!flag) {
        this.toast('请补充填写日程必填信息');
        return;
      }
    } else {
      if (!data.address) {
        this.toast('请输入活动城市');
        return;
      }
      if (!data.detail_address) {
        this.toast('请输入具体地址');
        return;
      }
      if (!data.online_url) {
        this.toast('请输入线上链接地址');
        return;
      }
      if (!urlRegex.test(data.online_url.replace(/\s+/g, ''))) {
        this.toast('线上链接格式错误');
        return;
      }
      let flag = true;
      data.schedules.forEach((dayItem) => {
        dayItem.forEach((item) => {
          if (!item.start) {
            flag = false;
          }
          if (!item.end) {
            flag = false;
          }
          if (!item.topic) {
            flag = false;
          }
        });
      });
      if (!flag) {
        this.toast('请补充填写日程必填信息');
        return;
      }
    }
    if (!that.data.privacyState) {
      this.toast('请先阅读并同意隐私声明');
      return;
    }
    return true;
  },
  toast: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000,
    });
  },
};
Page({
  data: {
    isStar: false,
    isEnd: false,
    starTime: '',
    endTime: '',
    id: '',
    activeNames: [0],
    detailType: 0,
    title: '',
    date: '',
    type: '课程',
    form: ['1'],
    address: '',
    addressName: '',
    registerUrl: '',
    desc: '',
    betweenDay: [],
    privacyState: false,
    schedule: [
      {
        start: '',
        end: '',
        topic: '',
        speakerList: [
          {
            name: '',
            title: '',
          },
        ],
      },
    ],
    allSchedule: [],
    typeList: ['课程', 'MSG', '赛事', '其他'],
    datePopShow: false,
    timePopShow: false,
    formShow: false,
    curDate: new Date().getTime() + 24 * 60 * 60 * 1000,
    currentDate: new Date().getTime() + 24 * 60 * 60 * 1000,
    minDate: new Date().getTime() + 24 * 60 * 60 * 1000,
    startTimeIndex: 0,
    endTimeIndex: 0,
    start: '',
    end: '',
    currentTime: '08:00',
    method: 1,
    actegory: 1,
    tiemIndex: 1,
    minTime: 8,
    maxTime: 22,
    minEndTime: 8,
    maxEndTime: 22,
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 5 === 0);
      }
      return options;
    },
    endTimePopShow: false,
    currentEndTime: '08:00',
    topicSelIndex: 1,
    longitude: '',
    latitude: '',
    liveAddress: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      id: options.id,
      detailType: Number(options.type) || 0,
    });
    if ((this.data.id && this.data.detailType === 5) || (this.data.id && this.data.detailType === 4)) {
      remoteMethods.getDraftDetail((res) => {
        res.activity_type === 3 ? (res.activity_type = ['1', '2']) : (res.activity_type = [`${res.activity_type}`]);
        try {
          this.setData({
            title: res.title,
            starTime: res.start_date,
            endTime: res.end_date,
            actegory: res.activity_category,
            form: res.activity_type,
            method: res.register_method,
            type: this.data.typeList[res.activity_category - 1],
            registerUrl: res.register_url || '',
            liveAddress: res.online_url || '',
            longitude: res.longitude || '',
            latitude: res.latitude || '',
            address: res.address || '',
            addressName: res.detail_address || '',
            desc: res.synopsis || '',
            betweenDay: getBetweenDateStr(res.start_date, res.end_date),
            topicSelIndex: res.poster,
            allSchedule: JSON.parse(res.schedules),
            privacyState: true,
          });
        } catch {
          wx.showToast({
            title: '操作错误',
            icon: 'none',
            duration: 2000,
          });
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  privacyStateOnChange: function (event) {
    this.setData({
      privacyState: event.detail,
    });
  },
  toPrivacy() {
    wx.navigateTo({
      url: '/package-my/my/privecy',
    });
  },
  titleInput(e) {
    this.setData({
      title: e.detail.value,
    });
  },
  setStar: function () {
    this.setData({
      datePopShow: true,
      isStar: true,
    });
  },
  setEnd: function () {
    this.setData({
      datePopShow: true,
      isEnd: true,
    });
  },
  dateChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onTypeShow: function () {
    this.setData({
      typeShow: true,
    });
  },
  dateCancel: function () {
    this.setData({
      datePopShow: false,
      isStar: false,
      isEnd: false,
    });
  },
  dateOnInput: function (e) {
    this.setData({
      currentDate: e.detail,
    });
  },
  dateConfirm: function () {
    let time = formateDate(new Date(this.data.currentDate), 'yyyy-MM-dd');
    let between = [];
    if (this.data.isStar) {
      if (this.data.endTime) {
        between = getBetweenDateStr(time, this.data.endTime);
        if (between) {
          let allSchedule = [];
          for (let i = 0; i < between.length; i++) {
            allSchedule.push([
              {
                start: '',
                end: '',
                topic: '',
                speakerList: [
                  {
                    name: '',
                    title: '',
                  },
                ],
              },
            ]);
          }
          between.length > 10
            ? localMethods.toast('暂只支持10天以内活动')
            : this.setData({
                starTime: time,
                betweenDay: between,
                allSchedule: allSchedule,
              });
        } else {
          localMethods.toast('结束日期应大于等于开始日期');
        }
      } else {
        this.setData({
          starTime: time,
        });
      }
    } else if (this.data.starTime) {
      between = getBetweenDateStr(this.data.starTime, time);
      if (between) {
        let allSchedule = [];
        for (let i = 0; i < between.length; i++) {
          allSchedule.push([
            {
              start: '',
              end: '',
              topic: '',
              speakerList: [
                {
                  name: '',
                  title: '',
                },
              ],
            },
          ]);
        }
        between.length > 10
          ? localMethods.toast('暂只支持10天以内活动')
          : this.setData({
              endTime: time,
              betweenDay: between,
              allSchedule: allSchedule,
            });
      } else {
        localMethods.toast('请正确填写日期');
      }
    } else {
      this.setData({
        endTime: time,
      });
    }
    this.setData({
      datePopShow: false,
      isStar: false,
      isEnd: false,
    });
  },
  radioOnChange(e) {
    this.setData({
      form: e.detail,
    });
  },
  typeRadioOnChange: function (e) {
    this.setData({
      type: e.detail,
    });
  },
  typeClick(e) {
    this.setData({
      actegory: e.currentTarget.dataset.index,
    });
  },
  addSpeaker(e) {
    const length =
      this.data.allSchedule[e.currentTarget.dataset.dayindex][e.currentTarget.dataset.index].speakerList.length;
    const key = `allSchedule[${e.currentTarget.dataset.dayindex}][${e.currentTarget.dataset.index}].speakerList[${length}]`;
    this.setData({
      [key]: {
        name: '',
        title: '',
      },
    });
  },
  radioClick(e) {
    this.setData({
      method: e.currentTarget.dataset.index,
    });
  },
  selAddress() {
    wx.showModal({
      title: '提示',
      content: '即将唤起腾讯地图，是否同意？',
      success(res) {
        if (res.confirm) {
          wx.chooseLocation({
            success: function (res) {
              that.setData({
                address: res.address,
                addressName: res.name,
                longitude: res.longitude.toFixed(5),
                latitude: res.latitude.toFixed(5),
              });
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                icon: 'none',
                duration: 2000,
              });
            },
          });
        } else if (res.cancel) {
          return false;
        }
      },
    });
  },
  addressNameInput(e) {
    this.setData({
      addressName: e.detail.value,
    });
  },
  registerUrlInput(e) {
    this.setData({
      registerUrl: e.detail.value,
    });
  },
  descInput(e) {
    this.setData({
      desc: e.detail.value,
    });
  },
  scheduleTitleInput(e) {
    const key = `allSchedule[${e.currentTarget.dataset.dayindex}][${e.currentTarget.dataset.index}].topic`;
    this.setData({
      [key]: e.detail.value,
    });
  },
  nameInput(e) {
    const key = `allSchedule[${e.currentTarget.dataset.dayindex}][${e.currentTarget.dataset.outindex}].speakerList[${e.currentTarget.dataset.innerindex}].name`;
    this.setData({
      [key]: e.detail.value,
    });
  },
  speakerTitleInput(e) {
    const key = `allSchedule[${e.currentTarget.dataset.dayindex}][${e.currentTarget.dataset.outindex}].speakerList[${e.currentTarget.dataset.innerindex}].title`;
    this.setData({
      [key]: e.detail.value,
    });
  },
  speakerInput(e) {
    const key = `allSchedule[${e.currentTarget.dataset.dayindex}][${e.currentTarget.dataset.index}].speaker`;
    this.setData({
      [key]: e.detail.value,
    });
  },
  scheduleDescInput(e) {
    const key = `allSchedule[${e.currentTarget.dataset.dayindex}][${e.currentTarget.dataset.index}].desc`;
    this.setData({
      [key]: e.detail.value,
    });
  },
  addSchedule(e) {
    let arrTemp = this.data.allSchedule;
    let index = e.currentTarget.dataset.index;
    arrTemp[index].push({
      start: '',
      end: '',
      topic: '',
      speakerList: [],
    });
    this.setData({
      allSchedule: arrTemp,
    });
  },
  delSchedule(e) {
    let index = e.currentTarget.dataset.index;
    let arrTemp = this.data.allSchedule;
    arrTemp[e.currentTarget.dataset.dayindex].splice(index, 1);
    this.setData({
      allSchedule: arrTemp,
    });
  },
  delSpeaker(e) {
    let arrTemp = this.data.allSchedule[e.currentTarget.dataset.index][e.currentTarget.dataset.outindex].speakerList;
    let key = `allSchedule[${e.currentTarget.dataset.index}][${e.currentTarget.dataset.outindex}].speakerList`;
    arrTemp.splice(e.currentTarget.dataset.innerindex, 1);
    this.setData({
      [key]: arrTemp,
    });
  },
  selTime: function (e) {
    this.setData({
      tiemIndex: e.currentTarget.dataset.dayindex,
      timePopShow: true,
      startTimeIndex: e.currentTarget.dataset.index,
    });
  },
  timeCancel: function () {
    this.setData({
      timePopShow: false,
    });
  },
  timeOnInput: function (e) {
    this.setData({
      currentTime: e.detail,
    });
  },
  timeConfirm: function () {
    const key = `allSchedule[${this.data.tiemIndex}][${this.data.startTimeIndex}].start`;
    this.setData({
      [key]: this.data.currentTime,
      timePopShow: false,
    });
  },
  typeCancel: function () {
    this.setData({
      typeShow: false,
    });
  },
  typeConfirm: function () {
    this.setData({
      typeShow: false,
    });
  },
  selEndTime: function (e) {
    this.setData({
      tiemIndex: e.currentTarget.dataset.dayindex,
      endTimePopShow: true,
      endTimeIndex: e.currentTarget.dataset.index,
    });
  },
  endTimeOnInput: function (e) {
    this.setData({
      currentEndTime: e.detail,
    });
  },
  endTimeConfirm: function () {
    const key = `allSchedule[${this.data.tiemIndex}][${this.data.endTimeIndex}].end`;
    this.setData({
      [key]: this.data.currentEndTime,
      endTimePopShow: false,
    });
  },
  endTimeCancel: function () {
    this.setData({
      endTimePopShow: false,
    });
  },
  selTop(e) {
    this.setData({
      topicSelIndex: e.currentTarget.dataset.index,
    });
  },
  liveAddressInput(e) {
    this.setData({
      liveAddress: e.detail.value,
    });
  },
  publish() {
    let postData = {};
    if (this.data.form.length === 0) {
      localMethods.toast('请选择活动类型');
      return false;
    }
    if (this.data.form[0] - 0 === 1 && this.data.form.length !== 2) {
      postData = {
        title: this.data.title,
        activity_category: this.data.actegory,
        activity_type: 1,
        register_method: this.data.method,
        register_url: this.data.registerUrl,
        start_date: this.data.starTime,
        detail_address: this.data.addressName,
        end_date: this.data.endTime,
        synopsis: this.data.desc,
        address: this.data.address,
        longitude: this.data.longitude,
        latitude: this.data.latitude,
        poster: this.data.topicSelIndex,
        schedules: this.data.allSchedule,
      };
    } else if (this.data.form[0] - 0 === 2 && this.data.form.length !== 2) {
      postData = {
        title: this.data.title,
        activity_category: this.data.actegory,
        register_method: this.data.method,
        register_url: this.data.registerUrl,
        activity_type: 2,
        start_date: this.data.starTime,
        end_date: this.data.endTime,
        synopsis: this.data.desc,
        online_url: this.data.liveAddress,
        poster: this.data.topicSelIndex,
        schedules: this.data.allSchedule,
      };
    } else {
      postData = {
        title: this.data.title,
        activity_category: this.data.actegory,
        register_method: this.data.method,
        register_url: this.data.registerUrl,
        activity_type: 3,
        online_url: this.data.liveAddress,
        start_date: this.data.starTime,
        end_date: this.data.endTime,
        synopsis: this.data.desc,
        address: this.data.address,
        detail_address: this.data.addressName,
        longitude: this.data.longitude,
        latitude: this.data.latitude,
        poster: this.data.topicSelIndex,
        schedules: this.data.allSchedule,
      };
    }
    if (!localMethods.validation(postData)) {
      return;
    }
    postData.agree = true;
    remoteMethods.addEvents(postData, (res) => {
      if (res.code === 200) {
        wx.redirectTo({
          url: '/package-events/publish/success?type=2',
        });
      }
    });
  },
  saveDraft() {
    let postData = {};
    if (this.data.form[0] - 0 === 1 && this.data.form.length !== 2) {
      postData = {
        title: this.data.title,
        activity_category: this.data.actegory,
        activity_type: 1,
        register_method: this.data.method,
        register_url: this.data.registerUrl,
        start_date: this.data.starTime,
        end_date: this.data.endTime,
        synopsis: this.data.desc,
        address: this.data.address,
        detail_address: this.data.addressName,
        longitude: this.data.longitude,
        latitude: this.data.latitude,
        poster: this.data.topicSelIndex,
        schedules: this.data.allSchedule,
      };
    } else if (this.data.form[0] - 0 === 2 && this.data.form.length !== 2) {
      postData = {
        title: this.data.title,
        activity_category: this.data.actegory,
        activity_type: 2,
        register_url: this.data.registerUrl,
        register_method: this.data.method,
        start_date: this.data.starTime,
        end_date: this.data.endTime,
        synopsis: this.data.desc,
        online_url: this.data.liveAddress,
        poster: this.data.topicSelIndex,
        schedules: this.data.allSchedule,
      };
    } else {
      postData = {
        title: this.data.title,
        activity_category: this.data.actegory,
        activity_type: 3,
        register_method: this.data.method,
        register_url: this.data.registerUrl,
        online_url: this.data.liveAddress,
        start_date: this.data.starTime,
        end_date: this.data.endTime,
        synopsis: this.data.desc,
        address: this.data.address,
        detail_address: this.data.addressName,
        longitude: this.data.longitude,
        latitude: this.data.latitude,
        poster: this.data.topicSelIndex,
        schedules: this.data.allSchedule,
      };
    }
    if (!localMethods.validation(postData)) {
      return;
    }
    postData.agree = true;
    remoteMethods.saveDraft(postData, (res) => {
      if (res.code === 200) {
        wx.redirectTo({
          url: '/package-events/publish/success?type=1',
        });
      }
    });
  },
  cancelEditSchedule() {
    wx.navigateBack();
  },
  editScheduleConfirm() {
    let postData = {};
    if (this.data.form[0] - 0 === 1 && this.data.form.length !== 2) {
      postData = {
        title: this.data.title,
        activity_category: this.actegory,
        activity_type: 1,
        register_method: this.data.method,
        register_url: this.data.registerUrl,
        start_date: this.data.starTime,
        end_date: this.data.endTime,
        synopsis: this.data.desc,
        address: this.data.address,
        detail_address: this.data.addressName,
        longitude: this.data.longitude,
        latitude: this.data.latitude,
        poster: this.data.topicSelIndex,
        schedules: this.data.allSchedule,
      };
    } else if (this.data.form[0] - 0 === 2 && this.data.form.length !== 2) {
      postData = {
        title: this.data.title,
        activity_category: this.data.actegory,
        activity_type: 2,
        register_url: this.data.registerUrl,
        register_method: this.data.method,
        start_date: this.data.starTime,
        end_date: this.data.endTime,
        synopsis: this.data.desc,
        online_url: this.data.liveAddress,
        poster: this.data.topicSelIndex,
        schedules: this.data.allSchedule,
      };
    } else {
      postData = {
        title: this.data.title,
        activity_category: this.data.actegory,
        activity_type: 3,
        register_method: this.data.method,
        register_url: this.data.registerUrl,
        online_url: this.data.liveAddress,
        start_date: this.data.starTime,
        end_date: this.data.endTime,
        synopsis: this.data.desc,
        address: this.data.address,
        detail_address: this.data.addressName,
        longitude: this.data.longitude,
        latitude: this.data.latitude,
        poster: this.data.topicSelIndex,
        schedules: this.data.allSchedule,
      };
    }
    if (!localMethods.validation(postData)) {
      return;
    }
    postData.schedules = JSON.stringify(this.data.allSchedule);
    remoteMethods.saveDraft(postData, (res) => {
      if (res.code === 200) {
        wx.redirectTo({
          url: '/package-events/publish/success?type=3',
        });
      }
    });
  },
  toPoster() {
    let activityType = 0;
    if (this.data.form[0] - 0 === 1 && this.data.form.length !== 2) {
      activityType = 1;
    } else if (this.data.form[0] - 0 === 2) {
      activityType = 2;
    } else {
      activityType = 3;
    }
    const address = this.data.addressName;
    const liveAddress = this.data.liveAddress;
    wx.navigateTo({
      url: `/package-events/events/poster?title=${this.data.title}&starTime=${this.data.starTime}&endTime=${this.data.endTime}&address=${address}&poster=${this.data.topicSelIndex}&liveAddress=${liveAddress}&activity_type=${activityType}`,
    });
  },
});
