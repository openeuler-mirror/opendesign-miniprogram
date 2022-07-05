/**
 * underscore扩展方法
 */

var _ = require('./underscore.js');

_.mixin({

	/**
	 * 对象深拷贝
	 */
	deepExtend: function(target) { 
		var deep = true, args = [].slice.call(arguments, 1);
		
		var extend = function(target, source, deep) {
			var isArray = _.isArray;
			var isWindow = function(obj) {
				return obj != null && obj == obj.window;
			};
			var isPlainObject = function(obj) {
				return _.isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype;
			};
			for(var key in source){
				
				//如果深度扩展
				if(deep && (isPlainObject(source[key]) || isArray(source[key]))) {
					//如果要扩展的数据是对象且target相对应的key不是对象
					if(isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {}
					//如果要扩展的数据是数组且target相对应的key不是数组
					if(isArray(source[key]) && !isArray(target[key])) target[key] = []
					extend(target[key], source[key], deep)
				} else if(source[key] !== undefined) target[key] = source[key]
			}
		};		
		
		if(typeof target == 'boolean') { //当第一个参数为boolean类型的值时，表示是否深度扩展
			deep = target
			target = args.shift() //target取第二个参数
		}
		
		//遍历后面的参数，全部扩展到target上
		args.forEach(function(arg) {
			extend(target, arg, deep)
		});
		return target;
	}
});

module.exports = _;