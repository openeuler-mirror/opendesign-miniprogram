const rules = {
  // 6位数字验证码
  numberCode6: {
    regex: /^\d{6,6}$/,
    errorMsg: '请输入6位数字验证码',
  },

  // 8位数字验证码
  numberCode8: {
    regex: /^\d{8,8}$/,
    errorMsg: '请输入8位数字验证码',
  },

  //	手机号码校验
  phone: {
    regex: /(^1[3456789]\d{9}$)|^$/,
    errorMsg: '请输入正确的手机号码',
  },

  //	电子邮箱校验
  email: {
    regex:
      /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
    errorMsg: ' 无效的邮件地址',
  },

  //	电子邮箱和手机号码校验
  emailOrPhone: {
    regex: /(^1[34578]\d{9}$)|(^[0-9a-z_][_.0-9a-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}\.){1,4}[a-z]{2,4}$)/,
    errorMsg: ' 无效的手机号/邮箱',
  },

  //	金额类型
  money: {
    regex: /^(\d+)(\.\d+)?$/,
    errorMsg: '请输入正确的金额',
  },

  //	最多输入两位小数
  validateTwoDecimal: {
    regex: /^(\d+)(\.\d+)?$/,
    errorMsg: '最多输入两位小数',
  },

  //	正整数类型
  checkUnsignInt: {
    regex: /^[1-9]{1}\d*$/,
    errorMsg: '请输入正整数',
  },

  //	整数类型
  integer: {
    regex: /^[\-\+]?\d+$/,
    errorMsg: ' 无效的整数',
  },

  //	数字类型
  number: {
    regex: /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
    errorMsg: ' 无效的数值',
  },

  //	浮点数类型
  float: {
    regex: /^(-?\d+)(\.\d+)?$/,
    errorMsg: '请输入正确的浮点数',
  },

  //	日期YYYY-MM-DD
  date: {
    regex: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
    errorMsg: ' 无效的日期，格式必需为 YYYY-MM-DD',
  },

  //	校验日期格式
  dateFormat: {
    regex:
      /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/,
    errorMsg: ' 无效的日期格式',
  },

  //	日期时间校验
  dateTimeFormat: {
    regex:
      /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/,
    errorMsg: ' 无效的日期或时间格式',
  },

  //	ipv4地址校验
  ipv4: {
    regex: /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
    errorMsg: ' 无效的 IP 地址',
  },

  //	网址校验
  url: {
    regex:
      /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
    errorMsg: ' 无效的网址',
  },

  //	校验英文字母
  onlyLetter: {
    regex: /^[a-zA-Z\ \']+$/,
    errorMsg: ' 只能填写英文字母',
  },

  //	英文和数字校验
  onlyLetterNumber: {
    regex: /^[0-9a-zA-Z]+$/,
    errorMsg: ' 只能填写数字与英文字母',
  },

  //	汉字校验
  chinese: {
    regex: /^[\u4E00-\u9FA5]+$/,
    errorMsg: ' 只能填写中文汉字',
  },

  //	身份证校验
  chinaId: {
    regex:
      /^[1-9]\d{5}[1-9]\d{3}(((0[13578]|1[02])(0[1-9]|[12]\d|3[0-1]))|((0[469]|11)(0[1-9]|[12]\d|30))|(02(0[1-9]|[12]\d)))(\d{4}|\d{3}[xX])$/,
    errorMsg: ' 无效的身份证号码',
  },

  //	邮政编码校验
  chinaZip: {
    regex: /^\d{6}$/,
    errorMsg: ' 无效的邮政编码',
  },

  //	QQ号码校验
  qq: {
    regex: /(^[0-9]{5,15}$)|^$/,
    errorMsg: ' 无效的 QQ 号码',
  },
  // 密码验证
  checkPassword618: {
    regex:
      /^([\w~`!@#$%^&*()_+-=\[\]\{\}\|\\:;'"<>,\.\?\/]{6,18}|[\w~`!@#$%^&*()_+-=\[\]\{\}\|\\:;'"<>,\.\?\/]{32}|^)$/,
    errorMsg: ' 请输入6-18位密码',
  },

  // 密码验证-字母和数字组合
  checkPasswordLetterNumber: {
    regex: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
    errorMsg: '密码应为6-18位字母和数字组合',
  },

  // 姓名格式验证
  checkRealName: {
    regex: /^[A-Za-z\u4e00-\u9fa5]{0,15}$/,
    errorMsg: '最多可输入15字，包含中文、字母',
  },

  // 验证昵称
  checkName: {
    regex: /^[0-9A-Za-z\u4e00-\u9fa5]{0,15}$/,
    errorMsg: ' 最多可输入15字，包含中文，字母，数字',
  },
  // 验证邮编
  checkCode: {
    regex: /^[0-9]{6}$/,
    errorMsg: ' 请输入合法的邮政编码',
  },

  // 验证公司名称、工作描述
  checkSomeName: {
    regex: /^[0-9A-Za-z\u4e00-\u9fa5]{0,30}$/,
    errorMsg: ' 最多可输入30字，包含中文、字母、数字',
  },

  // 验证政府事业单位中（组织机构代码）包含数字或字母，且长度为15-30位
  checkOrganizationCode: {
    regex: /^[0-9A-Za-z]{15,30}$/,
    errorMsg: ' 请输入正确的组织机构代码',
  },

  // 企业认证-验证企业名称
  chenckCompanyName: {
    regex: /^[0-9A-Za-z\u4e00-\u9fa5\()\（）]{0,50}$/,
    errorMsg: '最多可输入50字，包含中文、字母、数字',
  },

  //	企业认证-验证证件号
  checkCertificateLicense: {
    regex: /^[0-9A-Za-z()-]{9,30}$/,
    errorMsg: '请输入正确的证件号',
  },

  //	验证法定代表人
  validateLegalPerson: {
    regex: /^[A-Za-z\u4e00-\u9fa5]{0,15}$/,
    errorMsg: '请输入正确的法定代表人',
  },

  //	验证微信号
  validateWeixin: {
    regex: /^(([A-Za-z]+[0-9A-Za-z_-]*))*$/,
    errorMsg: '请输入正确的微信号',
  },

  //	验证微博地址
  validateWeibo: {
    regex: /^(http[s]{0,1}:\/\/.+)*$/,
    errorMsg: '请输入正确的微博地址',
  },

  //	银行卡号验证
  validateBankCard: {
    regex: /^[0-9]{10,19}$/,
    errorMsg: '请输入正确的银行卡号验证',
  },

  //	用户输入内容
  checkIntro: {
    regex: /^[0-9A-Za-z\u4e00-\u9fa5]{0,500}$/,
    errorMsg: '只能包含汉字、字母、数字，且最多为500字',
  },

  //	校验手机号码
  phonenumber: {
    regex: /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
    errorMsg: ' 无效的电话号码',
  },

  // 校验护照
  validatePassport: {
    regex: /^1[45][0-9]{7}|([P|p|S|s]\\d{7})|([S|s|G|g]\\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\\d{8})|([H|h|M|m]\\d{8,10})$/,
    errorMsg: '请输入正确的护照',
  },

  //	校验香港身份证
  validateIdentityHK: {
    regex: /^[A-Z]\d{6}\(\d|[A-Z]\)$/,
    errorMsg: '请输入正确的香港身份证',
  },

  //	澳门身份证验证
  validateIdentityMC: {
    regex: /^\d{7}\(\d\)$/,
    errorMsg: '请输入正确的澳门身份证',
  },

  //	台湾身份证验证
  validateIdentityTW: {
    regex: /^[A-Z]\d{9}$/,
    errorMsg: '请输入正确的台湾身份证',
  },

  // 关键词校验
  keywordcheck: {
    regex: /^[A-Za-z0-9\u4e00-\u9fa5]+(,[A-Za-z0-9\u4e00-\u9fa5]{1,15})*$/,
    errorMsg: '必须以","(英文逗号)分隔符,最后一个关键词不需要逗号',
  },

  //	关键词最多输入10个
  validateKeywordMax10: {
    regex: /^([A-Za-z0-9\u4e00-\u9fa5]+(\；|\;){0,1}){1,10}$/,
    errorMsg: '请输入正确的关键词格式：最多可输入10个，以；隔开',
  },

  // 敏感词最多输入十个
  sensitiveWordsMax10: {
    regex: /^[A-Za-z0-9\u4e00-\u9fa5]{1,10}$/,
    errorMsg: '请输入需要新增的敏感词',
  },
};

module.exports = rules;
