const gulp = require("gulp");
const fs = require("fs-extra");
const path = require("path");
const bs = require("browser-sync");

const pug = require("./lib/compilePug");
const sass = require("./lib/compileSass");
const js = require("./lib/compileJs");

const fileAll = require("./lib/filer").fileAll;
const filterBySuffix = require("./lib/filer").filterBySuffix;
const filterIndexFiles = require("./lib/filer").filterIndexFiles;

const config = require("./config");

// pug render
gulp.task("pug", async cb => {
  const all = await fileAll(config.srcPath);
  const pugFiles = filterBySuffix(all, "pug");
  const pugIndexFiles = filterIndexFiles(pugFiles);

  const render = pugIndexFiles.map(filePath => {
    return new Promise(resolve => {
      const outputPath = filePath
        .replace(config.srcFileName, config.distFileName)
        .replace(/.pug/, ".html")
        .replace("index.", "");

      pug(filePath).then(code => {
        fs.outputFile(outputPath, code, () => resolve());
      });
    });
  });

  Promise.all(render).then(() => cb());
});

// sass render
gulp.task("sass", async cb => {
  const all = await fileAll(config.srcPath);
  const sassFiles = filterBySuffix(all, "sass");
  const scssFiles = filterBySuffix(all, "scss");
  const sassAndScssFiles = sassFiles.concat(scssFiles);
  const styleFiles = filterIndexFiles(sassAndScssFiles);

  const render = styleFiles.map(filePath => {
    return new Promise(resolve => {
      const outputPath = filePath
        .replace(config.srcFileName, config.distFileName)
        .replace(/sass|scss/, "css")
        .replace("index.", "");

      sass(filePath).then(code => {
        fs.outputFile(outputPath, code, () => {
          resolve();
        });
      });
    });
  });

  Promise.all(render).then(() => cb());
});

// js render
gulp.task("js", async cb => {
  const all = await fileAll(config.srcPath);
  const jsFiles = filterBySuffix(all, "js");
  const jsIndexFiles = filterIndexFiles(jsFiles);

  const render = jsIndexFiles.map(filePath => {
    return js(filePath);
  });

  Promise.all(render).then(() => cb());
});

// browser-sync
gulp.task("browser", cb => {
  bs.init(config.browser);
});

// copy
gulp.task("copy", cb => {
  config.copy.forEach(fromTo => {
    fs.copySync(fromTo.from, fromTo.to);
  });
  cb();
});

// clear dist
gulp.task("clear", cb => {
  fs.removeSync(config.distPath);
  cb();
});

// reload
gulp.task("reload", cb => {
  bs.reload();
  cb();
});

// watch
gulp.task("watch_dev", cb => {
  gulp.watch(
    [path.join(config.srcPath, "**/*")],
    gulp.series("clear", "pug", "sass", "js", "copy")
  );
  cb();
});

gulp.task("watch_devser", cb => {
  gulp.watch(
    [path.join(config.srcPath, "**/*")],
    gulp.series("clear", "pug", "sass", "js", "copy", "reload")
  );
  cb();
});

// devser
gulp.task(
  "devser",
  gulp.series("pug", "sass", "js", "copy", "watch_devser", "browser"),
  cb => cb()
);

// dev
gulp.task("dev", gulp.series("pug", "sass", "js", "watch_dev"), cb => cb());

// prod
gulp.task("prod", gulp.series("pug", "sass", "js", "copy"), cb => cb());
