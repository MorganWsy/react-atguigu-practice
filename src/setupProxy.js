/* 配置服务器代理。需要使用commonjs规范 */
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
    proxy.createProxyMiddleware('/api2',{
      target: 'http://localhost: 5000',
      changeOrigin: true,
      pathRewrite: {
        '^api2': ''
      }
    })
  )
}