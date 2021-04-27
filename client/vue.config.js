const path = require('path')

module.exports = {
  // publicPath: '../public',
  outputDir: path.resolve(__dirname, '../public'),
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
  // pages: {
  //   index: {
  //     // entry for the page
  //     entry: 'src/main.js',
  //     // the source template
  //     template: 'public/index.html',
  //     // output as dist/index.html
  //     filename: 'index.html',
  //     // when using title option,
  //     // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
  //     title: 'Index Page',
  //     // chunks to include on this page, by default includes
  //     // extracted common chunks and vendor chunks.
  //     // chunks: ['chunk-vendors', 'chunk-common', 'index']
  //   },
  //   test: {
  //      // entry for the page
  //      entry: 'src/test.js',
  //      // the source template
  //      template: 'public/test.html',
  //      // output as dist/index.html
  //      filename: 'index.html',
  //      // when using title option,
  //      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
  //      title: 'Test Page',
  //      // chunks to include on this page, by default includes
  //      // extracted common chunks and vendor chunks.
  //      // chunks: ['chunk-vendors', 'chunk-common', 'index']
  //   }
    // when using the entry-only string format,
    // template is inferred to be `public/subpage.html`
    // and falls back to `public/index.html` if not found.
    // Output filename is inferred to be `subpage.html`.
    // subpage: 'src/subpage/main.js'
  // }
}

