const path = require('path')

module.exports = {
  // publicPath: '../public',
  // outputDir: path.resolve(__dirname, '../public'),
  configureWebpack: {
    resolve: {
      alias: {
        'vue': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
      }
    },
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
    } else {
      // mutate for development...
    }
  },
  chainWebpack: config => {
    config.module.rule('js')
    config.module.rule('js').use('babel-loader')
  },
    
}

