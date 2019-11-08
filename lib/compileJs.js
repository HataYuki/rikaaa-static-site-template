const webpack = require("webpack");
const path = require("path");
const config = require("../config");

module.exports = pathStr => {
  const pathSplit = pathStr.split("/");
  const fileName = pathSplit[pathSplit.length - 1];
  const outputFileName = fileName.replace("index.", "");
  const outputPath = pathStr
    .replace(config.srcFileName, config.distFileName)
    .replace(`/${pathSplit[pathSplit.length - 1]}`, "");

  return new Promise(resolve => {
    const webpackConfig = {
      entry: pathStr,
      output: {
        filename: outputFileName,
        path: outputPath
      },
      devtool: "inline-source-map",
      cache: true,
      optimization: {
        minimize: false
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader?cacheDirectory",

              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      useBuiltIns: "usage",
                      corejs: 3,
                      targets: config.javascript.targets
                    }
                  ]
                ]
              }
            }
          }
        ]
      }
    };

    if (process.env.TARGET === "production") {
      delete webpackConfig.optimization;
      delete webpackConfig.devtool;
    }

    const compiler = webpack(webpackConfig);

    compiler.run(() => resolve());
  });
};
