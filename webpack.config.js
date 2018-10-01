// const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: {
    build: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'public/build'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    alias: {
      lib: path.resolve(__dirname, 'src/lib'),
      views: path.resolve(__dirname, 'src/views'),
      config: path.resolve(__dirname, 'src/config'),
      data: path.resolve(__dirname, 'data'),
      Router: path.resolve(__dirname, 'src/Router')
    }
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.yaml$/,
        loader: 'yaml-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}

module.exports.devtool = '#source-map'
