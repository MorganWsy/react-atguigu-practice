/* 配置服务器代理。需要使用commonjs规范。
  注意：修改了这个文件，要想生效一定要重启前端服务器！！！
*/
const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    // 获取自己服务器的资源
    proxy.createProxyMiddleware('/api1', {
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/api1': ''
      }
    }),
    // 获取百度天气资源的服务器
    proxy.createProxyMiddleware('/weather',{
      target: 'https://api.map.baidu.com',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/weather': ''
      }
    }),
    proxy.createProxyMiddleware('/api2',{
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/api2': ''
      }
    })
  )
}