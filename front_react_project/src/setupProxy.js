const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // 프록시를 적용할 경로
    createProxyMiddleware({
      target: 'http://localhost:5000', // 백엔드 서버의 주소
      changeOrigin: true,
    })
  );
};