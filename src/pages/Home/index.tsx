import React from 'react';
import { Card,Button } from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import './index.scss';

export default function Home() {
  return (
    <div className='home-wrapper'>
      <Card className='home-card' title="首页" extra={<Button type='primary' icon={<PlusOutlined />} >添加</Button>}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </div>
  )
}
