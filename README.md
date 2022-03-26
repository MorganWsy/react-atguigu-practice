# 尚硅谷React实战项目

## 1. 初始化项目

- 要点1：如果要结合 react 和 typescript，则需要在`create-react-app xxx`生成项目后，下载`yarn add typescript @types/node @types/react @types/react-dom`（全局安装过 typescript，但是项目好像识别不到，所以只能在项目中局部安装了）。
- 要点2：将项目中的`.jsx`文件都改成`.tsx`就行（即使组件名称为`index.tsx`，引入组件时路径也必须完整，即必须包含`index.tsx`，这与`index.jsx`文件的引入不同！）
- 要点3：想要在项目中使用`scss`或`sass`，则需要单独下载`yarn add node-sass -D`，`create-react-app`脚手架默认给我们安装了`sass-loader`、`less-loader`、`less`、`style-loader`、`css-loader`，并且在`webpack.config.js`文件中进行了配置！所以只需要下载`node-sass`包就可以使用 scss 了（使用 less 则不需要单独下载其他包）
- 要点4：在项目中引入`reset.css`文件。该文件可以在`github`上搜索找到并下载。

## 2. 高阶组件和高阶函数

### 1. 什么是高阶函数？

- 接收的参数是函数。

- 返回的值是函数。

- 常见的高阶函数：
  
  - 定时器：`setTimeout()`、`setinterval()`。
  
  - `Promise`函数：`new Promise((resolve,reject)=>{})`
  
  - `then()`函数、`catch()`函数
  
  - 数组方法：`forEach()`、`map()`、`filter()`、`reduce()`、`find()`
  
  - 函数对象的`bind()`方法。

- 高阶函数更具由2扩展性。

### 2. 什么是高阶组件？

- 高阶组件本身就是个函数，无论是函数式组件还是类式组件(类式组件其实也是函数)

- 可以接收一个组件并返回一个新的组件，那它就是高阶组件。一般会给接收的组件传入特定的属性，达到扩展接收组件的功能的目的。

## 3. 维持登录与自动登录

### 1. 要求

1. 登录后，刷新页面依然是已登录状态（维持登录）。

2. 登录后，关闭浏览器后再打开浏览器访问系统，依然是登录状态（自动登录）。

3. 登录后，访问登录界面会自动跳转到管理界面。

### 2. 注意点

- 要点1：下载`store`库（js版）和这个库的类型定义包`@types/store`，并在`utils`文件夹的`storageUtil.js`文件中封装好，暴露出去。
  
  ![](E:\frontend\React\react-practice\img\store包.png)

- 要点2：将登录的用户的信息使用`storeageUtil.js`中的方法保存。

- 要点3：在`index.js`入口文件读取本地保存的用户数据，并存储到内存中，然后我们从内存中读取用户数据并显示！这样更快。

## 4. 导航链接和路由表

### 1. 导航链接

- 一级路由对应的导航链接的`to`属性的值包括`/`；

- 二级、三级路由对应的导航链接的`to`属性的值前面需要加上一级导航链接。

- 每个`Item`组件的`key`属性的值为导航链接，这样`key`就是唯一的了。

```tsx
// 方法1：静态添加导航链接
<Menu defaultSelectedKeys={['/home']} mode="inline" theme="dark">
        {/* 将路由链接指定为key的值，则key就是唯一的 */}
        <Item key="/home" icon={<PieChartOutlined />}>
          <Link to='/home'>首页</Link>
        </Item>

        <Item key='/user' icon={<DesktopOutlined />}>
          <Link to='/user'>用户管理</Link>
        </Item>

        <SubMenu key="sub1" icon={<DesktopOutlined />} title="商品详情">
          <Item key="/goods/category">
            <Link to='/goods/category'>商品分类</Link>
          </Item>
          <Item key="/goods/manage">
            <Link to='/goods/manage'>商品管理</Link>
          </Item>
        </SubMenu>

        <SubMenu key="sub2" icon={<PieChartOutlined />} title="图表">
          <Item key="/charts/pie">
            <Link to='/charts/pie'>饼图</Link>
          </Item>
          <Item key="/charts/bar">
            <Link to='/charts/bar'>柱状图</Link>
          </Item>
          <Item key='/charts/line'>
            <Link to='/charts/line'>折线图</Link>
          </Item>
        </SubMenu>
 </Menu>

// 方法2：动态添加导航链接
// NOTE: 读取 config/navList.js 文件的内容，动态渲染导航链接，使用了递归。
  const renderNavList = (list: NavList, parentKey = '') => {
    return list.map((item) => {
      if (item.children) {
        // KEY：保存父级路由的key值，并作为参数传递给renderNavList函数
        parentKey = item.key;
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

<Menu defaultSelectedKeys={['/home']} mode="inline" theme="dark">
  {renderNavList(navList)}
</Menu>
```

2. 需要解决的两个问题：
   
   - 当我们刷新页面的时候，如何选中当前路由链接下的菜单项。
   
   > 使用`Menu`组件的`selectedKeys`属性，将当前菜单项的`key`值赋给`selectedKeys`。
   
   - 当我们刷新页面时，如果正位于某个子菜单中，如何打开该子菜单的父菜单并关闭其他父菜单。
   
   > 使用`Menu`组件的`defaultOpenKeys`属性，将父菜单的`key`值赋给`defaultOpenKeys`。

### 1. 办法

- 在前端配置代理服务器 ==> 只能解决开发环境的跨域问题。
1. 在`package.json`文件中配置`"proxy": "http://后端域名:端口"`。如：`"proxy": "http://localhost:5000"`。

2. 在项目根目录创建`setupProxy.js`文件，文件名不能变！！配置如下：
   
   ```js
   /* 配置服务器代理。需要使用commonjs规范 */
   const proxy = require('http-proxy-middleware');
   
   module.exports = function (app) {
     app.use(
       proxy.createProxyMiddleware('/api1', {
         target: 'http://localhost:5000',
         changeOrigin: true,
         pathRewrite: {
           '^/api1': ''
         }
       }),
       proxy.createProxyMiddleware('/api2',{
         target: 'http://localhost: 5000',
         changeOrigin: true,
         pathRewrite: {
           '^api2': ''
         }
       })
     )
   }
   ```

### 2. 什么是代理服务器？

- 具有特定功能的程序，可以解决开发时发送ajax请求出现的跨域问题。

- 功能：
  
  - 监视前端服务器，并拦截前端发送的ajax请求。
  
  - 将前端的ajax请求转发到服务器端。

- 运行在哪：代理服务器运行在前端。

## 5. 使用useEffect()方法遇到的问题

- `useEffect()`方法的第二个参数必须是空数组，这样它的第一个参数函数才能是`componentDidMount()`钩子。

- 其他需要注意的地方可以看代码注释：

```tsx
  const [time, setTime] = useState(formatTime(Date.now()));
  const [weather, setWeather] = useState({ text: '晴', temp: 20, city: '南昌', img: SunDay });
  const [username, setUsername] = useState('');

  // KEY：useEffect方法没有传第二个参数，则第一个参数函数相当于componentDidCount()钩子。
  useEffect(() => {
    // KEY：必须在componentDidCount()这个钩子中调用！在外侧调用会因为组件的更新而一直发送ajax请求
    getWeather('南昌市');
    // 从内存中读取用户名，并更新状态
    setUsername(storageUtil.getUser().username);

    // 组件加载后，设置定时器
    let timeId = setInterval(() => {
      // 更新状态
      setTime(formatTime(Date.now()));
    }, 1000)
    return () => {
      // 组件将要卸载时，清除定时器
      clearInterval(timeId);
    }
  }, []);
```

## 6. 自定义像超链接的按钮组件

- 在 React 中使用`<a href='javascript:'>退出</a>`会出现警告，因为`href`属性不是一个合法的地址。所以我们需要自定义一个组件，它长的像超链接但是却是`<button>`。

- 实现如下：
  
  ```tsx
  import React from 'react';
  import './index.scss';
  
  export default function LinkButton(props:any) {
    return (
      <button {...props} className='linkButton '></button>
    )
  }
  //index.scss
  .linkButton{
    outline: none;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
  ```

## 7. jsonp原理

- `jsonp`只能解决`GET`类型的ajax请求的跨域问题；

- `jsonp`请求不是 ajax 请求，而是`GET`请求；

- **基本原理：**
  
  1. 在浏览器端动态生成`<script>`标签，标签的`src`属性就是接口的url（使用了`<script>`标签可以访问跨域资源的特性）
  
  2. 在浏览器端自己定义好接收响应数据的函数，并将函数名通过`GET`请求参数的形式提交给服务器，如：`https://api.map.baidu.com/weather/v1?district_id=${id}&data_type=all&callback=你定义的函数名`
  
  3. 服务器接收到`<script>`标签的请求，产生相应的数据，并将数据作为实参传递给`callback`键对应的函数。
  
  4. 浏览器端接收到数据，自动执行我们定义的函数，这样就拿到了我们接口提供的数据。

## 8. 分页的两种方式

1. 前端分页
   
   - 特点：从接口一次性获取所有数据，选择不同页码时不会再向接口发送请求。不需要指定请求参数，如页码、每页的条数等。
   
   - 场景：**适合数据量小**的需求。

2. 后端分页
   
   - 特点：每翻一页都会向接口请求一次数据，需要发送请求参数（当前页码pageNum和每页数据的条数pageSize）。响应的数据包括当前页码数据的数组和总记录数。
   
   - 场景：**适合数据量大**的需求。

## 9. 商品管理组件的优化

- 将变量作为某个对象的 key 值，需要将该变量用`[]`括起来。如：`[searchType]: searchContent`

- 当进入`/goods/manage/detail`路由，左侧的导航组件没有选中高亮【商品管理】，且刷新页码时，左侧的导航组件没有展开【商品详情】组件。
  
  ```tsx
  // LeftNav.tsx
  // 如果当前访问的路径是'localhost:xxxx/goods/manage/detail'，
  // 则将其修改为'localhost:xxxx/goods/manage'，以便高亮显示和展开导航组件。
  currentPath = currentPath.includes('/detail') ? '/goods/manage': currentPath;
  ```