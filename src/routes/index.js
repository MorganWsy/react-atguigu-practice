import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
// 引入封装好的loading组件
import FullLoading from "../components/FullLoading";
import LocalLoading from "../components/LocalLoading";
// 实现路由组件的赖加载 
const Login = lazy(() => { return import('../pages/Login') });
const Admin = lazy(() => { return import('../pages/Admin') });
const Home = lazy(() => { return import('../pages/Home') });
const Category = lazy(() => { return import('../pages/Goods/Category/index.tsx') });
const GoodsManage = lazy(() => { return import('../pages/Goods/GoodsManage/index.tsx') });
const UserManage = lazy(() => { return import('../pages/UserManage') });
const RoleManage = lazy(() => { return import('../pages/RoleManage') });
const Pie = lazy(() => { return import('../pages/Charts/Pie.tsx') });
const Line = lazy(() => { return import('../pages/Charts/Line.tsx') });
const Bar = lazy(() => { return import('../pages/Charts/Bar.tsx') });
const ManageHome = lazy(() => import('../pages/Goods/GoodsManage/ManageHome'));
const GoodsDetail = lazy(() => import('../pages/Goods/GoodsManage/GoodsDetail'));
const AddGoods = lazy(() => import('../pages/Goods/GoodsManage/AddGoods'));

// KEY：注意路由表的内容
export const routeTable = [
  {
    path: '/login',
    element: <Suspense fallback={<FullLoading />}><Login /></Suspense>
  },
  {
    path: '/',
    element: <Suspense fallback={<FullLoading />}><Admin /></Suspense>,
    // 二级路由
    children: [
      {
        // 这个子路由的目的是用户访问 http://localhost:3000时，不仅渲染Admin组件，还默认渲染其子组件Home
        index: true,
        element: <Suspense fallback={<LocalLoading/>}><Home /></Suspense>
      },
      {
        // 用户访问 http://localhost:3000/home时，仍渲染Home组件
        path: 'home',
        element: <Suspense fallback={<LocalLoading/>}><Home /></Suspense>
      },
      {
        path: 'goods',
        // 三级路由
        children: [
          {
            // 访问http://localhost:3000/goods路径，则显示Categroy组件
            index: true,
            element: <Suspense fallback={<LocalLoading/>}><Category/></Suspense>
          },
          {
            path: 'category',
            element: <Suspense fallback={<LocalLoading />}><Category /></Suspense>
          },
          {
            path: 'manage',
            element: <Suspense fallback={<LocalLoading />}><GoodsManage /></Suspense>,
            children: [
              {
                index: true,//表示在 localhost:xxxx/goods/manage 路径下，显示ManageHome组件
                element: <Suspense fallback={<LocalLoading/>}><ManageHome/></Suspense>
              },
              {
                path: 'detail',
                element: <Suspense fallback={<LocalLoading/>}><GoodsDetail/></Suspense>
              },
              {
                path: 'addgoods',
                element: <Suspense fallback={<LocalLoading/>}><AddGoods/></Suspense>
              },
              {
                // 如果没有匹配到manage/detail、manage/addgoods，则重定向到manage/
                path: '/goods/manage/*',
                element: <Navigate to='/goods/manage'/>
              }
            ]
          }
        ]
      },
      {
        path: 'user',
        element: <Suspense fallback={<LocalLoading />}><UserManage /></Suspense>
      },
      {
        path: 'role',
        element: <Suspense fallback={<LocalLoading />}><RoleManage /></Suspense>
      },
      {
        path: 'charts',
        children: [
          {
            index: true,
            element: <Suspense fallback={<LocalLoading />}><Pie /></Suspense>,
          },
          {
            path: 'pie',
            element: <Suspense fallback={<LocalLoading />}><Pie /></Suspense>
          },
          {
            path: 'line',
            element: <Suspense fallback={<LocalLoading />}><Line /></Suspense>
          },
          {
            path: 'bar',
            element: <Suspense fallback={<LocalLoading />}><Bar /></Suspense>
          }
        ]
      }
    ]
  },
  {
    // 没匹配到路由表里的路径的路由，跳转到home组件
    path: '*',
    element: <Navigate to='/home'/>
  }
]