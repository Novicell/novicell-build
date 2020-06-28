// Node packages
const glob = require('glob');
const path = require('path');

// plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Project options
const options = require('../../config');

const moduleDir = options.mainSettings.modulesDir;
const env = process.env.NODE_ENV || 'development';
const scriptsDistFolderName = '/scripts'; // This folder will be inside dist
const cssDistFolderName = '/css'; // This folder will be inside dist

// Find all files JS from modules directory
const filesInModulesDir = glob.sync(moduleDir);
const allEntries = () => {
  const manyEntries = {};
  for (let index = 0; index < filesInModulesDir.length; index += 1) {
    manyEntries[path.basename(filesInModulesDir[index], '.js')] = filesInModulesDir[index];
  }
  if (filesInModulesDir.length > 0) {
    return manyEntries;
  }
  console.warn('- - - - - No files to bundle!!!');
  return false;
};

module.exports = {
  mode: env,
  watch: false,
  entry: allEntries(),
  output: {
    path: options.mainSettings.dist + scriptsDistFolderName,
    filename: '[name].bundle.js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          ecma: 8,
          mangle: false,
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      logLevel: 'silent',
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: `../${cssDistFolderName}/[name].css`,
      // chunkFilename: '[id].css',
    }),
    new VueLoaderPlugin(),
  ],
  resolve: {
    alias: {
      vue: env === 'development' ? 'vue/dist/vue.js' : 'vue/dist/vue.min.js',
      '@': options.mainSettings.sourceRootFolder,
    },
  },
  module: {
    rules: [{
      // enfore ensures that eslint-loader runs before babel or any other loaders
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        emitWarning: true,
        failonError: false,
        fix: true,
        configFile: `${options.fullConfigsPath}/scripts/.eslintrc.js`,
      },
    },
    {
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader, // creates style nodes from JS strings
        options: {
          publicPath: options.mainSettings.dist + cssDistFolderName,
        },
      }, {
        loader: 'css-loader', // translates CSS into CommonJS
      }, {
        loader: 'postcss-loader', // compiles Sass to CSS
        options: {
          config: {
            path: `${options.fullConfigsPath}/styles/`,
          },
        },
      }],
    },
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          cwd: options.fullConfigsPath,
          presets: ['@babel/preset-env'],
        },
      },
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader',
    },
    ],
  },
};
