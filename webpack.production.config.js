const path = require('path')
const webpack = require('webpack')

const APP_DIR = path.resolve(__dirname, 'src')
const BUILD_DIR = path.resolve(__dirname, 'dist')

const base = {
  entry: [
    './src/index.js',
  ],
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: APP_DIR,
      exclude: [ /\.spec\.js/ ]
    }]
  },
  plugins: []
}

base.devtool = 'source-map'
base.plugins = base.plugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    comments: false
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: "'production'"
    }
  })
])

module.exports = base