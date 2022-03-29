import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, List, Image, Descriptions } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './GoodsDetail.scss';
import NoImage from '../../../assets/images/noimage.png';
import { BASE_IMG_URL } from 'utils/constant';
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
  categoryName: string[],
  // 当前页码
  pageNum: number
}

export default function GoodsDetail() {
  const navigate = useNavigate();

  // state 对象中包含 product 对象和 name 数组
  const { state } = useLocation();
  const { product: { name, price, desc, imgs, detail }, categoryName: categoryArr,pageNum } = state as Detail;

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
      title: '商品详情:',
      content: (
        // NOTE：dangerouslySetInnerHTML 属性可以将html格式转成普通文本，类似于原生js的innerHTML属性
        <div dangerouslySetInnerHTML={{ __html: detail }} className='detail-list-item-detail'></div>
      )
    }
  ]
  const cardTitle = (
    <div>
      {/* KEY：将用户当前页码再返回给MangeHome组件 */}
      <ArrowLeftOutlined className='detail-title-returnIcon' onClick={() => { navigate('/goods/manage',{state: {pageNum}}) }} title='返回'/>
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
