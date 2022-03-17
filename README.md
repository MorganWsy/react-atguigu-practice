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