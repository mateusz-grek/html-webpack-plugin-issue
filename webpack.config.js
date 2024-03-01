/**
 * Webpack main configuration file
 */

const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const Glob = require('glob');

let filesToIncludeArr = [];
let filesToIncludeArrSitemap = [];
const filesToInclude = Glob.sync('src/**/*.html').map(function(file) {

  
    filesToIncludeArr.push(file.replace('src/', ''));
    filesToIncludeArrSitemap.push(file.replace('src/', '').replace('.html', '').replace('index', ''));
    
  
  // filesToIncludeArr[entryKey] = file;
})
console.log(filesToIncludeArr);

// Example of simple string paths
const paths = filesToIncludeArrSitemap;

const environment = require('./configuration/environment');

const templateFiles = filesToIncludeArr
  .filter((file) => ['.html', '.ejs'].includes(path.extname(file).toLowerCase())).map((filename) => ({
    input: filename,
    output: filename.replace(/\.ejs$/, '.html'),
}));

const htmlEntries = templateFiles.map((template) => ({
  filename: template.output,
  import: path.resolve(environment.paths.source, template.input),
  // use the `data` option to pass variables into the template
  data: {
    // use any object name which will be available in html template
    pageData: {
      newVariable: 'test variable',
    },
  },
}));

module.exports = {
  output: {
    path: environment.paths.output,
  },
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: ['css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|gif|jpe?g|svg|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.images,
          },
        },
        generator: {
          filename: 'images/design/[name].[hash:6][ext]',
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.images,
          },
        },
        generator: {
          filename: 'images/design/[name].[hash:6][ext]',
        },
      },
      
    ],
  },
  optimization: {
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                'svgo',
                {
                  plugins: [
                    {
                      name: 'removeViewBox',
                      active: false,
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  plugins: [
    new HtmlBundlerPlugin({
      // define many page templates here
      entry: htmlEntries,
      js: {
        // JS output filename
        filename: 'js/[name].[contenthash:8].js',
      },
      css: {
        // CSS output filename
        filename: 'css/[name].[contenthash:8].css',
      },
    }),

    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
    }),
   
    new SitemapPlugin({
      base: 'https://citroenist-mag.ch/',
      paths,
      options: {
        filename: 'sitemap.xml'
      }
    })
    
  ],
  target: 'web',
};
