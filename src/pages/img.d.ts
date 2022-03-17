/* 在ts项目中，ts会检查代码，但是图片不是代码，在组件中引入时会报错，所以需要声明图片格式，使ts编译图片 */
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';

