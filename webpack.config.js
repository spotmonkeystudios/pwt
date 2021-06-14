const path = require('path')

const { ESBuildMinifyPlugin } = require('esbuild-loader')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StylelintWebpackPlugin = require('stylelint-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackEsmodulesPlugin = require('webpack-module-nomodule-plugin')

/** @typedef {import('webpack').Configuration} WebpackConfig */
/** @typedef {import('webpack-dev-server').Configuration} WebpackDevServerConfiguration */
/**
 * @typedef {object} WebpackDevServerConfig
 * @property {WebpackDevServerConfiguration} devServer
 */
/** @typedef {WebpackConfig & WebpackDevServerConfig} Config */

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = !isDevelopment

/** @returns {Config} */
const config = ['modern', isProduction && 'legacy']
  .filter(Boolean)
  .map(build => {
    process.env.BUILD_MODE = build

    return {
      mode: isDevelopment ? 'development' : 'production',
      entry: path.resolve(process.cwd(), 'src', 'main.js'),
      output: {
        path: path.resolve(process.cwd(), 'dist'),
        chunkFilename: isDevelopment
          ? `js/[name].${build}.js`
          : `js/[name].[contenthash].${build}.js`,
        filename: isDevelopment
          ? `js/[name].${build}.js`
          : `js/[name].[contenthash].${build}.js`,
      },
      module: {
        rules: [
          {
            test: /\.vue$/,
            include: [path.resolve(process.cwd(), 'src')],
            exclude: [path.resolve(process.cwd(), 'node_modules')],
            loader: 'vue-loader',
          },
          {
            test: /\.js$/,
            include: [path.resolve(process.cwd(), 'src')],
            exclude: file =>
              /node_modules/.test(file) && !/\.vue\.js/.test(file),
            loader: build === 'legacy' ? 'babel-loader' : 'esbuild-loader',
            options:
              build === 'modern'
                ? {
                    target: 'es2015',
                  }
                : {},
          },
          {
            test: /\.scss$/,
            include: [path.resolve(process.cwd(), 'src')],
            exclude: [path.resolve(process.cwd(), 'node_modules')],
            use: [
              isDevelopment ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader',
            ].filter(Boolean),
          },
          {
            test: /\.pug$/,
            loader: 'pug-plain-loader',
          },
        ],
      },
      resolve: {
        modules: ['node_modules', path.resolve(process.cwd(), 'src')],
        extensions: ['.js', '.vue'],
      },
      devtool: isDevelopment ? 'source-map' : false,
      devServer: {
        contentBase: path.join(process.cwd(), 'public'),
        compress: true,
        historyApiFallback: true,
        hot: true,
        open: true,
        port: 3000,
      },
      experiments: {
        topLevelAwait: true,
      },
      plugins: [
        // @ts-ignore
        new ESLintWebpackPlugin({
          files: ['src/**/*.{js,vue}'],
        }),
        // @ts-ignore
        new StylelintWebpackPlugin({
          files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}'],
        }),
        // @ts-ignore
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
          inject: 'body',
          minify: isProduction,
          template: path.resolve(process.cwd(), 'public', 'index.html'),
        }),
        new MiniCssExtractPlugin({
          filename: isDevelopment
            ? 'css/[name].css'
            : 'css/[name].[contenthash].css',
        }),
        new HtmlWebpackEsmodulesPlugin(build),
      ],
      optimization: {
        chunkIds: isProduction ? 'deterministic' : 'named',
        moduleIds: isProduction ? 'deterministic' : 'named',
        mangleExports: isProduction ? 'deterministic' : false,
        minimize: isProduction,
        minimizer: [
          new CssMinimizerPlugin(),
          build === 'legacy'
            ? new TerserPlugin({
                parallel: true,
                terserOptions: {
                  safari10: true,
                },
              })
            : new ESBuildMinifyPlugin({
                target: ['chrome58', 'firefox60', 'safari11', 'edge18'],
              }),
        ],
        splitChunks: {
          chunks: 'all',
        },
      },
    }
  })

module.exports = config
