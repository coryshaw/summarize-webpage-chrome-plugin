const fs = require("fs-extra");
const path = require("path");
const webpack = require("webpack");
const config = require("./webpack.config.js");

// Paths
const distDir = path.resolve(__dirname, "dist");
const libDir = path.resolve(__dirname, "lib");
const publicDir = path.resolve(__dirname, "public");

// First Delete dist directory if it exists
if (fs.existsSync(distDir)) {
  fs.removeSync(distDir);
}

// Ensure dist directory exists
fs.ensureDirSync(distDir);

// Ensure lib directory exists
fs.ensureDirSync(libDir);

// copy all files in public directly to root of dist
fs.copySync(publicDir, distDir);

// Webpack bundling
webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err || stats.toJson().errors);
    process.exit(1);
  }

  console.log("Bundling completed successfully.");
});
