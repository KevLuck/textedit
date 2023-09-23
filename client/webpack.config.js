const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BabelLoader = require('babel-loader');

// TODO: Add CSS loaders and babel to webpack.
// Add Workbox plugins for a service worker and manifest file
module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'My PWA',
      }),
      new WebpackPwaManifest({
        name: 'My PWA',
        short_name: 'My PWA',
        description: 'A progressive web app.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: path.resolve(__dirname, 'src/images/icon-192x192.png'),
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: path.resolve(__dirname, 'src/images/icon-512x512.png'),
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      }),
      new InjectManifest({
        swSrc: './src/sw.js',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: BabelLoader,
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
  };
};
