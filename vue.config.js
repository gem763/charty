const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,

  devServer: {
    // https://soraji.github.io/vue/2021/06/05/%EA%B3%B5%EA%B3%B5%EB%8D%B0%EC%9D%B4%ED%84%B0cors/
    proxy: {
      '/': {
        "target": 'https://m.stock.naver.com',
        "pathRewrite": {'^/':''},
        "changeOrigin": true,
        "secure": false,
        'ws': false, //https://github.com/vuejs/vue-cli/issues/1850
      }
    }
	} 
})		
