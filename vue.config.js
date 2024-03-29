const path = require('path')

module.exports = {
  // publicPath: '../public',
  indexPath: 'index.ejs',
  pages: {
    index: {
      entry: 'client/src/main.js',
      template: 'client/public/index.ejs'
    }
  },
  configureWebpack: config => {
    config.resolve = {
      alias: {
        '@': path.resolve(__dirname, 'client/src'),
        'vue': 'vue/dist/vue.esm.js', // 'vue/dist/vue.common.js' for webpack 1
        'codem': 'codemirror/',
      }
    }
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
      console.log('production')
      console.log(config)
      // config.pages.index.template = 'client/public/index.ejs'
    } else {
      // mutate for development...
      console.log('development')
      console.log(config)
      // config.pages.index.template = 'client/public/dev_index.ejs'

    }
  },
  chainWebpack: config => {
    config.module.rule('js')
    config.module.rule('js').use('babel-loader')
    config
      .plugin('copy')
      .use(require('copy-webpack-plugin'), [[{
        from: path.resolve(__dirname, 'client/public'),
        to: path.resolve(__dirname, 'dist'),
        toType: 'dir',
        ignore: ['.DS_Store']
    }]])
  },
  // pages: {
  //   project: {
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
  //   home: {
  //      // entry for the page
  //      entry: 'src/home.js',
  //      // the source template
  //      template: 'public/index.html',
  //      // output as dist/index.html
  //      filename: 'index.html',
  //      // when using title option,
  //      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
  //      title: 'Home Page',
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

