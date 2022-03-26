import React from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import {connect} from 'react-redux';
import { Form, Input, Button, Checkbox,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {createLoginAction} from '../../redux/action/login';
import ajax from '../../api/ajax.js';
import storageUtil from '../../utils/storageUtil';
import './index.scss';
import logo from '../../assets/images/logo.png';

type FormData = {
  username: string,
  password: string,
  remeber: boolean
}
type User = {
  _id: string,
  username: string,
  password: string,
  create_time: number,
  __v: number,
  saveUserInfo: (info: User) => {}
}
/* UI组件 */
function Login(props: User) {
  // NOTE:React Hook函数必须在组件渲染之前使用！
  const navigate = useNavigate();
  
  // 如果用户还没有登录过(本地没有该用户的数据)，则userData为undefined
  const userData = storageUtil.getUser();
  // KEY:如果本地包含用户的信息（用户已经登录了），则默认显示管理页面（用户访问登录页面也会跳转到管理页面）
  if(userData){
    return <Navigate to='/'/>;
  }
  // 提交表单且表单验证成功后的回调函数
  const handleSubmitForm = async function(data: FormData){
    // 发送ajax请求
    let response = await ajax('/api1/api/login', data, 'POST');
    // 避免和antd组件的message组件搞混
    const {data:userData,message: msg, status} = response.data;
    // 如果登录成功
    if(status === 0){
      message.success(msg,2);
      // 将用户信息保存在redux中
      props.saveUserInfo(userData);
      // 将用户信息保存到本地
      storageUtil.saveUser(userData);

      // 跳转到系统主页面(因为不需要回退到登录页面，所以使用了replace模式)
      navigate('/',{
        replace: true
      });
      // 登录成功后，将用户信息提交到redux中管理
    }else{
      message.error(msg,3);
    }
  }
  return (
    <div className='login'>
      <header className="login-header">
        <img src={logo} alt="系统logo" />
        <h1>谷粒后台管理系统</h1>
      </header>
      <div className="login-content">
        <h2>用户登录</h2>
        <Form className='login-form' initialValues={{ remeber: true}} onFinish={handleSubmitForm} >
          {/* rules对象中的message属性用于显示提示信息(当没有填写表单时)。这种验证称为声明式验证，还可以使用validator属性，并传递一个函数进行验证，称为自定义验证。 */}
          <Form.Item name='username' initialValue='admin' rules={[{ required: true, message: '用户名是必填的!'},{type: 'string', min: 4, max: 12,message:'用户名的长度在4-12位之间!'},{pattern: /^[a-z|0-9|_]+\S$/i,message: '用户名只能由英文、数字、下滑线组成'}]}>
            <Input type='text' prefix={<UserOutlined />} placeholder='请输入用户名' />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: '密码是必填的!' },{type: 'string', min: 8, message: '密码长度不能少于8位'},{pattern: /^[a-z|0-9]+\S/i,message: '密码只能由英文、数字、特殊字符组成'}]}>
            <Input type='password' prefix={<LockOutlined />} placeholder='请输入密码' />
          </Form.Item>
          <Form.Item name='remeber' valuePropName='checked'>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Form.Item>
            {/* htmlType属性是设置button原生的type值，如button、submit等 */}
            <Button type='primary' htmlType='submit' className='login-form-btn'>登录</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

const mapStateToProps = (state:{ userInfo: User[] }) => ({})
const mapDispatchToProps = (dispatch:any) => {
  return {
    saveUserInfo: (info:User) => {dispatch(createLoginAction(info))}
  }
}
/* 容器组件 */
export default connect(mapStateToProps,mapDispatchToProps)(Login);
