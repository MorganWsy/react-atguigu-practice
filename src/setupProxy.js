/* 配置服务器代理。需要使用commonjs规范。
  注意：修改了这个文件，要想生效一定要重启前端服务器！！！
*/
const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    proxy.createProxyMiddleware('/api1', {
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/api1': ''
      }
    }),
    // 不起作用，很奇怪
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