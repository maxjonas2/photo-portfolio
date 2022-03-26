const path = require("path");

module.exports = {
  entry: "./index.js",
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
  mode: "development"
};
