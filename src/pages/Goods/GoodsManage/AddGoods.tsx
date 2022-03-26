import React from 'react';
import { Card, Form, Input, InputNumber, Cascader, Upload } from 'antd';
import { ArrowLeftOutlined,PlusOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import './AddGoods.scss';

const { Item } = Form;
const { TextArea } = Input;

const cardTitle = (
  <div>
    <ArrowLeftOutlined className='add-title-returnIcon' />
    <span>商品详情</span>
  </div>
)

// antd的格网配置项，一共24格，用span属性指定
const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 },
};
const option = [{
  value: '电脑',
  label: '电脑',
  children: [{
    value: '笔记本电脑',
    label: '笔记本电脑'
  }, {
    value: '台式电脑',
    label: '台式电脑'
  }]
}, {
  value: '女装',
  label: '女装',
  children: [{
    value: '短袖',
    label: '短袖'
  }, {
    value: '长袖',
    label: '长袖'
  }, {
    value: '毛衣',
    label: '毛衣'
  }]
}];
const fileList: UploadFile[] = [
  {
    uid: '1',
    name: 'myImg.png',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    status: 'done'
  }
];
const uploadBtn = (
  <div>
    <PlusOutlined />
    <div>上传图片</div>
  </div>
);
export default function AddGoods() {
  function handleSubmitForm() {

  }
  return (
    <div className="manage-add-wrapper">
      <Card title={cardTitle} className='manage-add-card'>
        <Form {...layout} name='goodsForm' onFinish={handleSubmitForm}>
          <Item name='goodsName' label='商品名称' rules={[{ required: true, message: '商品名称是必填项' }]}>
            <Input type="text" placeholder='请输入商品名称' autoFocus />
          </Item>
          <Item name='goodsDesc' label='商品描述' rules={[{ required: true, message: '商品描述是必填项' }]}>
            <TextArea placeholder='请输入商品描述内容' allowClear autoSize={{ minRows: 2, maxRows: 6 }}></TextArea>
          </Item>
          <Item name='goodsPrice' label='商品价格' rules={[{ required: true, message: '商品价格是必填项' }]}>
            <InputNumber prefix='￥' style={{ width: '100%' }}></InputNumber>
          </Item>
          <Item name='goodsCategory' label='商品分类' rules={[{ required: true, message: '商品分类是必填项' }]}>
            <Cascader placeholder='请选择商品的类别' options={option} />
          </Item>
          <Item name='goodsImg' label='商品图片'>
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              fileList={fileList}
            // onPreview={this.handlePreview}
            // onChange={this.handleChange}
            >
              {/* 如果图片的数量大于5张，则不显示上传按钮 */}
              {fileList.length > 5 ? null: uploadBtn}
            </Upload>
          </Item>
        </Form>
      </Card>
    </div>
  )
}
