#!/usr/bin/env node

const { existsSync, readFileSync, writeFileSync } = require('fs');
const { template, values, isString, isEmpty } = require('lodash');
const Minimist = require('minimist');
const Path = require('path');
const Moment = require('moment');
const not_found = [];
const argv = Minimist(process.argv.slice(2));

let SRC_DIR;
if (argv.from) {
  SRC_DIR = Path.resolve(argv.from);
} else {
  if (process.env.UI_SRC_PATH) {
    SRC_DIR = Path.resolve(process.env.UI_SRC_PATH);
  } else {
    SRC_DIR = process.env.PWD || __dirname;
  }
}

const webpack = require('../resolve')(SRC_DIR);
let ALIASES = {};
/**
 * 
 */
function build_aliases() {
  for (var k in webpack.alias) {
    ALIASES[webpack.alias[k]] = k;
  }
}

/**
 * 
 * @param {*} path 
 * @returns 
 */
function item(path) {
  const tpl_file = Path.resolve(__dirname, 'promise.tpl');
  let str = readFileSync(tpl_file, 'utf-8');
  const renderer = template(String(str).trim().toString());
  return renderer({ path });
}

/**
 * 
 * @param {*} a 
 */
function fatal(a) {
  console.log(`[Fatal error]: ${a}`);
  process.exit(1);
}



/**
 * 
 * @param {*} items 
 * @returns 
 */
function optimize(items) {
  let kinds = {};
  for (var i of items) {
    if (!kinds[i.kind]) {
      kinds[i.kind] = i;
    } else {
      let f = kinds[i.kind];
      if (i.path != f.path) {
        console.warn(`
          Found kind conflicts [${i.kind}]:
          - Already declared in ${i.path} 
          - Shall be overloaded by ${f.path}\n`);
      } else {
        if (argv.verbose) console.log(`${i.kind} declared multiple times`)
      }
    }
  }
  return values(kinds);
}

/**
 * 
 * @param {*} items 
 */
function render(items) {
  const tpl_file = Path.resolve(__dirname, 'classes.tpl');
  const dest_file = Path.resolve(SRC_DIR, 'core/kind/seeds/builtins.js');
  if (!existsSync(tpl_file)) {
    fatal(`[Template not found]: ${tpl_file}`);
  }
  let data = {
    items: optimize(items),
    filename: dest_file.replace(SRC_DIR, ''),
    year: Moment().year()
  };

  let template = readFileSync(tpl_file, 'utf-8');
  let content = String(template).trim().toString();
  const renderer = template(content);
  writeFileSync(dest_file, renderer(data), 'utf-8');
}


/**
 * 
 */
function make() {
  console.log("Compiling seeds from ....", SRC_DIR);
  build_aliases();
  let data = [];
  let lex = [];
  let libs = [
    "src/drumee",
  ];
  if (argv.libs) {
    libs = argv.libs.split(/[,;:]/);
  }
  const walk = require('walkdir');
  for (let dir of libs) {
    let f = Path.resolve(SRC_DIR, dir);
    console.log("SCANNING", f);
    let files = walk.sync(f);

    let v;
    for (file of files) {
      if (!/(seeds.js)$/.test(file)) continue;
      if (existsSync(file)) {
        try {
          v = require(file);
        } catch (e) {
          console.log("Skipped file", file);
          continue;
        }
        for (let kind in v) {
          let path = v[kind];
          if (!isString(path)) continue;
          let basedir = null;
          if (/^\./.test(path)) {
            basedir = Path.resolve(Path.dirname(file), path);
          } else {
            let [b, d] = path.split(/\/+/);
            basedir = webpack.alias[b];
          }
          if (basedir && existsSync(basedir)) {
            if (ALIASES[basedir]) {
              path = v[kind];
            } else {
              if (ALIASES[Path.dirname(file)]) {
                path = basedir.replace(Path.dirname(file), ALIASES[Path.dirname(file)]);
              } else {
                let r = Path.resolve(Path.dirname(file), v[kind]);
                path = r.replace(SRC_DIR, '').replace(/^\//, '');
              }
            }
          } else {
            path = basedir.replace(SRC_DIR, '').replace(/^\//, '');
          }
          path = path.replace(/\\+/g, '/');
          data.push({
            kind,
            path,
            func: item(path)
          });
        }
      } else if (!isEmpty(file)) {
        console.log(`ERROR : ${file} not found`);
      }
    }
  }
  render(data);
  if (!isEmpty(not_found)) {
    console.warn("Following files have not been resolved", not_found);
  }
}

make();
