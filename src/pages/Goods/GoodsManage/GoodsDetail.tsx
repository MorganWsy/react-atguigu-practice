import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, List, Image, Descriptions } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './GoodsDetail.scss';
import NoImage from '../../../assets/images/noimage.png';
import { BASE_IMG_URL } from 'utils/constant';
import { reqGetGoodsCategory } from 'api/goods';
const { Item } = List;
const { PreviewGroup } = Image;

type Good = {
  isSale: boolean,
  imgs: string[],
  _id: string,
  name: string,
  desc: string,
  price: number,
  pCategoryId: string,
  categoryId: string,
  detail: any,
  _v: number
}
type Detail = {
  product: {
    isSale: boolean,
    imgs: string[],
    _id: string,
    name: string,
    desc: string,
    price: number,
    pCategoryId: string,
    categoryId: string,
    detail: any,
    _v: number
  },
  name: string[]
}

export default function GoodsDetail() {
  const navigate = useNavigate();

  // state 对象中包含 product 对象和 name 数组
  const { state } = useLocation();
  const { product: { name, price, desc, imgs, detail }, name: categoryArr } = state as Detail;

  const data = [
    {
      title: '商品名称:',
      content: name
    },
    {
      title: '商品描述:',
      content: desc
    },
    {
      title: '商品价格:',
      content: price + '元'
    },
    {
      title: '所属分类:',
      content: categoryArr[0] + (categoryArr[1] ? ' / ' + categoryArr[1] : '')
    },
    {
      title: '商品图片:',
      content: (
        <PreviewGroup>
          {
            imgs.map(img => {
              return (
                <Image key={img} height={150} src={BASE_IMG_URL + img} fallback={NoImage} />
              );
            })
          }
        </PreviewGroup>
      )
    },
    {
      content: (
        <Descriptions title='商品详情:'>
          <Descriptions.Item label="CPU">{detail['CPU']}</Descriptions.Item>
          <Descriptions.Item label="内存容量">{detail['内存容量']}</Descriptions.Item>
          <Descriptions.Item label="硬盘容量">{detail['硬盘容量']}</Descriptions.Item>
          <Descriptions.Item label="显存容量">{detail['显存容量']}</Descriptions.Item>
          <Descriptions.Item label="显卡类型">{detail['显卡类型']}</Descriptions.Item>
          <Descriptions.Item label="操作系统">{detail['操作系统']}</Descriptions.Item>
          <Descriptions.Item label="光驱类型">{detail['光驱类型']}</Descriptions.Item>
        </Descriptions>
      )
    }
  ]
  const cardTitle = (
    <div>
      <ArrowLeftOutlined className='detail-title-returnIcon' onClick={() => { navigate(-1) }} />
      <span>商品详情</span>
    </div>
  );

  return (
    <div className='manage-detail-wrapper'>
      <Card title={cardTitle} className='manage-detail-card'>
        <List
          dataSource={data}
          renderItem={item => (
            <Item key={item.title} className='detail-list-item'>
              {item.title ? <h3>{item.title}</h3> : null}
              <div>{item.content}</div>
            </Item>
          )}
        />
      </Card>
    </div>
  )
}
