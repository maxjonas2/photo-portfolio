const path = require("path");

module.exports = {
  entry: "./javascript/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "./")
    },
    compress: true,
    port: 9000
  },
  mode: "production"
};
