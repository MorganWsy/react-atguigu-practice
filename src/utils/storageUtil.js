/* 
  将用户数据存储在本地(localstorage)的模块
*/
const store = require('store');
// 定义常量
const USER_KEY = 'user_key';

const storageUtil = {
  saveUser: (data) => {
    // 方法1：使用原生JS的localStorage（对老版本浏览器不友好）。setItem方法的第二个参数是string，所以需要传入JSON字符串
    // return localStorage.setItem(USER_KEY, JSON.stringify(data));
    // 方法2：使用store库
    return store.set(USER_KEY, data);
  },
  getUser: () => {
    // 如果没有key对应的用户信息，getItem方法会返回null，所以为了避免报错，使用 或 逻辑符来解析'{}'
    // return JSON.stringify(localStorage.getItem(USER_KEY) || '{}');
    return store.get(USER_KEY);
  },
  removeUser: () => {
    // return localStorage.removeItem(USER_KEY);
    return store.remove(USER_KEY);
  }
}
export default storageUtil;