var _ = require('../utils/underscore-extend.js');

// 通用接口配置
var commonServiceConfig = {
  // 登录接口
  LOGIN: '/login/',

  // sig列表
  SIG_LIST: '/sigs/',

  // msg城市列表
  MSG_LIST:'/cities/',

  // 获取当前组已添加成员列表
  GROUP_MEMBER_LIST: '/users_include/',

  // 查询某个城市的成员
  GROUP_CITY_MEMBER_LIST:'/users_include_city/',

  // 获取当前组未添加成员列表
  GROUP_EXCLUDE_MEMBER_LIST: '/users_exclude/',

  // 查询某个城市的非成员
  GROUP_CITY_EXCLUDE_MEMBER_LIST: '/users_exclude_city/',

  //获取所有组的信息
  ALL_GROUP_LIST: '/groups/',

  // 添加组员
  ADD_MEMBER_LIST: '/groupuser/action/new/',

  // MSG城市添加组员
  ADD_CITY_MEMBER_LIST: '/cityuser/action/new/',

  // 删除组员
  DEL_MEMBER_LIST: '/groupuser/action/del/',

  // 删除MSG城市组员
  DEL_CITY_MEMBER_LIST: '/cityuser/action/del/',

  // 获取sig组未添加成员列表
  GET_USER_GROUP: '/usergroup/{id}/',

  // 创建会议
  SAVE_MEETING: '/meetings/',

  // 获取会议详情
  GET_MEETING_DETAIL: '/meetings/{id}/',

  // 最近的会议列表
  RECENTLY_MEETINGS: '/meetingslist/?range=recently',

  // 获取当日会议列表
  GET_MEETING_DAILY: '/meetingslist/?range=daily',

  // 获取前后一周会议列表
  GET_MEETING_WEEKLY: '/meetingslist/?range=weekly',

  // 删除会议
  DEL_MEETING: '/meeting/{id}/',

  // 获取用户状态
  GET_USER_STATUS: '/userinfo/{id}/',

  // 保存用户giteename
  SAVE_MEMBER_DETAIL: '/user/{id}/',

  // 我创建的会议列表
  MY_MEETINGS_LIST: '/mymeetings/',

  // 收藏会议
  COLLECT: '/collect/',

  // 取消收藏
  UNCOLLECT: '/collect/{id}/',

  // 收藏列表
  MY_COLLECT_LIST: '/collections/',

  // 获取发起人列表
  ENTERPRISE_MEMBER_LIST: '/sponsors/',

  // 获取未添加发起人名单
  ENTERPRISE_EXCLUDE_MEMBER_LIST: '/nonsponsors/',

  // 添加发起人
  ENTERPRISE_ADD_MEMBER_LIST: '/sponsor/action/new/',

  // 编辑发起人信息
  ENTERPRISE_SAVE_MEMBER_DETAIL: '/sponsorinfo/{id}/',

  // 删除发起人
  ENTERPRISE_DEL_MEMBER_LIST: '/sponsor/action/del/',

  // 发布
  PUBLISH_EVENT: '/activity/',

  // 保存草稿
  SAVE_DRAFT: '/activitydraft/',

  // 获取草稿箱活动列表
  GET_DRAFT_LIST: '/activitiesdraft/',

  // 获取全量待发布
  DRAFTS: '/drafts/',

  //草稿详情
  DRAFT_DETAIL: '/sponsoractivitydraft/{id}/',

  // 修改草稿
  EDIT_DETAIL: '/draftupdate/{id}/',

  // 修改草稿并发布

  EDIT_DETAIL_PUBLISH: '/draftpublish/{id}/',

  // 驳回活动发布
  REJECT_PUBLISH: '/activityreject/{id}/',

  // 活动审核通过
  RESOLVE_PUBLISH: '/activitypublish/{id}/',

  // 活动审核通过
  PUBLISHER_EVENTS_LIST: '/sponsoractivitiespublishing/',

  // 我发布的活动
  MY_EVENTS_LIST: '/sponsoractivities/',

  // 我发布的活动
  DEL_EVENT: '/activitydel/{id}/',

  // 所有活动
  ALL_EVENTS_LIST: '/activities/',

  // 所有活动
  EVENT_DETAIL: '/activity/{id}/',

  // 修改日程
  EDIT_SCHEDULE: '/activityupdate/{id}/',

  // 修改日程
  EXAMINE_DETAIL: '/draft/{id}/',

  // 修改日程
  EVENT_COLLECT: '/collectactivity/',

  // 修改日程
  EVENT_UNCOLLECT: '/collectactivitydel/{id}/',

  // 活动收藏列表
  EVENT_COLLECT_LIST: '/collectactivities/',

  // 最新活动列表
  LATEST_EVENTS: '/recentactivities/',

  // 获取报名者信息
  APPLICANT_INFO: '/applicantinfo/{id}/',

  // 报名
  SAVE_SIGNUP_INFO: '/activityregister/',

  // 我报名的活动
  MY_SIGNUP_EVENTS: '/registeractivities/',

  // 报名表单
  SEND_SIGNUP_INFO: '/applicantsinfo/',

  // 保存意见反馈
  SAVE_FEEDBACK: '/feedback/',

  // 获取已发布分类数量
  GET_EVENTS_COUNT: '/countactivities/',

  // 获取我已预定的会议
  GET_MY_MEETING: '/mymeetings/',

  // 获取我已收藏的会议
  GET_MY_COLLECT: '/collections/',

  // 获取我的活动报名信息
  GET_SIGNUP_INFO: '/ticket/{id}/',
};

let servicesConfig = _.deepExtend(true, commonServiceConfig);

module.exports = servicesConfig;
