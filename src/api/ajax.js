/* 
  - 二次封装axios，该函数返回的都是promise对象。
  - 封装的目的：为了统一处理使用axios发生请求出现的错误！！
*/
import axios from 'axios';
import { message } from 'antd';

export default function ajax(url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    // 存储返回的promise对象
    let promise;
    // 将请求的方法统一转成小写，避免出错
    switch (method.toLowerCase()) {
      case "get":
        promise = axios.get(url, {
          params: data
        });
        break;
      case "post":
        promise = axios.post(url, data);
        break;
      case 'put':
        promise = axios.put(url, data);
        break;
      case "delete":
        promise = axios.delete(url, {
          params: data
        });
        break;
      default:
        break;
    }
    // KEY：优化：在外层统一处理ajax请求的错误
    promise.then((response) => {
      resolve(response);
    }).catch ((err) => {
      message.error(`请求出错：${err.message}`,2);
    })
  })
}