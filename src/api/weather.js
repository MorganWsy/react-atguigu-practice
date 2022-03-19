// 下载jsonp库，用于解决http到https的跨域问题
// // import jsonp from 'jsonp';
import {message} from 'antd';
import ajax from './ajax';

// export async function reqCityIDWithName(name){
//   const res =  await ajax('/api2/api/weather',{name: name});
//   // data是string类型
//   const {status,data} = res.data;
//   if(status === 0){
//     return Number(data);
//   }else{
//     // 如果查询失败则默认显示北京市的天气
//     return 110100;
//   }
// }

export default function reqWeather(id){
  // http://localhost:3000/weather/weather/v1/...
  // https://api.map.baidu.com/weather/v1/...
  const url = `/weather/weather/v1/?district_id=${id}&data_type=all&ak=kjmyR6No79OffsSpnIKpNQ5ZukpmgM5C`;

  return new Promise((resolve,reject) => {
    ajax(url).then((res) => {
      const {data: {status,result}} = res;
      if(status === 0 && result){
        resolve(result);
      }else{
        message.error('获取天气信息失败');
      }
    });
  })
}