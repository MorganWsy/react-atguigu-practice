import ajax from './ajax';
import {message} from 'antd';

export const reqGetGoodsList = (pageNum,pageSize) => {
  const url = '/api1/goods/manage/list';
  return new Promise((resolve,reject) => {
    ajax(url,{pageNum,pageSize},'GET').then((response) => {
      const {data:{status,data,message:msg}} = response;
      if(status === 0){
        resolve(data);
      }else{
        message.error(msg);
      } 
    })
  });
}

export const reqSearchGoods = ({pageNum,pageSize,type,content}) => {
  const url = '/api1/goods/manage/search';
  return new Promise((resolve,reject) => {
    ajax(url,{pageNum,pageSize,type,content},'GET').then((response) => {
      const {data: {message:msg,status,data}} = response;
      if(status === 0){
        resolve(data);
      }else{
        message.error(msg);
        // data 为空数组
        resolve(data);
      }
    })
  })
}

export const reqUpdateIsSale = (id,currIsSale) => {
  const url = '/api1/goods/manage/upSale';
  return new Promise((resolve,reject) => {
    ajax(url,{id,isSale: currIsSale},'PUT').then((response) => {
      const {data: {status,message: msg,data}} = response;
      if(status === 0){
        resolve(data);
      }else{
        message.error(msg);
      }
    })
  });
}

export const reqGetGoodsCategory = (categoryId) => {
  const url = '/api1/goods/manage/getcategory';
  return new Promise((resolve,reject) => {
    ajax(url,{categoryId},'GET').then((response) => {
      const {data: {status,message:msg,data}} = response;
      if(status === 0){
        resolve(data);
      }else{
        message.error(msg);
      }
    })
  });
}
// 根据文件名删除对应的文件
export const reqRemoveGoodsImg = (fileName) => {
  const url = '/api1/goods/manage/img/remove';
  return new Promise((resolve,reject) => {
    ajax(url,{fileName},"POST").then((response) => {
      const {data:{data,status,message:msg}} = response;
      if(status === 0){
        resolve(data);
      }else{
        message.error(msg);
      }
    });
  });
}

export const reqAddOrUpdateGoods = (product,goodsId) => {
  const url = '/api1/goods/manage/addOrUpGoods';
  return new Promise((resolve,reject) => {
    if(goodsId){
      ajax(url,{...product,goodsId},"POST").then((response) => {
        const {data:{message:msg,data,status}} = response;
        if(status === 0){
          resolve(data);
        }else{
          message.error(msg);
        }
      })
    }else{
      ajax(url,{...product},"POST").then((response) => {
        const {data: {data,status,message:msg}} = response;
        if(status === 0){
          resolve(data);
        }else{
          message.error(msg);
        }
      })
    }
  });
}
