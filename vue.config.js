// vue.config.js
const px2rem = require('postcss-px2rem')

const postcss = px2rem({
  remUnit: 75
})
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#454B6C',
          'link-color': '#CACACA',
          'success-color': '#52c41a',
          'border-radius-base': '2px',
        },
        javascriptEnabled: true
      },
      postcss: {
        plugins: [
          postcss
        ]
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://hanshe.hsretreats.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}