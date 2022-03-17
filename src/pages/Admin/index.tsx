import React from 'react'
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux'
import storageUtil from '../../utils/storageUtil';

type User = {
  _id: string,
  username: string,
  password: string,
  create_time: number,
  __v: number
}

export function Admin(props: User) {
  // KEY：从本地取出用户数据。必须在Admin组件里面取
  const userData: User = storageUtil.getUser();
  // 如果userData为undefined，则使用props(保险一点，可以不加)
  props = userData || props;
  // NOTE：如果props为空，即用户还没有登录，则自动跳转到Login页面（只要用户成功登录，props就不会为空）
  if (!props || !props._id) {
    // 开启了replace模式
    return <Navigate to='/login' replace={true} />
  }
  return (
    <div>
      <h2 style={{ fontSize: '20px' }}>欢迎您，{props.username}</h2>
      <h2 style={{ fontSize: '20px' }}>您的密码为：{props.password}</h2>
    </div>
  )
}


// KEY:映射状态（将redux中保存的公共状态映射到UI组件的props属性中）
const mapStateToProps = (state: { userInfo: User[] }) => {
  // userInfo是个数组，包含多个用户的信息（每个用户都是一个对象）
  const { userInfo } = state;
  const currentUser = (userInfo.length === 0 ? userInfo[0] : userInfo[userInfo.length - 1]) || {username: '',password: '',_id: ''};
  // 将redux中保存的username、password等数据传递给Admin的UI组件
  return { username: currentUser.username, password: currentUser.password, _id: currentUser._id };
};
// KEY:映射操作状态的方法
const mapDispatchToProps = (dispatch) => {
  return {

  }
}
// KEY: connect函数的返回值就是容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Admin);
