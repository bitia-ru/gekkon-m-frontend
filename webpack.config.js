const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');


module.exports = () => ({
  entry: ['@babel/polyfill', './src/v1/index.js'],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js',
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(pdf|jpg|png|gif|svg|ico|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[path][name]-[hash].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new webpack.EnvironmentPlugin({
      API_URL: '/api',
      SENTRY_DSN: 'https://dc2e6ebcb5dd4d66a373d0331098cdae:905d88eaf1ae4f479b389fd2739afada@bugs.bitia.ru/18',
      CLIENT_ID: '',
    }),
    new FaviconsWebpackPlugin({
      logo: './src/v1/components/Logo/images/logo-75x75-blacked.png',
      favicons: {
        appName: 'Roving Climbers',
        appShortName: 'RC',
        appDescription: 'Climbing club',
        developerName: 'Bitia',
        developerURL: 'http://bitia.ru',
        appleStatusBarStyle: 'black',
        background: '#000',
        theme_color: '#000',
        orientation: 'portrait',
        start_url: '/',
      },
    }),
  ],
});
