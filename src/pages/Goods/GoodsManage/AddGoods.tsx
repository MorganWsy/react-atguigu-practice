import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Input, InputNumber, Cascader, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { reqGetCategoryList } from 'api/category';
import UploadImage from './UploadImage';
import RichTextEditor from './RichTextEditor';
import { reqAddOrUpdateGoods } from 'api/goods';
import './AddGoods.scss';

const { Item } = Form;
const { TextArea } = Input;

// antd的格网配置项，一共24格，用span属性指定
const layout = {
  labelCol: { span: 3 },//这个对象用于label的布局
  wrapperCol: { span: 10 },//这个对象用于Input等输入组件
};
const options = [
  {
    value: '电脑',
    label: '电脑',
  },
  {
    value: '女装',
    label: '女装',
  }
];
type Img = {
  name: string,
  uid: string,
  status: "done" | "error" | "uploading" | "removed",
  thumbUrl?: string,
  type?: string,
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
  pageNum: number
}
type FormData = {
  goodsName: string,
  goodsDesc: string,
  goodsPrice: number,
  goodsCategory: string[],
  goodsImg: string[],
  goodsDetail: string
}
// 商品的一级分类和二级分类
type Category = {
  _id: string,
  parentId: string,
  name: string,
  _v: number
}
type CascaderOption = {
  value: string,
  label: string,
  loading?: boolean,
  isLeaf?: boolean,
  children?: CascaderOption[]
}
type ChildObj = {
  getHTMLFromEditor: () => string
}

const AddGoods = () => {
  let categoryList: string[] = [];
  const [form] = Form.useForm();
  const myRef = useRef();

  const naviagte = useNavigate();
  // KEY: 如果是添加商品，则【product】为空，退一步取空对象，这样不会报错
  const state = useLocation().state as Detail;
  const product = state.product || {};
  // 取出用户当前页
  const {pageNum} = state;
  const [cascaderOptions, setCascaderOptions] = useState<CascaderOption[]>(options);


  const cardTitle = (
    <div>
      {/* KEY: 将用户当前所在页传回ManangeHome组件 */}
      <ArrowLeftOutlined className='add-title-returnIcon' onClick={() => { naviagte('/goods/manage',{state:{pageNum}})}} title='返回' />
      <span>{product._id ? '修改商品信息' : '添加商品'}</span>
    </div>
  );

  // NOTE：从子组件UploadImage中拿到保存所有已上传的图片的数组
  function getImgNameList(imgList: Img[]) {
    // 将每个图片的文件名取出，生成一个新数组
    const imgNameList = imgList.map((img) => img.name);
    // 将图片名数组设置为表单goodsImg字段的值
    form.setFieldsValue({ goodsImg: imgNameList });
  }
  // 提交表单且数据验证成功后回调事件
  async function handleSubmitForm(formData: FormData) {
    // 1.拿到表单数据
    const { goodsName, goodsDesc, goodsPrice, goodsCategory, goodsImg } = formData;
    const goodsDetail = (myRef.current! as ChildObj).getHTMLFromEditor();
    const goods = {
      name: goodsName,
      desc: goodsDesc,
      price: goodsPrice,
      imgs: goodsImg,
      detail: goodsDetail,
      isSale: true
    }
    let pCategoryId = '';
    let categoryId = '';
    if (goodsCategory.length === 1) {
      // 商品位于一级分类
      pCategoryId = '0';
      categoryId = goodsCategory[0];
    } else {
      // 商品位于二级分类
      pCategoryId = goodsCategory[0];
      categoryId = goodsCategory[1];
    }
    // 2.发送ajax请求
    if (product._id) {
      // 更新商品，需要传商品的id
      const data = await reqAddOrUpdateGoods({ ...goods, pCategoryId, categoryId }, product._id);
      // 3.根据请求结果提示用户
      if (data) {
        message.success('商品更新成功');
        naviagte(-1);
      }
    } else {
      // 添加商品
      const data = await reqAddOrUpdateGoods({ ...goods, pCategoryId, categoryId });
      if (data) {
        // 3.根据请求结果提示用户
        message.success('商品添加成功');
        naviagte(-1);
      }
    }
  }
  // 通过发送ajax请求获取商品分类列表，用于级联选择器
  async function getGoodsCategory(parentId: string) {
    // 1.获取分类列表。data 可能为空数组
    const data: Category[] = await reqGetCategoryList(parentId);
    // 如果是获取的一级分类列表，则将一级分类列表存入状态中
    if (parentId === '0') {
      // 2.根据分类列表初始化级联选择器的options属性
      const options: CascaderOption[] = data.map((category) => {
        // 必须加上【isLeaf】属性
        return { value: category._id, label: category.name, isLeaf: false };
      });
      // 如果是【修改商品】且该商品是二级分类商品，初始化级联选择器时，默认选中当前商品的分类
      if (product._id && product.pCategoryId !== '0') {
        // NOTE: 获取二级分类列表。这里有点绕，注意不是product.categoryId。因为分类列表是通过上一级分类的id来获取的，即你要获取所有二级分类，则需要传递它们的上一级分类的id
        const subCategorys: Category[] = await reqGetCategoryList(product.pCategoryId);
        // 找到该二级分类的一级分类
        const targetOption = options.find((c) => { return c.value === product.pCategoryId })!;
        if (subCategorys && subCategorys.length > 0) {
          const subOptions: CascaderOption[] = subCategorys.map((c) => {
            return { value: c._id, label: c.name, isLeaf: true };
          });
          // 给该一级分类加上children属性
          targetOption.children = subOptions;
        } else {
          targetOption.isLeaf = true;
        }
      }
      // 修改了targetOption对象后，也会更改原数组options
      setCascaderOptions(options);
    } else {
      // 如果是二级分类列表，则作为返回值
      return data;
    }
  }

  // selectedOptions是一个数组，它的第一项就是我们选中的分类对象（CascaderOption类型）
  async function loadData(selectedOptions: any) {
    const targetOption: CascaderOption = selectedOptions[0];
    targetOption.loading = true;

    // 发送ajax请求，获取选中的一级分类的二级分类列表(targetOption.value为选中的一级分类的id)
    const subCategorys = await getGoodsCategory(targetOption.value);
    if (subCategorys && subCategorys.length > 0) {
      const subOptions = subCategorys.map((category) => {
        // KEY：不用忘记加上 isLeaf 属性，因为二级分类没有子分类了
        return { value: category._id, label: category.name, isLeaf: true };
      });
      targetOption.children = subOptions;
    } else {
      // NOTE：如果二级分类列表为空，则说明该一级分类中没有二级分类
      targetOption.isLeaf = true;
    }
    // 关闭加载状态
    targetOption.loading = false;
    // KEY：更新状态。不是传递targetOptions来更新状态
    setCascaderOptions([...cascaderOptions]);
  };

  useEffect(() => {
    getGoodsCategory('0');
    if (product._id) {
      const { pCategoryId, categoryId } = product;
      if (pCategoryId === '0') {
        // 说明是一级分类下的商品
        categoryList.push(categoryId);
      } else {
        // 说明是二级分类下的商品
        categoryList.push(pCategoryId);
        categoryList.push(categoryId);
      }
    }
  }, []);

  return (
    <div className="manage-add-wrapper">
      <Card title={cardTitle} className='manage-add-card'>
        <Form {...layout} name='goodsForm' onFinish={handleSubmitForm} form={form}>
          <Item name='goodsName' label='商品名称' initialValue={product.name} rules={[{ required: true, message: '商品名称是必填项' }]}>
            <Input type="text" placeholder='请输入商品名称' autoFocus />
          </Item>
          <Item name='goodsDesc' label='商品描述' initialValue={product.desc} rules={[{ required: true, message: '商品描述是必填项' }]}>
            <TextArea placeholder='请输入商品描述内容' allowClear autoSize={{ minRows: 2, maxRows: 6 }}></TextArea>
          </Item>
          <Item name='goodsPrice' label='商品价格' initialValue={product.price} rules={[{ required: true, message: '商品价格是必填项' }]}>
            <InputNumber prefix='￥' style={{ width: '100%' }}></InputNumber>
          </Item>
          <Item name='goodsCategory' label='商品分类' initialValue={categoryList} rules={[{ required: true, message: '商品分类是必填项' }]}>
            {/* KEY: 使用了【loadData】属性，则必须设置【isLeaf】属性，即只有一级分类中有二级分类时，【loadData】才会响应 */}
            <Cascader placeholder='请选择商品的类别' options={cascaderOptions} loadData={loadData} allowClear={false} />
          </Item>
          <Item name='goodsImg' label='商品图片'>
            {/* @ts-ignore */}
            <UploadImage product={product} getImgNameList={getImgNameList} />
          </Item>
          <Item name='goodsDetail' label='商品详情' wrapperCol={{ span: 20 }}>
            <RichTextEditor ref={myRef} product={product} />
          </Item>
          <Item wrapperCol={{ ...layout.wrapperCol, offset: 3 }}>
            <Button type='primary' htmlType='submit'>{product._id ? '修改' : '添加'}</Button>
          </Item>
        </Form>
      </Card>
    </div>
  )
}

export default AddGoods;
