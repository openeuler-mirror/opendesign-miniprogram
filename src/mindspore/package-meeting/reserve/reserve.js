// pages/reserve/reserve.js
const appAjax = require('./../../utils/app-ajax');
const appSession = require('./../../utils/app-session.js');
const utils = require('./../../utils/utils.js');
utils.formateDate();

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
  getUserCityList: function (keyword, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'GROUP_USER_CITY',
      otherParams: {
        id: keyword,
      },
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
    if (!that.data.typeMeeting) {
      this.toast('请选择会议类型');
      return;
    }
    if (that.data.meeting_type === 1 && !that.data.sigResult) {
      this.toast('请选择所在SIG');
      return;
    }
    if (that.data.meeting_type === 2 && !that.data.msgResult) {
      this.toast('请选择所在城市');
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
    if (!that.data.end) {
      this.toast('请选择结束时间');
      return;
    }
    if (new Date() > new Date(`${that.data.date} ${that.data.start}`.replace(/-/g, '/'))) {
      this.toast('会议时间已过，请正确选择');
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
    record: true,
    topic: '',
    sponsor: '',
    date: '',
    start: '',
    end: '',
    meetingType: 'tencent',
    typeList: ['腾讯会议', 'WeLink（蓝版）'],
    etherpad: '',
    agenda: '',
    emaillist: '',
    sigPopShow: false,
    msgPopShow: false,
    typeResult: '',
    typeMeeting: '',
    group_name: '',
    city: '',
    meeting_type: 1,
    sigResult: '',
    msgResult: '',
    sigList: [],
    msgList: [],
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
    isSig: false,
    isMSG: false,
    showMeetType: false,
    allData: [],
    techEtherpad: '',
    typeKey: '',
    type: {
      Tech: '专家委员会',
      MSG: 'MSG会议',
      SIG: 'SIG会议',
    },
    msgListAll: [],
    sigListAll: [],
    permission: [],
    tipsType: '',
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 15 === 0);
      }

      return options;
    },
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    this.setData({
      sponsor: (await appSession.getUserInfoByKey('gitee')) || '',
    });
    let that = this;
    remoteMethods.getUserGroup(await appSession.getUserInfoByKey('userId'), async function (data) {
      let permissionTemp = [];
      if (data?.length) {
        that.setData({
          allData: data,
        });
        let sigListAll = [];
        let sigList = [];
        data.forEach((item) => {
          if (Number(item.group_type) === 3) {
            permissionTemp.push('Tech');
            that.setData({
              techEtherpad: item.etherpad,
            });
          } else if (Number(item.group_type) === 2) {
            permissionTemp.push('MSG');
          } else if (Number(item.group_type) === 1) {
            item.name = item.group_name;
            permissionTemp.push('SIG');
            sigList.push(item.group_name);
            sigListAll.push(item);
          }
        });
        permissionTemp = [...new Set(permissionTemp)];
        that.setData({
          permission: permissionTemp,
          sigListAll: sigListAll,
          sigList: sigList,
        });
        remoteMethods.getUserCityList(await appSession.getUserInfoByKey('userId'), function (data) {
          if (data?.length) {
            permissionTemp.push('MSG');
          }
          let tempList = [];
          data.forEach((item) => {
            item.name = item.city_name;
            tempList.push(item.city_name);
          });
          that.setData({
            msgListAll: data,
            msgList: tempList,
            permission: permissionTemp,
          });
        });
      }
    });
  },
  recordoOnChange: function (event) {
    this.setData({
      record: event.detail,
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
      privacyState: false,
      topic: '',
      typeResult: '',
      sigResult: '',
      msgResult: '',
      date: '',
      start: '',
      end: '',
      etherpad: '',
      agenda: '',
      emaillist: '',
      record: '',
      meetingType: 'tencent',
    });
  },
  meeting: function () {
    if (!localMethods.validation(this)) {
      return;
    }
    let that = this;
    wx.requestSubscribeMessage({
      // 消息订阅模板
      tmplIds: ['tK51rqE72oFo5e5ajCnvkPwnsCncfydgcV1jb9ed6Qc'],
      success() {},
      complete() {
        let param = {
          topic: that.data.topic,
          sponsor: that.data.sponsor,
          platform: that.data.meetingType,
          group_name: that.data.group_name,
          date: that.data.date,
          start: that.data.start,
          end: that.data.end,
          etherpad: that.data.etherpad,
          meeting_type: that.data.meeting_type,
          emaillist: that.data.emaillist,
          record: that.data.record ? 'cloud' : '',
          agenda: that.data.agenda,
        };
        if (that.data.meeting_type === 2) {
          param.city = that.data.city;
        }
        remoteMethods.saveMeeting(param, function (data) {
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
        });
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
    this.data.sigListAll.forEach((item) => {
      if (item.name === this.data.sigResult) {
        this.setData({
          etherpad: item.etherpad,
          sigPopShow: false,
          group_name: item.name,
          city: '',
        });
      }
    });
  },
  msgConfirm: function () {
    this.data.msgListAll.forEach((item) => {
      if (item.name === this.data.msgResult) {
        this.setData({
          etherpad: item.etherpad,
          msgPopShow: false,
          city: this.data.msgResult,
          group_name: 'MSG',
        });
      }
    });
  },
  onTypeShow: function () {
    this.setData({
      typeShow: true,
    });
  },
  platformTypeCancel: function () {
    this.setData({
      typeShow: false,
    });
  },
  platformTypeConfirm: function () {
    this.setData({
      typeShow: false,
    });
  },
  radioOnChange(e) {
    this.setData({
      meetingType: e.detail,
    });
  },
  typeConfirm: function () {
    this.setData({
      typeMeeting: this.data.type[this.data.typeKey],
    });
    if (this.data.typeKey === 'Tech') {
      if (this.data.permission.includes(this.data.typeKey)) {
        this.setData({
          showMeetType: false,
          meeting_type: 3,
          isSig: false,
          isMSG: false,
          city: '',
          group_name: 'Tech',
          etherpad: this.data.techEtherpad,
          sigResult: '',
          msgResult: '',
          tipsType: 'Tech',
        });
      } else {
        this.setData({
          showDialogWarn: true,
          tipsType: 'Tech',
        });
      }
    } else if (this.data.typeKey === 'SIG') {
      if (this.data.permission.includes(this.data.typeKey)) {
        this.setData({
          showMeetType: false,
          isMSG: false,
          isSig: true,
          meeting_type: 1,
          etherpad: '',
          sigResult: '',
          msgResult: '',
          tipsType: 'SIG',
        });
      } else {
        this.setData({
          showDialogWarn: true,
          tipsType: 'SIG',
        });
      }
    } else if (this.data.typeKey === 'MSG') {
      if (this.data.permission.includes(this.data.typeKey)) {
        this.setData({
          showMeetType: false,
          isSig: false,
          meeting_type: 2,
          isMSG: true,
          etherpad: '',
          sigResult: '',
          msgResult: '',
          tipsType: 'MSG',
        });
      } else {
        this.setData({
          showDialogWarn: true,
          tipsType: 'MSG',
        });
      }
    }
  },
  dateConfirm: function () {
    this.setData({
      date: new Date(this.data.currentDate).Format('yyyy-MM-dd'),
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

  typeRadioOnChange: function (e) {
    this.setData({
      typeKey: e.detail,
    });
  },
  sigRadioOnChange: function (e) {
    this.setData({
      sigResult: e.detail,
    });
  },
  msgRadioOnChange: function (e) {
    this.setData({
      msgResult: e.detail,
    });
  },
  selType: function () {
    this.setData({
      showMeetType: true,
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
  selMSG: function () {
    if (!this.data.msgList.length) {
      this.setData({
        showDialogWarn: true,
      });
      return;
    }
    this.setData({
      msgPopShow: true,
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
      sigResult: '',
    });
  },
  msgCancel: function () {
    this.setData({
      msgPopShow: false,
      msgResult: '',
    });
  },
  typeCancel: function () {
    this.setData({
      showMeetType: false,
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
  copyWechat() {
    wx.setClipboardData({
      data: 'mindspore0328',
      success: () => {
        this.setData({
          showDialogWarn: false,
          tipsType: '',
          typeMeeting: '',
          isSig: false,
          isMSG: false,
        });
      },
    });
  },
});
