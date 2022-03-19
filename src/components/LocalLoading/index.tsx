import React from 'react';
import { Spin } from 'antd';

export default function LocalLoading() {
  return (
    <Spin className="local-loading" tip='加载中...' size="large"/>
  )
}
