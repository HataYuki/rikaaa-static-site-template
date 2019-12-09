const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");

let allFiles = [];
/**
 * 第一引数に指定しされたパス以下のファイル一覧をPromiseで返す。
 * @param {*} pathStr 検索するフォルダーのパス。
 */
const fileAll = pathStr => {
  return new Promise(resolve => {
    glob(path.join(pathStr, "**/*"), (err, files) => {
      const fileAll = files
        .filter(item => !fs.statSync(item).isDirectory())
        .map(item => path.relative(pathStr, item))
        .map(item => path.resolve(pathStr, item));

      resolve(fileAll);
    });
  });

  // const read = fs.readdirSync(pathStr);
  // const itemAll = read.map(item => path.resolve(pathStr, item));
  // const files = itemAll.filter(item => !fs.statSync(item).isDirectory());
  // const directorys = itemAll.filter(item => fs.statSync(item).isDirectory());
  // allFiles = allFiles.concat(files);
  // if (directorys.length !== 0) {
  //   directorys.forEach(dir => fileAll(dir));
  // }
  // return allFiles;
};

/**
 * ファイル名一覧の配列から、第二引数に指定された拡張子と一致するフォルダを返す。
 * 戻り値 : Array<string>
 * @param {*} ArrayOfFiles ファイル一覧の配列
 * @param {*} suffixStr 拡張子の文字列　ex:js,sass,scss,pug,html
 */
const filterBySuffix = (ArrayOfFiles, suffixStr) => {
  const reg = new RegExp(`.${suffixStr}`);
  return ArrayOfFiles.filter(item => reg.test(item));
};

/**
 * ファイル一覧の配列から、「index.」で始まるファイルを配列で返す。
 * 戻り値 : Array<string>
 * @param {*} ArrayOfFiles
 */
const filterIndexFiles = ArrayOfFiles => {
  return ArrayOfFiles.filter(item => /index\./.test(item));
};

exports.fileAll = fileAll;
exports.filterBySuffix = filterBySuffix;
exports.filterIndexFiles = filterIndexFiles;
