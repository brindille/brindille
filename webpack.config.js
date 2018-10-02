const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer-stylus')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackBar = require('webpackbar')
const LiveReloadPlugin = require('webpack-livereload-plugin')

module.exports = env => {
  const isProd = env && env.prod
  const config = {
    mode: isProd ? 'production' : 'development',
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
    watch: !isProd,
    module: {
      rules: [
        {
          test: /\.styl$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                minimize: isProd
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                use: [autoprefixer()]
              }
            }
          ]
        },
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
    },
    plugins: []
  }

  if (isProd) {
    config.optimization = {
      minimizer: [new UglifyJsPlugin()]
    }
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new WebpackBar()
    )
  } else {
    config.devtool = '#source-map'
    config.plugins.push(
      new webpack.optimize.OccurrenceOrderPlugin(),
      // new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new LiveReloadPlugin({ appendScriptTag: true })
    )
  }

  return config
}
