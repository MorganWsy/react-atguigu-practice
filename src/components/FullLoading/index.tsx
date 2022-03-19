import React from 'react';
import {Spin} from 'antd';
import './index.scss';

export default function FullLoading() {
  return (
    <div id="loading-wrapper">
      <Spin className='loading' tip='加载中...' size='large'/>
    </div>
  )
}
