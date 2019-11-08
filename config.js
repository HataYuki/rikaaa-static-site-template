module.exports = {
  srcPath: "./src",
  distPath: "./dist",
  srcFileName: "src",
  distFileName: "dist",
  sass: {
    targets: ["> 1%", "last 6 versions", "Firefox ESR"]
  },
  javascript: {
    targets: {
      ie: "11"
    }
  },
  browser: {
    server: "./dist",
    ui: {
      port: 3000
    }
  },
  copy: [{ from: "./src/assets/images", to: "./dist/images" }]
};
