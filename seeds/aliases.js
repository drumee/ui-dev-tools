const { resolve } = require("path");

const drumee_path = 'src';

module.exports = function (basedir) {
  return {
    extensions: [".coffee", ".js", ".scss", ".css", ".web.coffee", ".web.js", ".json", ".tpl", '.tsx', '.ts',],
    alias: {
      'api': resolve(basedir, drumee_path, 'api')
    },
  }
};
