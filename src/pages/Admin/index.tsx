import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { connect } from 'react-redux'
import { Layout } from 'antd';
import storageUtil from '../../utils/storageUtil';
import TopHeader from '../../components/TopHeader';
import LeftNav from '../../components/LeftNav';
import './index.scss';

const { Content, Footer, Sider } = Layout;
type User = {
  _id: string,
  username: string,
  password: string,
  create_time: number,
  __v: number
}
type AdminState = {
  userInfo: User[],
  collapsed: {
    isCollapsed: boolean
  }
}

function Admin(props: any) {
  // KEY：从本地取出用户数据。必须在Admin组件里面取
  const userData: User = storageUtil.getUser();
  // NOTE：如果props为空，即用户还没有登录，则自动跳转到Login页面（只要用户成功登录，props就不会为空）
  if (!userData || !userData._id) {
    // 开启了replace模式
    return <Navigate to='/login' replace={true} />
  }
  return (
    <Layout className='admin-wrapper'>
      {/* KEY：antd官网例子是在Menu组件中使用 inlineCollapsed属性，但是inlineCollapsed属性不能在Sider组件内使用! */}
      <Sider collapsed={props.isCollapsed}>
        <LeftNav />
      </Sider>
      <Layout className='admin-main'>
        <TopHeader />
        <Content className='admin-main-content'>
          <Outlet/>
        </Content>
        <Footer className='admin-main-footer'>为了您良好的体验，请使用谷歌浏览器、Edge浏览器、火狐浏览器.</Footer>
      </Layout>
    </Layout>
  )
}


// KEY:映射状态（将redux中保存的公共状态映射到UI组件的props属性中）
const mapStateToProps = (state: AdminState) => {
  // userInfo是个数组，包含多个用户的信息（每个用户都是一个对象）
  const { userInfo, collapsed } = state;
  // 如果redux中还没有用户信息，则默认传递{ username: '', password: '', _id: '' }对象
  const currentUser = (userInfo.length === 0 ? { username: '', password: '', _id: '' } : userInfo[userInfo.length - 1]);
  // 将redux中保存的username、password等数据传递给Admin的UI组件
  return { username: currentUser.username, password: currentUser.password, _id: currentUser._id, isCollapsed: collapsed.isCollapsed };
};
// KEY:映射操作状态的方法
const mapDispatchToProps = (dispatch: any) => {
  return {

  }
}
// KEY: connect函数的返回值就是容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Admin);
