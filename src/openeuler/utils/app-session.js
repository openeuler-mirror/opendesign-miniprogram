var constants = require("../config/constants.js");
/**
 * 获取用户信息
 */
var _getUserinfo = function(){
    var userInfo = wx.getStorageSync(constants.APP_USERINFO_SESSION);

    return userInfo;
};

/**
 * 通过key获取值
 * @params key 
 */
var _getValueByKey = function(key){
    if (!key) {
        return ;
    }
    
    var userinfo = _getUserinfo();
    
    if(!userinfo){
    	return ;
    }
    return userinfo[key];
};

module.exports = {

    /**
     * 从缓存获取token
     */
    getToken : function(){
       return _getValueByKey("access");
    },

    /**
     * 通过key获取对应信息
     */
    getUserInfoByKey : function(key){
        return _getValueByKey(key);
    },
    
    /**
     * 获取用户信息
     */
    getUserinfo : function(){
    	return _getUserinfo();
    },
    
    /**
     * 清楚用户信息
     */
    clearUserInfo : function(){
    	wx.removeStorageSync(constants.APP_USERINFO_SESSION);
    },

    /**
     * 判断是否登录
     */
    loginCheck : function(){

      	if(_getUserinfo() && _getValueByKey("access")){
         	return true;
      	}
       	return false;
    }
};