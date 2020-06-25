const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
  entry: {
    index: './public/index.js',
    indexedDb: './public/indexedDb.js',
  },
  output: {
    // Set the path and filename for the output bundle (hint: You will need to use "__dirname")
    path: __dirname + '/public/dist',
    filename: '[name].bundle.js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new WebpackPwaManifest({
      filename: "manifest.json",
      name: "Budget Tracker",
      short_name: "Budget Tracker",
      description: "Add expenses and deposits to their budget with or without a connection.",
      background_color: "#dddddd",
      theme_color: "#dddddd",
      "theme-color": "#dddddd",
      start_url: "/",
      icons: [{
        src: path.resolve(__dirname, "public/icons/icon-512x512.png"),
        sizes: [192, 512],
        destination: path.join("assets", "icons")
      }]
    })
  ]
};

module.exports = config;