const fs = require("fs-extra");
const path = require("path");
const webpack = require("webpack");
const config = require("./webpack.config.js");

// Paths
const distDir = path.resolve(__dirname, "dist");
const publicFiles = ["index.html", "manifest.json"];
const imagesDir = path.resolve(__dirname, "images");

// Ensure dist directory exists
fs.ensureDirSync(distDir);

// Copy public files
publicFiles.forEach((file) => {
  fs.copyFileSync(path.resolve(__dirname, file), path.resolve(distDir, file));
});

// Copy images directory
fs.copySync(imagesDir, path.resolve(distDir, "images"));

// Webpack bundling
webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err || stats.toJson().errors);
    process.exit(1);
  }

  console.log("Bundling completed successfully.");
});
