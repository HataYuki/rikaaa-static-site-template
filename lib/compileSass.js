const sass = require("node-sass");
const packageImporter = require("node-sass-package-importer");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const config = require("../config");

/**
 * sassをコンパイルしてその結果をPromiseで返す。
 * @param　.sass|.scssのパス
 */
module.exports = pathStr => {
  const option = {
    file: pathStr,
    sourceMap: true,
    sourceMapEmbed: true,
    importer: packageImporter()
  };

  if (process.env.TARGET === "production") {
    delete option.sourceMap;
    delete option.sourceMapEmbed;
    option.outputStyle = "compact";
  }

  return new Promise((resolve, reject) => {
    sass.render(option, (err, data) => {
      if (err) reject(err);
      console.log(err);
      if (data !== null)
        postcss([
          autoprefixer({
            grid: true,
            overrideBrowserslist: config.sass.targets
          })
        ])
          .process(data.css, {
            from: pathStr
          })
          .then(result => {
            resolve(result.css);
          });
    });
  });
};
