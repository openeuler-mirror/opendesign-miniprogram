let _ = require('../utils/underscore-extend.js');

// 通用接口配置
let commonServiceConfig = {
    // 登录接口
    LOGIN: '/login/',

    // sig列表
    SIG_LIST: '/sigs/',

    // msg城市列表
    MSG_LIST: '/cities/',

    // 获取当前组已添加成员列表
    GROUP_MEMBER_LIST: '/users_include/',

    // 查询某个城市的成员
    GROUP_CITY_MEMBER_LIST: '/users_include_city/',

    // 查询一个用户的城市关系
    GROUP_USER_CITY: '/usercity/{id}/',

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

    // "我的"页面各项计数
    GET_COUNTS: '/counts/',

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
    ENTERPRISE_SAVE_MEMBER_DETAIL: '/user/{id}/',

    // 删除发起人
    ENTERPRISE_DEL_MEMBER_LIST: '/sponsor/action/del/',

    // 发布
    PUBLISH_EVENT: '/activity/?publish=true',

    // 保存草稿
    SAVE_DRAFT: '/activity/',

    // 获取草稿箱活动列表
    GET_DRAFT_LIST: '/activitiesdraft/',

    // 我的待发布活动列表（发布中）
    MY_WAITING_ACTIVITIES: '/mywaitingactivities/',

    // 待发布活动列表（超级管理员）
    WAITING_ACTIVITIES: '/waitingactivities/',

    // 活动收藏列表（已收藏）
    ACTIVITY_COLLECTIONS: '/activitycollections/',

    //  我报名的活动（已报名）
    MY_REGISTERD_ACTIVITES: '/myregisterdactivities/',

    // 活动草稿箱列表
    DRAFTS: '/drafts/',

    //草稿详情
    DRAFT_DETAIL: '/draft/{id}/',

    // 修改草稿
    EDIT_DETAIL: '/draftupdate/{id}/',

    // 修改草稿并发布

    EDIT_DETAIL_PUBLISH: '/draftupdate/{id}/?publish=true',

    // 驳回活动发布
    REJECT_PUBLISH: '/activity/action/deny/{id}/',

    // 活动审核通过
    RESOLVE_PUBLISH: '/activity/action/approve/{id}/',

    // 活动审核通过
    PUBLISHER_EVENTS_LIST: '/sponsoractivitiespublishing/',

    // 我发布的活动新增
    MY_EVENTS_LISTS: '/mypublishedactivities/',
    // 我发布的活动
    MY_EVENTS_LIST: '/sponsoractivities/',

    // 我发布的活动
    DEL_EVENT: '/activity/action/del/{id}/',

    // 所有活动
    ALL_EVENTS_LIST: '/activities/',

    // 所有活动
    EVENT_DETAIL: '/activity/{id}/',

    // 修改日程
    EDIT_SCHEDULE: '/activityupdate/{id}/',

    // 修改日程
    EXAMINE_DETAIL: '/waitingactivity/{id}/',

    // 收藏活动
    EVENT_COLLECT: '/activity/action/collect/',

    // 收藏活动：
    EVENT_COLLECTS: '/activity/action/collect/',

    // 取消收藏
    EVENT_UNCOLLECT: '/activity/action/collectdel/{id}/',

    // 活动收藏列表
    EVENT_COLLECT_LIST: '/collectactivities/',

    // 最新活动列表
    LATEST_EVENTS: '/recentactivities/',

    // 我报名的活动
    MY_SIGNUP_EVENTS: '/registeractivities/',

    // 保存意见反馈
    SAVE_FEEDBACK: '/feedback/',

    // 获取已发布分类数量
    GET_EVENTS_COUNT: '/countactivities/',

    // 获取我已预定的会议
    GET_MY_MEETING: '/mymeetings/',

    // 获取我已收藏的会议
    GET_MY_COLLECT: '/collections/',

    // 同意隐私政策
    AGREE: '/agree/',

    //添加城市
    ADDCITY: '/city/',
    // 退出登陆
    LOGOUT: '/logout/',
    // 注销账号
    LOGOFF: '/logoff/',
    // 撤销登陆
    REVOKE: '/revoke/'
};

let servicesConfig = _.deepExtend(true, commonServiceConfig);

module.exports = servicesConfig;