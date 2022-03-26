import React from 'react';
import { Outlet } from 'react-router-dom';

export default function GoodsManage() {
  return (
    <>
      {/* GoodsManage组件的子路由组件放置的位置 */}
      <Outlet/>
    </>
  )
}
