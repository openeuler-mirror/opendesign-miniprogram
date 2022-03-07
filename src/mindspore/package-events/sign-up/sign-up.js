// package-events/sign-up/sign-up.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require('../../utils/app-session.js');
const validationConfig = require('./../../config/field-validate-rules');

let that = null;

let remoteMethods = {
  getUserInfo: function (_callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'GET',
      service: 'APPLICANT_INFO',
      otherParams: {
        id: sessionUtil.getUserInfoByKey('userId'),
      },
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
  signUp: function (postData, _callback) {
    appAjax.postJson({
      autoShowWait: true,
      type: 'POST',
      data: postData,
      service: 'SAVE_SIGNUP_INFO',
      success: function (ret) {
        _callback && _callback(ret);
      },
    });
  },
};

let localMethods = {
  validation() {
    if (!that.data.name) {
      this.toast('请输入您的姓名');
      return;
    }
    if (!that.data.wechat) {
      this.toast('请输入您的微信号');
      return;
    }
    if (!that.data.gender) {
      this.toast('请选择性别');
      return;
    }
    if (!that.data.age) {
      this.toast('请选择年龄段');
      return;
    }
    if (!validationConfig.phone.regex.test(that.data.tel)) {
      this.toast('请输入正确的手机号码');
      return;
    }
    if (!validationConfig.email.regex.test(that.data.mail)) {
      this.toast('请输入正确的邮箱地址');
      return;
    }
    if (!that.data.enterprise) {
      this.toast('请输入您的公司名称或学校');
      return;
    }
    if (that.data.directionList.length === 0) {
      this.toast('请选择职业方向');
      return;
    }
    if (that.data.nameList.length === 0) {
      this.toast('请选择职业名称');
      return;
    }
    if (!that.data.work) {
      this.toast('请选择工作年限');
      return;
    }
    return true;
  },
  toast(msg) {
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
    name: '',
    tel: '',
    mail: '',
    enterprise: '',
    gitee: '',
    id: '',
    wechat:'',
    eventTitle: '',
    directionList:[],
    nameList:[],
    poster: 1,
    gender:0,
    ageShow:false,
    workShow:false,
    age:'',
    work:'',
    ageList:[
      '18岁以下',
      '18-25',
      '26-30',
      '31-40',
      '41-50',
      '51-60',
      '61以上'
    ],
    workList:[
      '0-3(不包含3年)',
      '3-5(不包含5年)',
      '5-10(不包含10年)',
      '10年及以上',
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      id: options.id,
      eventTitle: options.title,
      poster: options.poster,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];
      remoteMethods.getUserInfo((res) => {
        console.log(JSON.stringify(res.profession));
      this.setData({
        name: res.name || '',
        tel: res.telephone || '',
        mail: res.email || '',
        enterprise: res.company || '',
        nameList: JSON.parse(res.profession) || '',
        directionList:JSON.parse(res.career_direction) || '',
        gender:res.gender||'',
        work:res.working_years||'',
        age:res.age||'',
        wechat:res.wechat||'',
        gitee: res.gitee_name || '',
        work:res.working_years||'',
        directionList:currPage.__data__.directionList ||[],
        nameList:currPage.__data__.nameList|| [],
      });
    });
  },
  nameInput(e) {
    this.setData({
      name: e.detail.value,
    });
  },
  wechatInput(e) {
    this.setData({
      wechat: e.detail.value,
    });
  },
  telInput(e) {
    this.setData({
      tel: e.detail.value,
    });
  },
  mailInput(e) {
    this.setData({
      mail: e.detail.value,
    });
  },
  ageConfirm: function () {
    this.setData({
      ageShow: false,
    });
  },
  workConfirm: function () {
    this.setData({
      workShow: false,
    });
  },
  ageRadioOnChange(e) {
    this.setData({
      age: e.detail,
    });
  },
  workRadioOnChange(e) {
    this.setData({
      work: e.detail,
    });
  },
  enterpriseInput(e) {
    this.setData({
      enterprise: e.detail.value,
    });
  },
  occupationInput(e) {
    this.setData({
      occupation: e.detail.value,
    });
  },
  careerNameClick() {
    wx.navigateTo({
      url: `/package-events/sign-up/career-name`
    });
  },
  radioOnChange(e) {
      this.setData({
          gender: e.detail
      })
  },
  onAgeShow() {
      this.setData({
        ageShow: true,
      })
  },
  onWorkShow() {
      this.setData({
        workShow: true,
      })
  },
  careerClick() {
    wx.navigateTo({
      url: `/package-events/sign-up/career-direction`
    });
  },
  giteeInput(e) {
    this.setData({
      gitee: e.detail.value,
    });
  },
  signUp() {
    if (!localMethods.validation()) {
      return;
    }
    const postData = {
      company: this.data.enterprise,
      wx_account:this.data.wechat,
      age:this.data.age,
      gender:this.data.gender,
      email: this.data.mail,
      gitee_id: this.data.gitee,
      name: this.data.name,
      career_direction:this.data.directionList,
      profession: this.data.nameList,
      working_years:this.data.work,
      telephone: this.data.tel,
      activity: this.data.id,
    };
    remoteMethods.signUp(postData, () => {
      wx.redirectTo({
        url: `/package-events/sign-up/sign-up-success?name=${encodeURIComponent(
          this.data.name
        )}&title=${encodeURIComponent(this.data.eventTitle)}&tel=${encodeURIComponent(
          this.data.tel
        )}&poster=${encodeURIComponent(this.data.poster)}`,
      });
    });
  },
  back() {
    wx.navigateBack();
  },
});
