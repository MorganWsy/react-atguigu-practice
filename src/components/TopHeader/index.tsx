import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button,Modal } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { collapsedAction } from 'redux/action/admin';
import reqWeather, { reqCityIdWithName } from '../../api/weather';
import formatTime from '../../utils/formatTime';
import storageUtil from '../../utils/storageUtil';
import navList from '../../config/navList';
import {createLoginAction} from '../../redux/action/login';
import './index.scss';
import SunDay from '../../assets/images/sunday.png';
import Cloudy from '../../assets/images/cloudy.png';
import NoSun from '../../assets/images/nosun.png';
import Rainy from '../../assets/images/rainy.png';
import ThunderDay from '../../assets/images/thunderday.png';

//#region UI组件
function TopHeader(props: any) {
  const [time, setTime] = useState(formatTime(Date.now()));
  const [weather, setWeather] = useState({ text: '晴', temp: 20, city: '南昌', img: SunDay });
  const [username, setUsername] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  let {pathname} = useLocation();
  let navigate = useNavigate();
  let navTitle = '首页';
  // 暂时放在这里
  navTitle = getNavTitle();

  // React Hooks的方法都不能在其他函数内部调用
  // KEY：useEffect方法没有传第二个参数，则第一个参数函数相当于componentDidCount()钩子。
  useEffect(() => {
    // KEY：必须在 componentDidCount() 这个钩子中调用！在外侧调用会因为组件的更新而一直发送ajax请求。
    // componentDidCount()钩子的作用是:在render之后调用一次
    getWeather('南昌市');
    // 从内存中读取用户名，并更新状态
    setUsername(storageUtil.getUser().username);

    // 组件加载后，设置定时器
    // let timeId = setInterval(() => {
    //   // 更新状态(每次更新状态,组件都会重新渲染一次,所以如果在TopHeader组件中console.log(xxx),会一直输出...)
    //   setTime(formatTime(Date.now()));
    // }, 1000)
    return () => {
      // 组件将要卸载时，清除定时器
      // clearInterval(timeId);
    }
  }, []);
  const handleCollapsed = () => {
    props.isCollapsed ? props.toggleCollapsed({ isCollapsed: false }) : props.toggleCollapsed({ isCollapsed: true });
  }
  // 获取天气信息（温度、天气、位置、图片）
  async function getWeather(name: string) {
    // NOTE：根据城市名称，即excel表的第四列的字段，获取城市id（excel第二列的字段）
    let id = await reqCityIdWithName(name);
    let { location: { city }, now: { text, temp } } = await reqWeather(id);
    // 根据天气得到对应的天气图
    let img = getWeatherImg(text);
    // 更新状态，重新渲染组件
    setWeather({ text, temp, img, city });
  }
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
  // 获取Header组件上的导航文本
  function getNavTitle(){
    pathname = pathname === '/' ? '/home' : pathname;
    // 获取当前页面的路由地址
    let navTitle = '';
    navList.forEach((item) => {
      if(item.key === pathname){
        navTitle = item.title;
      }else if(item.children){
        let res = item.children.filter((subItem) => {
          return (item.key + subItem.key) === pathname;
        });
        // res是个满足要求的项组成的数组，如果里面有值，则赋值给navTitle
        if(res.length){
          navTitle = item.title + ' / ' + res[0].title;
        }
      }
    });
    return navTitle;
  }

  function signOut(){
    // 打开对话框
    setIsModalVisible(true);
  }
  function handleOk(){
    // 清除本地保存的用户信息
    storageUtil.removeUser();
    // 传入空对象已删除redux中保存的用户信息
    props.saveUserInfo({});
    // 删除信息后才能跳转到登录页面!且模式为replace
    navigate('/login',{
      replace: true
    });
  }
  function handleCancel(){
    setIsModalVisible(false);
  }
  return (
    <div className='admin-main-header'>
      <Button type="primary" onClick={handleCollapsed}>
        {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
      </Button>
      <h2 className='main-header-title'>{navTitle}</h2>
      <div className="main-header-weather">
        <span className='main-header-weather-time'>{time}</span>
        <img src={weather.img} alt='天气图' />
        <span className='main-header-weather-info'>{weather.city} {weather.text} {weather.temp}°</span>
      </div>
      <div className="main-header-welcome">
        <h2>欢迎您，{username}</h2>
        <a href="#" onClick={signOut}>退出</a>
      </div>
      <Modal title="退出系统" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>您确定要退出吗?</p>
      </Modal>
    </div>
  )
}
//#endregion

//#region 容器组件
type Data = {
  userInfo: { username: string, password: string }[],
  collapsed: {
    isCollapsed: boolean
  }
}
const mapStateToProps = (state: Data) => ({ isCollapsed: state.collapsed.isCollapsed });
const mapDispatchToProps = (dispatch: any) => {
  return {
    // 控制sider组件是否收缩
    toggleCollapsed: (data: Data) => { dispatch(collapsedAction(data)) },
    saveUserInfo: (info: Data) => {dispatch(createLoginAction(info))}
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);
//#endregion