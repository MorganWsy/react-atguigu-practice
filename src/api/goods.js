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

export const reqGetGoodsCategory = (id) => {
  const url = '/api1/goods/manage/getcategory';
  return new Promise((resolve,reject) => {
    ajax(url,{id},'GET').then((response) => {
      const {data: {status,message:msg,data}} = response;
      if(status === 0){
        resolve(data);
      }else{
        message.error(msg);
      }
    })
  });
}