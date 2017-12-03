var path = require('path');
var SRC_DIR = path.join(__dirname, '/src');
var DIST_DIR = path.join(__dirname, '/../build');

module.exports = {
  entry: `${SRC_DIR}/Index.jsx`,
  output: {
    filename: 'background.js',
    path: DIST_DIR
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : SRC_DIR,
        loader : 'babel-loader',
        query: {
          presets: ['react', 'env']
        }
      }
    ]
  }
};