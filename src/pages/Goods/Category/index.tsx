import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Modal, Select, Input, Form, message } from 'antd';
import { PlusOutlined, CloseOutlined, ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from '../../../components/LinkButton';
import { reqGetCategoryList, reqAddCategory, reqUpdateCategory } from 'api/category';
import './index.scss';

const { Option } = Select;
const { Item } = Form;


type category = {
  _id: string,
  parentId: string,
  name: string
}
export default function Category() {
  const [list, setList] = useState([{ _id: '', parentId: '0', name: '' }]);
  const [subList, setSubList] = useState([{ _id: '', parentId: '0', name: '' }]);
  // 三用。isModalVisible=0表示不展示对话框，isModalVisible=1表示展示添加分类的对话框，isModalVisible=2表示修改分类的对话框
  const [isModalVisible, setIsModalVisible] = useState(0);
  const [selectValue, setSelectValue] = useState('一级分类');
  // 存储需要添加二级分类的一级分类的名称
  const [subSelectVal, setSubSelectVal] = useState('');
  // 两用。存储【添加分类】的分类名称和【修改分类】的分类名称
  const [inputValue, setInputValue] = useState('');
  // 两用。存储分类是否添加成功、修改成功
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setLoading] = useState(false);
  // 每当点击'查看子分类'时触发
  const [{ parentId, name }, setCategory] = useState({ parentId: '0', name: '' });
  //用于存储需要修改的分类的id
  const [id, setId] = useState('');
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  let cardTitle = (
    <div>
      <LinkButton onClick={returnFirstList}>一级分类</LinkButton>
      {name ? <ArrowRightOutlined /> : null}
      <span style={{ color: '#ff5100', marginLeft: '1vw' }}>{name}</span>
    </div>
  );
  // 定义表格的列
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '操作',
      // NOTE: 这里必须是key属性，而不是dataIndex属性。值随便取
      key: 'operation',
      width: '30%',
      render: (record: category) => {
        return (
          <div>
            <LinkButton style={{ color: '#ff5100' }} onClick={() => { showUpdateModal(record) }}>修改分类</LinkButton>
            {parentId === '0' ? <LinkButton onClick={() => { showSubCategory(record) }} style={{ color: 'seagreen' }}>查看子分类</LinkButton> : null}
          </div>
        )
      }
    },
  ];
  async function getCategoryList(parentId: string) {
    // 在请求商品列表之前，显示loading状态
    setLoading(true);
    // data可能是一级分类的数组，也可能是二级分类的数组
    const data: category[] = await reqGetCategoryList(parentId);
    let newData = data.map((category) => {
      return { ...category, key: category._id };
    });
    // 如果parentId为0，则表示当前获取的是一级分类列表
    if (parentId === '0') {
      setList(newData);
    } else {
      setSubList(newData);
    }
    // 在请求到数据后关闭loading
    setLoading(false);
  }

  //#region 添加分类
  function showAddModal() {
    // 打开添加分类的对话框
    setIsModalVisible(1);
    console.log(parentId);
    // 根据parentId设置第一个select的默认值
    parentId === '0' ? setSelectValue('一级分类') : setSelectValue('二级分类');
    // 设置第二个select的默认值
    setSubSelectVal(name);
  }
  // NOTE: 根据parenId来判断是添加一级分类还是二级分类，若parentId为'0'，则表示添加一级分类
  async function addCategory(parentId: string, categoryName: string) {
    let data: category = await reqAddCategory(parentId, categoryName);
    // 若添加成功，则自动关闭弹出框
    if (data.parentId) {
      // 关闭对话框
      setIsModalVisible(0);
      // 更新状态，以便重新发送请求获取商品分类列表
      isSuccess ? setIsSuccess(false) : setIsSuccess(true);
      // 清空input框
      // setInputValue('');//Input组件没有被Form包裹之前
      form1.setFieldsValue({categoryName1: ''});//Input组件被Form包裹之后
    }
  }
  function handleOk() {
    if (selectValue === '二级分类') {
      let category = list.find((c) => c.name === subSelectVal);
      // 如果匹配到了对应的一级分类
      if (category) {
        addCategory(category._id, inputValue);
      } else {
        message.error('商品分类列表中没有此一级分类');
      }
    } else {
      addCategory('0', inputValue);
    }
  }
  function handleCancel() {
    setIsModalVisible(0);
    // 清空input框
    form1.setFieldsValue({categoryName1: ''});
  }
  // 第一个选择框
  function handleSelectChange(value: string) {
    setSelectValue(value);
  }
  // 第二个选择框
  function handleSecondSelect(value: string) {
    // NOTE:value 是一级分类的name
    setSubSelectVal(value);
  }
  function handleInputChange(e: any) {
    const { target: { value } } = e;
    setInputValue(value);
  }
  //#endregion

  //#region 查看子分类
  function showSubCategory(category: category) {
    // 得到一级分类的_id和分类名
    const { _id, name } = category;
    // 将一级分类的id作为二级分类的parentId。只要parentId发生变化，getCategoryList函数就会重新调用
    setCategory({ parentId: _id, name: name });
    // 默认选中'添加二级分类'
    setSelectValue('二级分类');
  }
  function returnFirstList() {
    // 如果状态name不为空，说明有返回一级分类列表的需求
    if (name) {
      setCategory({ parentId: '0', name: '' });
    }
  }
  //#endregion

  //#region 修改分类
  function showUpdateModal(category: category) {
    // 展示修改对话框
    setIsModalVisible(2);
    // 找到要修改的分类，并存入state中
    setId(category._id);
    // KEY：当在Form组件中使用Input时，Input组件的value受Form组件控制，其值无法通过setState方法进行更新，只能使用Form组件的实例对象的setFieldsValue方法更新。categoryName与Item组件的name属性对应！
    form2.setFieldsValue({ categoryName2: category.name });
    // setInputValue(category.name);
  }
  function handleUpdateOk() {
    // 验证表单项是否合法
    form2.validateFields(['categoryName2']).then(async (value) => {
      // NOTE: 如果Item的name属性值变了，则value对象中的属性也跟着变
      const { categoryName2 } = value;
      // 更新分类列表
      reqUpdateCategory(id, categoryName2);
      // 修改状态，以重新调用getCategoryList函数
      // setIsSuccess(true); //BUG：有bug。如果连续修改两个分类的名称，在修改完第一个分类的名称之后，isSuccess就已经是true了，再修改第二个分类，再setIsSuccess(true)，react会认为isSuccess状态没有改变，所以不会重新调用getCategoryList函数来刷新列表。

      isSuccess ? setIsSuccess(false) : setIsSuccess(true);
      setIsModalVisible(0);
      // 清空input
      form2.setFieldsValue({categoryName2:''});
    }).catch((err) => {
      console.warn(err);
    });
  }

  function handleUpdateCancel() {
    setIsModalVisible(0);
  }
  //#endregion

  useEffect(() => {
    getCategoryList(parentId);
    // 如果isSuccess状态更改了，则重新执行getCategoryList函数
  }, [isSuccess, parentId]);

  return (
    <div className='category-wrapper'>
      <Card className='category-card' title={cardTitle} extra={<Button type='primary' icon={<PlusOutlined />} onClick={showAddModal}>添加分类</Button>}>

        {/* rowKey的值也可以是函数：{(record:category) => record._id} */}
        <Table dataSource={parentId === '0' ? list : subList} columns={columns} bordered rowKey='_id' pagination={{ defaultPageSize: 8, showQuickJumper: true }} loading={isLoading}></Table>

      </Card>
      <Modal title="添加分类" visible={isModalVisible === 1} onOk={handleOk} onCancel={handleCancel}>
        <Select value={selectValue} onChange={handleSelectChange}>
          <Option value="一级分类" key='一级分类'>添加一级分类</Option>
          <Option value="二级分类" key='二级分类'>添加二级分类</Option>
        </Select>
        <Select value={subSelectVal} onChange={handleSecondSelect} disabled={selectValue === '二级分类' ? false : true}>
          {
            // 显示一级分类
            list.map((category: category) => {
              return (
                <Option value={category.name} key={category._id}>{category.name}</Option>
              )
            })
          }
        </Select>
        <Form form={form1}>
          <Item name='categoryName1' initialValue={inputValue}>
            <Input placeholder='请输入分类的名称' allowClear={{ clearIcon: <CloseOutlined /> }} onChange={handleInputChange} />
          </Item>
          {/* <Input value={inputValue} placeholder='请输入分类的名称' allowClear={{ clearIcon: <CloseOutlined /> }} onChange={handleInputChange} /> */}
        </Form>
      </Modal>
      {/* "修改分类"的对话框 */}
      <Modal title="修改分类名称" visible={isModalVisible === 2} forceRender onOk={handleUpdateOk} onCancel={handleUpdateCancel}>
        <Form form={form2}>
          {/* 如果在Form中使用Input，则Input组件的value属性没用了，可以指定Item组件的initialValue属性  */}
          <Item name='categoryName2' initialValue={inputValue} rules={[{ required: true, message: '提交前应填写分类名称' }, { pattern: /^[a-z|0-9|\p{Unified_Ideograph}]+$/iu, message: '分类名称只能是数字、中文、英文' }]}>
            <Input placeholder='请输入分类的名称' allowClear={{ clearIcon: <CloseOutlined /> }} onChange={handleInputChange} />
          </Item>
        </Form>
      </Modal>
    </div>
  )
}
