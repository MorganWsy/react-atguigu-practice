import React from 'react';
import { Spin } from 'antd';
import './index.scss';

export default function LocalLoading() {
  return (
    <section className='local-loading-wrapper'>
      <Spin className="local-loading" tip='加载中...' size="large"/>
    </section>
  )
}
