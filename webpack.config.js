const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');


module.exports = () => ({
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index-[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
      API_URL: '',
      SENTRY_DSN: '',
      CLIENT_ID: '',
    }),
    new FaviconsWebpackPlugin({
      logo: './src/Logo/images/logo-75x75-blacked.png',
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
