const TerserPlugin = require("terser-webpack-plugin")
const sys = require("./src/config.js");
const { name } = require("./package.json");
module.exports = {
  publicPath: sys.publicPath,
  outputDir: sys.outputDir,
  transpileDependencies: ['mom-pc-core'],
  devServer: {
    open: true,
    port: 9005,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  productionSourceMap: false,
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/scss/global.scss";',
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.symlinks(true);
    config.plugin("html").tap((args) => {
      args[0].title = sys.name;
      return args;
    });
    const fileRule = config.module.rule("file");
    // fileRule.uses.clear()
    fileRule
      .test(/\.pdf$/)
      .use("url-loader")
      .loader("url-loader")
      .end();
  },
  configureWebpack: {
    // 关闭 webpack 的性能提示
    // performance: {
    // 	hints: false
    // }
    output: {
      library: `${name}-[name]`,
      libraryTarget: "umd", // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
    },
    // 警告 webpack 的性能提示
    performance: {
      hints: "warning",
      // 入口起点的最大体积
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith(".js");
      },
    },
  },
  // configureWebpack: (config) => {
  //   const mode = {
  //     prod: '正式',
  //     stage: '测试',
  //     dev: '本地'
  //   }
  //   const modeText = mode[process.env.VUE_APP_CURRENTMODE]
  //   console.log(process.env.VUE_APP_CURRENTMODE, modeText + '版本')
  //
  //   if (process.env.VUE_APP_CURRENTMODE === 'prod') {
  //     // 返回一个将会被合并的对象
  //     return {
  //       optimization: {
  //         minimizer: [
  //           new TerserPlugin({
  //             sourceMap: false,
  //             terserOptions: {
  //               compress: {
  //                 drop_console: true
  //               }
  //             }
  //           })
  //         ]
  //       }
  //     }
  //   }
  // }
};
