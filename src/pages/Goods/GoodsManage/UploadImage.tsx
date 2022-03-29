import React, { useState, useEffect } from 'react';
import { message, Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BASE_IMG_URL } from 'utils/constant';
import {reqRemoveGoodsImg} from '../../../api/goods';

interface IProps {
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
  getImgNameList: (imgList:Img[]) => {}
}
type Img = {
  name: string,
  uid: string,
  status: "done" | "error" | "uploading" | "removed",
  thumbUrl?: string,
  type?: string,
}
export default function UploadImage(props: IProps) {
  // imgList是个数组，用来保存已上传的图片文件对象
  const [imgList, setImgList] = useState<Img[]>(initImgList());
  // 保存图片预览对话框是否显示
  const [previewVisible, setPreviewVisible] = useState(false);
  // 保存图片预览时的url
  const [previewImg, setPreviewImg] = useState('');
  // 保存图片预览时显示的标题
  const [previewTitle, setPreviewTitle] = useState('');

  const uploadBtn = (
    <div>
      <PlusOutlined />
      <div>上传图片</div>
    </div>
  );
  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (err) => {
        reject(err);
      }
    })
  }
  // file对象就是imgList数组中的对象
  async function handlePreview(file: any) {
    // NOTE：如果是预览刚上传好的图片，则file对象包含originFileObj属性，则以base64编码的形式展示图片预览。代码来自antd官网
    if(!file.url && !file.preview){
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewVisible(true);
    setPreviewImg(file.url || file.preview);
    setPreviewTitle(file.name);
  }

  // 图片上传中、完成、失败都会调用这个函数。
  async function handleChange(changeObj: any) {
    const { file, fileList } = changeObj;
    const {getImgNameList} = props;

    if(file.status === 'done'){
      // 上传成功
      message.success('上传成功');
    }else if(file.status === 'error'){
      message.error('上传失败');
    }else if(file.status === 'removed'){
      // 删除图片
      const data = await reqRemoveGoodsImg(file.name);
      if(data){
        message.success('删除成功');
      }
    }
    console.log(file);

    getImgNameList([...fileList]);
    // KEY: 注意，1、如果Upload组件是受控的，则在 onchange 事件中需要一直用 fileList 更新状态，否则 onchange 事件的 file 对象的 status 属性一直是 'loading'。2、为了让react感受到状态的变化，最好用新的 fileList 更新状态。
    setImgList([...fileList]);
  }

  function handlePreviewModalCancel() {
    setPreviewVisible(false);
  }
  //【修改商品】组件挂载时，根据商品的imgs属性，初始化已上传的图片并显示
  function initImgList() {
    const {product} = props;
    if (product.imgs) {
      const { imgs } = product;
      const list = imgs.map((img, key) => {
        return { uid: String(key), url: BASE_IMG_URL + img, name: img, status: 'done' as 'done' };
      });
      // setImgList(list);
      return list;
    } else {
      // setImgList([]);
      return [];
    }
  }
  useEffect(() => {
    // initImgList();
  },[])

  return (
    <>
      <Upload
        action='/api1/goods/manage/img/upload' // KEY:将图片上传到哪，即服务器端的接口。在前端设置好代理，在后端定义好接口，不需要我们手动调用这个接口！
        accept='image/*' // 能够上传的文件类型（image/* 表示可上传所有图片类型的文件|），也可以'.jpeg,.png,.gif'这么设置
        name='image' // 发到服务器的文件参数名。服务器的接口通过这个属性来判断上传的是不是图片
        listType="picture-card" // 以卡片的形式显示页面中已上传的图片
        fileList={imgList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {/* 如果图片的数量大于5张，则不显示上传按钮 */}
        {imgList.length > 5 ? null : uploadBtn}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handlePreviewModalCancel}
      >
        <img alt={previewTitle} style={{ maxHeight:500 }} src={previewImg} />
      </Modal>
    </>
  )
}
