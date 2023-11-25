function isObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

// 实现 isArray 方法
function isArray(obj) {
  return Array.isArray(obj);
}
const _ = {
  /**
   * 对象深拷贝
   */
  deepExtend: function (target) {
    let deep = true,
      args = [].slice.call(arguments, 1);

    let extend = function (target, source, deep) {
      let isWindow = function (obj) {
        return obj !== null && obj === obj.window;
      };
      let isPlainObject = function (obj) {
        return isObject(obj) && !isWindow(obj) && obj.__proto__ === Object.prototype;
      };
      for (let key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
          if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
          if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
          extend(target[key], source[key], deep);
        } else if (source[key] !== undefined) target[key] = source[key];
      }
    };

    if (typeof target === 'boolean') {
      deep = target;
      target = args.shift();
    }
    args.forEach(function (arg) {
      extend(target, arg, deep);
    });
    return target;
  },
};

module.exports = _;
