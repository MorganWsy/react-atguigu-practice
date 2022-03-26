import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, Table, Tag,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from 'components/LinkButton';
import { reqGetGoodsList, reqSearchGoods, reqUpdateIsSale, reqGetGoodsCategory } from 'api/goods';
import { PAGE_SIZE } from 'utils/constant';
import './index.scss';

const { Search } = Input;
const { Option } = Select;


type GoodsData = {
  list: Good[],
  pageNum: string,
  pageSize: string,
  pages: number,
  total: number
}
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
type Category = {
  _id: string,
  parentId: string,
  name: string,
  _v: number
}
export default function ManageHome() {
  const navigate = useNavigate();
  const [currPageNum, setcurrPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [goods, setGoods] = useState<GoodsData>({
    list: [
      {
        isSale: true,
        imgs: [],
        _id: '',
        name: '',
        desc: '',
        price: 0,
        pCategoryId: '',
        categoryId: '',
        detail: {},
        _v: 0
      },
    ],
    pageNum: '1',
    pageSize: '3',
    pages: 0,
    total: 0
  });
  // 下拉列表的状态
  const [searchType, setSearchType] = useState('name');
  // 用于搜索的input框的状态
  const [searchContent, setSearchContent] = useState('');

  const MySelect = (
    <Select defaultValue='name' style={{ width: '120px' }} onChange={handleSelectChange}>
      <Option value='name'>按名称搜索</Option>
      <Option value='desc'>按描述搜索</Option>
    </Select>
  );
  const cardTitle = (
    <Search
      addonBefore={MySelect}
      placeholder="请输入关键字"
      allowClear
      enterButton
      onSearch={onSearch}
      style={{ width: '28vw' }}
    />
  );
  const cardExtra = (
    <Button type='primary' icon={<PlusOutlined />} onClick={() => {navigate('addgoods')}}>添加商品</Button>
  );
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '商品描述',
      dataIndex: 'desc',
      key: 'desc'
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: '10%',
      render: (price: number) => '￥' + price
    },
    {
      title: '状态',
      dataIndex: 'isSale',
      key: 'isSale',
      width: '7%',
      // render函数接收到的参数是由"dataIndex"属性的值绝对的。如果不写"dataIndex"属性，则render函数默认接收的是每列字段组成的对象
      render: (isSale: boolean) => {
        let color = '',
          describtion = '';
        if (isSale) {
          color = 'seagreen';
          describtion = '在售';
        } else {
          color = '#ff5100';
          describtion = '已下架';
        }
        return (
          <Tag color={color}>{describtion}</Tag>
        )
      }
    },
    {
      title: '操作',
      width: '15%',
      render: (product: Good) => {
        return (
          <div>
            <Button onClick={() => { handleSale(product) }} type='primary' size='small' className='manage-action-btn'>{product.isSale ? '下架' : '上架'}</Button>
            <LinkButton style={{ color: 'seagreen' }} onClick={() => { showGoodsDetail(product) }}>详情</LinkButton>
            <LinkButton style={{ color: '#ff5100' }}>修改</LinkButton>
          </div>
        )
      }
    },
  ];
  async function showGoodsDetail(product: Good) {
    // NOTE：在路由跳转前发送ajax请求，获取分类的名称，体验更好，不会有延迟。如果在GoodsDetail组件中发送ajax请求，会有一点延迟！
    const { categoryId, pCategoryId } = product;
    let name: string[] = [];
    if (pCategoryId === '0') {
      // 商品位于一级分类下，只需要获取一级分类的名称
      const data: Category = await reqGetGoodsCategory(categoryId);
      name[0] = data.name;
    } else {
      // 商品位二级分类下，需要同时获取一级分类的名称和二级分类的名称
      // KEY：Promise.all方法同时发送两个ajax请求，这相当于并联，只有都成功了，才会返回数据。而前后发送两次ajax请求，相当于串联，效率会低
      const data: Category[] = await Promise.all([reqGetGoodsCategory(pCategoryId), reqGetGoodsCategory(categoryId)]);
      name[0] = data[0].name;
      name[1] = data[1].name;
    }
    // KEY: 使用useNavigate函数跳转到detail路由，并通过state属性将product对象传入detail路由
    navigate('detail', {
      state: {
        product,
        name
      }
    }); 
  }
  async function handleSale(product: Good) {
    // 拿到当前商品的id和销售状态
    const { _id, isSale } = product;
    // 发送ajax请求，修改相应商品的销售状态
    const data: Good = await reqUpdateIsSale(_id, isSale);
    // NOTE：如果修改后的数据的isSale值和修改前的isSale值不同，则说明修改成功
    if (data.isSale !== isSale) {
      getGoodsList(currPageNum);
      message.success('商品状态修改成功');
    }
  }
  function handleSelectChange(value: string) {
    setSearchType(value);
  }
  // input框+搜索按钮对应的事件
  function onSearch(value: string) {
    // NOTE: 点击搜索按钮，更新状态，状态一变更就重新调用getGoodslist函数
    setSearchContent(value);
  }

  async function getGoodsList(pageNum = 1) {
    setIsLoading(true);

    let data;
    // 如果搜索框的内容不为空，说明要搜索商品；为空，说明只是获取商品列表
    if (searchContent) {
      data = await reqSearchGoods({ pageNum, pageSize: PAGE_SIZE, type: searchType, content: searchContent });
    } else {
      data = await reqGetGoodsList(pageNum, PAGE_SIZE);
    }
    // 拿到数据
    if (data) {
      // 更新状态
      setGoods(data);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getGoodsList(1);
  }, [searchContent]);

  return (
    <div className='manage-wrapper'>
      <Card title={cardTitle} extra={cardExtra} className='manage-card'>
        <Table
          dataSource={goods.list}
          columns={columns}
          loading={isLoading}
          bordered
          rowKey='_id'
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true, total: goods.total }}
          // 选择不同的页码，重新发送请求来获取相应的数据
          onChange={({ current }) => {
            getGoodsList(current!);
            setcurrPageNum(current!);
          }}
        >
        </Table>
      </Card>
    </div>
  )
}
