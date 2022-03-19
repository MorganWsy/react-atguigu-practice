import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { collapsedAction } from 'redux/action/admin';
import reqWeather from '../../api/weather';
import formatTime from '../../utils/formatTime';
import './index.scss';
import SunDay from '../../assets/images/sunday.png';
import Cloudy from '../../assets/images/cloudy.png';
import NoSun from '../../assets/images/nosun.png';
import Rainy from '../../assets/images/rainy.png';
import ThunderDay from '../../assets/images/thunderday.png';

//#region UI组件
function TopHeader(props: any) {
  const [time,setTime] = useState(formatTime(Date.now()));
  let text = '',
    temp = 0,
    img = SunDay;
  useEffect(() => {
    getWeather(110100);

    // 组件加载后，设置定时器
    // let timeId = setInterval(() => {
    //   // 更新状态
    //   setTime(formatTime(Date.now()));
    // }, 1000)
    return () => {
      // 组件将要卸载时，清除定时器
      // clearInterval(timeId);
    }
  });
  const handleCollapsed = () => {
    props.isCollapsed ? props.toggleCollapsed({ isCollapsed: false }) : props.toggleCollapsed({ isCollapsed: true });
  }
  // 获取天气信息（温度、天气、位置、图片）
  async function getWeather(id: number) {
    // let id = await reqCityIDWithName(name);
    let { location, now } = await reqWeather(id);
    // setWeather({ text, temp, img });
    text = now.text;
    temp = now.temp;
    img = getWeatherImg(text);
    // setCityID(id);
  }
  console.log(text,temp);
  // 获取天气对应的图片
  function getWeatherImg(text: string) {
    switch (text) {
      case '晴天':
        return SunDay;
      case '多云':
        return Cloudy;
      case '阴天':
      case '阴':
        return NoSun;
      case '小雨':
      case '中雨':
      case '大雨':
      case '暴雨':
        return Rainy;
      case '雷阵雨':
        return ThunderDay;
      default:
        return SunDay;
    }
  }
  return (
    <div className='admin-main-header'>
      <Button type="primary" onClick={handleCollapsed}>
        {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
      </Button>
      <h2 className='main-header-title'>首页</h2>
      <div className="main-header-weather">
        <span className='main-header-weather-time'>{time}</span>
        <img src={img} alt={text} />
        <span className='main-header-weather-info'>{text} {temp}°</span>
      </div>
      <div className="main-header-welcome">欢迎您，admin</div>
    </div>
  )
}
//#endregion

type Data = {
  collapsed: {
    isCollapsed: boolean
  }
}
//#region 容器组件
const mapStateToProps = (state: Data) => ({ isCollapsed: state.collapsed.isCollapsed });
const mapDispatchToProps = (dispatch: any) => {
  return {
    // 控制sider组件是否收缩
    toggleCollapsed: (data: Data) => { dispatch(collapsedAction(data)) }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);
//#endregion