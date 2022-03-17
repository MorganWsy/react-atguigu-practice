const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      // 使用CracoLessPlugin自定义主题颜色
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // 自定义less变量
            modifyVars: {
              '@primary-color': '#282c34',
              '@success-color': '#5ecdc4',
              '@warning-color': '#6d4cc2',
              '@error-color': '#e64a19',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  babel: {
    plugins: [
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true,// 或者 'css'
        },
      ],
    ],
  }
}