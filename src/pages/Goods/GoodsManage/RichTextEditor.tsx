import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
// 引入富文本编辑器的样式文件
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface IProps {
  ref: any,
  product: Good
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
const RichTextEditor = forwardRef((props: IProps, ref: any) => {
  const [editorState, setEditorState] = useState(initEditorState());

  // 组件一挂载，就根据商品的detail属性初始化富文本编辑器里的内容
  function initEditorState() {
    const { product } = props;
    // 如果是【修改商品】，product对象才不为空
    if (product.detail) {
      const html = product.detail;
      const contentBlock = htmlToDraft(html);
      // 如果htmlToDraft函数解析html成功
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        return editorState;
      } else {
        return EditorState.createEmpty();
      }
    } else {
      return EditorState.createEmpty();
    }
  }

  function onEditorStateChange(state: EditorState) {
    setEditorState(state);
  }

  function getHTMLFromEditor() {
    const {blocks,entityMap} = convertToRaw(editorState.getCurrentContent());
    // 删除没有必要的空行。每产生一行，blocks数组中都会多一个对象（保存着这一行的文本和样式信息）
    const content = blocks.filter((row) => {
      return row.text !== '';
    });
    return draftToHtml({blocks:content,entityMap});
  }

  function handleUploadImage(file: any) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api1/goods/manage/img/upload');
      xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        // console.log(response);// /api1/goods/manage/img/upload 接口返回的对象（包括data属性、message属性、status属性）
        // KEY：直接按官方文档来就行，如果和老师一样改了，反而有问题。
        resolve(response);
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  }
  // KEY: 将函数式子组件中的属性或方法暴露给父组件调用
  useImperativeHandle(ref, () => {
    return { getHTMLFromEditor: getHTMLFromEditor }
  });

  return (
    <Editor
      editorState={editorState}
      editorStyle={{ border: '2px solid #333', height: 140, paddingLeft: 5 }}
      onEditorStateChange={onEditorStateChange}
      // 配置工具栏
      toolbar={{
        options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'remove', 'history'],
        link: {
          options: ['link'],
          popupClassName: 'my-link-popup'
        },
        // present: true, mandatory: true 表示显示alt输入框，且必须填写才能上传文件
        image: { uploadCallback: handleUploadImage, alt: { present: true, mandatory: true },popupClassName: 'my-uploadImg-popup' }
      }}
    />
  )
})
export default RichTextEditor;
