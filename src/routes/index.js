import { Suspense,lazy } from "react";
// 引入封装好的loading组件
import MyLoading from "../components/MyLoading/index.tsx";

// 实现路由组件的赖加载 
const Login = lazy(() => {return import('../pages/Login/index.tsx')});
const Admin = lazy(() => {return import('../pages/Admin/index.tsx')});

export const routeTable = [
  {
    path: '/',
    element: <Suspense fallback={<MyLoading/>}><Admin/></Suspense>
  },
  {
    path: '/login',
    element: <Suspense fallback={<MyLoading/>}><Login/></Suspense>
  }
]