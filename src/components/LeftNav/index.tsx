import React from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import navList from '../../config/navList';
import logo from '../../assets/images/logo.png';

const { SubMenu, Item } = Menu;
type NavItem = {
  key: string,
  icon: any,
  title: string,
  children?: NavItem[]
}
function LeftNav(props: any) {
  let key = '';//存储父级路由的key值
  let currentPath: string = useLocation().pathname;
  // KEY：如果访问的是localhost:3000/，则将currentPath替换为'/home'，使得selectedKeys属性可以选中"首页"菜单项。这里和老师讲的不一样
  currentPath = currentPath === '/' ? '/home' : currentPath;
  
  // NOTE: 读取 config/navList.js 文件的内容，动态渲染导航链接，使用了递归。
  const renderNavList = (list: NavItem[], parentKey = '') => {
    return list.map((item) => {
      if (item.children) {
        // KEY：保存父级路由的key值，并作为参数传递给renderNavList函数
        parentKey = item.key;
        let res = item.children.find((value) => {
          return (item.key + value.key) === currentPath;
        });
        // 如果当前访问的路径和子路由的key对上了，则将该子路由的父级路由的key赋给全局变量key
        if(res){
          key = item.key;
        }
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {renderNavList(item.children, parentKey)}
          </SubMenu>
        )
      } else {
        // 如果没有父级路由，则parentKey默认是空串
        return (
          <Item key={parentKey + item.key} icon={item.icon}>
            <Link to={parentKey + item.key}>{item.title}</Link>
          </Item>
        )
      }
    });
  }
  // 先渲染导航链接，渲染完成后变量key才有值！！
  const navListNodes = renderNavList(navList);
  return (
    <div className='admin-nav'>
      <Link className='admin-nav-header' to='/home'>
        <img src={logo} alt="系统logo" />
        {/* KEY：如果sider组件收缩了，则不显示h1标签 */}
        <h1 style={props.isCollapsed ? { display: 'none' } : { display: 'block' }}>谷粒后台管理系统</h1>
      </Link>

      {/* NOTE：defaultSelectedKeys属性只会在第一次生效，如果要动态选中菜单项，应该换成selectedKeys属性，他俩的值一样。defaultOpenKeys属性的值是SubMenu组件的key值，注意不能用OpenKeys属性 */}
      <Menu selectedKeys={[currentPath]} defaultOpenKeys={[key]} mode="inline" theme="dark">
        {navListNodes}
      </Menu>
    </div>
  )
}
type Data = {
  collapsed: {
    isCollapsed: boolean
  }
}
// NOTE：将sider组件是否收缩的isCollapsed属性映射到props中
const mapStateToProps = (state: Data) => ({ isCollapsed: state.collapsed.isCollapsed });
export default connect(mapStateToProps)(LeftNav);
