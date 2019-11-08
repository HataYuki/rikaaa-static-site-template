const pug = require("pug");
const fs = require("fs-extra");

/**
 * pugをコンパルし、戻り値に結果Promiseで返す。
 * @param path .pugファイルのパス。
 */
module.exports = path => {
  return new Promise(resolve => {
    try {
      resolve(
        pug.renderFile(path, {
          pretty: process.env.TARGET === "production" ? false : true
        })
      );
    } catch (error) {
      resolve();
    }
  });
};
