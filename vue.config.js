const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,

  devServer: {
    // port: 80,
    // host: '0.0.0.0',

    // https://soraji.github.io/vue/2021/06/05/%EA%B3%B5%EA%B3%B5%EB%8D%B0%EC%9D%B4%ED%84%B0cors/
    proxy: {
      '/naver_stock': {
        "target": 'https://m.stock.naver.com',
        "pathRewrite": {'^/naver_stock':''},
        // "pathRewrite": {'^/':''},
        "changeOrigin": true,
        "secure": false,
        'ws': false, //https://github.com/vuejs/vue-cli/issues/1850
      },

      '/naver_trend': {
        "target": 'https://openapi.naver.com',
        "pathRewrite": {'^/naver_trend':''},
        "changeOrigin": true,
        "secure": false,
        'ws': false, 
      }
    }
	},

  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ]
  }
})		
