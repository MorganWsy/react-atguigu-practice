import { message } from 'antd';
import ajax from './ajax';


// 根据 parentId 来获取商品分类列表（一级分类或二级分类）
export const reqGetCategoryList = (parentId) => { 
  const url = `/api1/goods/category/list`;
  return new Promise((resolve,reject) => {
    ajax(url,{parentId: parentId},'GET').then((response) => {
      const {data: {status,data,message: msg}} = response;
      // 获取分类列表成功
      if(status === 0){
        // data是个数组，包含所有商品分类（对象）
        resolve(data);   
      }else{
        // NOTE：就算是空数组，也得返回，不然列表会一直loading
        resolve(data);
      }
    })
  });
}

// 添加商品分类（一级分类和二级分类）
export const reqAddCategory = (parentId, categoryName) => {
  const url = `/api1/goods/category/add`;

  return new Promise((resolve,reject) => {
    ajax(url,{parentId,categoryName},'POST').then((response) => {
      const {data: {status,data,message: msg}} = response;
      // 若添加成功
      if(status === 0){
        // data是新添加的商品类（对象）
        resolve(data);
      }
    })
  });
}

// 根据id，来找到数据库中对应的分类，然后更新分类的名称
export const reqUpdateCategory = (categoryId,categoryName) => {
  const url = `/api1/goods/category/update`;
  return new Promise((resolve,reject) => {
    ajax(url,{categoryId,categoryName},'PUT').then((response) => {
      const {data: {status,data,message: msg}} = response;
      if(status === 0){
        // data是修改前的商品类（对象）
        resolve(data);
      }else{
        message.error(msg);
      }
    })
  });
}