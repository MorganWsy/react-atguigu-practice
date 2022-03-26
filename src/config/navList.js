import {
  HomeOutlined,
  UserOutlined,
  LockOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';

/* KEY：动态配置导航链接！！ */
const navList = [
  {
    key: '/home',//key属性的值与to属性的值一样，所以都统一使用key属性
    icon: <HomeOutlined />,
    title: '首页'
  },
  {
    key: '/user',
    icon: <UserOutlined />,
    title: '用户管理'
  },
  {
    key: '/role',
    icon: <LockOutlined />,
    title: '权限管理'
  },
  {
    key: '/goods',
    icon: <ShopOutlined />,
    title: '商品详情',
    children: [
      {
        key: '/category',
        icon: <ShopOutlined />,
        title: '商品分类'
      },
      {
        key: '/manage',
        icon: <ShoppingCartOutlined />,
        title: '商品管理'
      },
    ]
  },
  {
    key: '/charts',
    icon: <BarChartOutlined />,
    title: '图表',
    children: [
      {
        key: '/bar',
        icon: <BarChartOutlined />,
        title: '柱状图'
      },
      {
        key: '/line',
        icon: <LineChartOutlined />,
        title: '折线图'
      },
      {
        key: '/pie',
        icon: <PieChartOutlined/>,
        title: '饼图'
      }
    ]
  },
];

export default navList;