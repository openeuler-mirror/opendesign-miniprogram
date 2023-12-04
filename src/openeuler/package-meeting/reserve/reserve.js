// pages/reserve/reserve.js
const appAjax = require('./../../utils/app-ajax');
const appSession = require('./../../utils/app-session.js');
const { formateDate } = require('./../../utils/utils.js');
const { MEETING_START_TEMPLATE } = require('../../utils/config');

let remoteMethods = {
  getUserGroup: function (id, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GET_USER_GROUP',
      otherParams: {
        id: id,
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  saveMeeting: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      service: 'SAVE_MEETING',
      data: postData,
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
};
let localMethods = {
  validation: function (that) {
    if (!that.data.topic) {
      this.toast('请输入会议名称');
      return;
    }
    if (!that.data.sponsor) {
      this.toast('请联系管理员编辑您的gitee name');
      return;
    }
    if (!that.data.groupId) {
      this.toast('请选择所属SIG');
      return;
    }
    if (!that.data.date) {
      this.toast('请选择日期');
      return;
    }
    if (!that.data.start) {
      this.toast('请选择开始时间');
      return;
    }
    if (new Date() > new Date(`${that.data.date} ${that.data.start}`.replace(/-/g, '/'))) {
      this.toast('会议时间已过，请正确选择');
      return;
    }
    if (!that.data.end) {
      this.toast('请选择结束时间');
      return;
    }
    if (
      that.data.start.split(':')[0] > that.data.end.split(':')[0] ||
      (that.data.start.split(':')[0] === that.data.end.split(':')[0] &&
        that.data.start.split(':')[1] >= that.data.end.split(':')[1])
    ) {
      this.toast('开始时间必须小于结束时间');
      return;
    }
    if (!that.data.etherpad) {
      this.toast('etherpad地址不能为空');
      return;
    }
    const regex = /^https:\/\/etherpad/;
    if (!regex.test(that.data.etherpad)) {
      this.toast('请正确填写etherpad');
      return;
    }
    if (that.data.emaillist?.includes('；')) {
      this.toast('多个邮箱请使用英文分号分割');
      return;
    }
    const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailArray = that.data.emaillist.split(';');
    for (let i = 0; i < emailArray.length; i++) {
      let email = emailArray[i].trim();
      if (email && !mailRegex.test(email)) {
        this.toast(`${email}不是一个有效的邮箱地址`);
        return;
      }
    }
    if (!that.data.privacyState) {
      this.toast('请先阅读并同意隐私声明');
      return;
    }
    const regexHttp = /(http:\/\/|https:\/\/|www.)/;
    if (regexHttp.test(that.data.topic) || regexHttp.test(that.data.agenda)) {
      this.toast('输入内容中禁止包含链接');
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
  /**
   * 页面的初始数据
   */
  data: {
    privacyState: false,
    record: false,
    sendDev: false,
    meetingType: 'zoom',
    typeList: ['Zoom', 'WeLink（蓝版）', '腾讯会议'],
    topic: '',
    sponsor: '',
    groupName: '',
    groupId: '',
    date: '',
    start: '',
    end: '',
    etherpad: '',
    sigEmail: '',
    agenda: '',
    emaillist: '',
    sigPopShow: false,
    sigResult: '',
    sigList: [],
    datePopShow: false,
    curDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    timePopShow: false,
    currentTime: '08:00',
    minTime: 8,
    maxTime: 22,
    endTimePopShow: false,
    currentEndTime: '08:00',
    minEndTime: 8,
    maxEndTime: 22,
    showDialogWarn: false,
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 15 === 0);
      }

      return options;
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  recordoOnChange: function (event) {
    this.setData({
      record: event.detail,
    });
  },
  devOnChange: function (event) {
    this.setData({
      sendDev: event.detail,
    });
  },
  toPrivacy() {
    wx.navigateTo({
      url: '/package-my/my/privecy',
    });
  },
  privacyStateOnChange: function (event) {
    this.setData({
      privacyState: event.detail,
    });
  },
  reset: function () {
    this.setData({
      topic: '',
      groupName: '',
      group_name: '',
      group_id: '',
      groupId: '',
      date: '',
      start: '',
      end: '',
      etherpad: '',
      agenda: '',
      emaillist: '',
      meetingType: 'zoom',
      privacyState: false,
      sendDev: false,
    });
  },
  meeting: function () {
    if (!localMethods.validation(this)) {
      return;
    }
    let that = this;
    wx.requestSubscribeMessage({
      tmplIds: [MEETING_START_TEMPLATE],
      success() {
        that.data.emaillist.replace(/；/g, ';');
        let email = null;
        if (that.data.sendDev) {
          email = that.data.emaillist ? `${that.data.emaillist};dev@openeuler.org;` : 'dev@openeuler.org;';
          email.replace(';;', ';');
        } else {
          email = that.data.emaillist;
        }
        remoteMethods.saveMeeting(
          {
            topic: that.data.topic,
            sponsor: that.data.sponsor,
            group_name: that.data.groupName,
            group_id: that.data.groupId,
            date: that.data.date,
            start: that.data.start,
            end: that.data.end,
            platform: that.data.meetingType,
            etherpad: that.data.etherpad,
            agenda: that.data.agenda,
            emaillist: email,
            record: that.data.record ? 'cloud' : '',
            agree: that.data.privacyState,
          },
          function (data) {
            if (data.id) {
              wx.redirectTo({
                url: '/package-meeting/meeting/meeting-success?id=' + data.id,
              });
            } else {
              setTimeout(function () {
                wx.showToast(
                  {
                    title: data.message,
                    icon: 'none',
                    duration: 2000,
                  },
                  100
                );
              });
            }
          }
        );
      },
    });
  },
  sigNameInput: function (e) {
    this.setData({
      topic: e.detail.value,
    });
  },
  etherInput: function (e) {
    this.setData({
      etherpad: e.detail.value,
    });
  },
  agendaInput: function (e) {
    this.setData({
      agenda: e.detail.value,
    });
  },
  emailInput: function (e) {
    this.setData({
      emaillist: e.detail.value,
    });
  },
  sigConfirm: function () {
    let that = this;
    let sigObj = this.data.sigList.filter(function (item) {
      return item.group === that.data.sigResult;
    });
    sigObj = sigObj.length ? sigObj[0] : {};
    sigObj.maillist === 'dev@openeuler.org' ? (sigObj.maillist = '') : (sigObj.maillist = `${sigObj.maillist};`);
    this.setData({
      groupName: sigObj.group_name || '',
      groupId: sigObj.group || '',
      etherpad: sigObj.etherpad || '',
      emaillist: sigObj.maillist || '',
      sigPopShow: false,
    });
  },
  dateConfirm: function () {
    this.setData({
      date: formateDate(new Date(this.data.currentDate), 'yyyy-MM-dd'),
      datePopShow: false,
    });
  },
  timeConfirm: function () {
    this.setData({
      start: this.data.currentTime,
      timePopShow: false,
    });
  },
  endTimeConfirm: function () {
    this.setData({
      end: this.data.currentEndTime,
      endTimePopShow: false,
    });
  },
  onTypeShow: function () {
    this.setData({
      typeShow: true,
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
  typeRadioOnChange: function (e) {
    this.setData({
      meetingType: e.detail,
    });
  },
  radioOnChange(e) {
    this.setData({
      meetingType: e.detail,
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    this.setData({
      sponsor: (await appSession.getUserInfoByKey('gitee')) || '',
    });
    let that = this;
    remoteMethods.getUserGroup(await appSession.getUserInfoByKey('userId'), function (data) {
      if (data && data.length) {
        that.setData({
          sigList: data,
        });
      }
    });
  },
  sigRadioOnChange: function (e) {
    this.setData({
      sigResult: e.detail,
    });
  },

  selSig: function () {
    if (!this.data.sigList.length) {
      this.setData({
        showDialogWarn: true,
      });
      return;
    }
    this.setData({
      sigPopShow: true,
    });
  },
  warnCancel: function () {
    this.setData({
      showDialogWarn: false,
    });
  },
  sigCancel: function () {
    this.setData({
      sigPopShow: false,
    });
  },
  selDate: function () {
    this.setData({
      datePopShow: true,
    });
  },
  selTime: function () {
    this.setData({
      timePopShow: true,
    });
  },
  selEndTime: function () {
    this.setData({
      endTimePopShow: true,
    });
  },
  dateCancel: function () {
    this.setData({
      datePopShow: false,
    });
  },
  timeCancel: function () {
    this.setData({
      timePopShow: false,
    });
  },
  endTimeCancel: function () {
    this.setData({
      endTimePopShow: false,
    });
  },
  dateOnInput: function (e) {
    this.setData({
      currentDate: e.detail,
    });
  },
  timeOnInput: function (e) {
    this.setData({
      currentTime: e.detail,
    });
  },
  endTimeOnInput: function (e) {
    this.setData({
      currentEndTime: e.detail,
    });
  },
});
