#!/usr/bin/env node

const { existsSync, readFileSync, writeFileSync } = require('fs');
const { readFileSync: readJSON } = require('jsonfile');
const { template, values, isString, isEmpty } = require('lodash');
const { resolve, join, dirname } = require('path');
const not_found = [];
const args = require("./args");

let SRC_DIR;
if (args.from) {
  SRC_DIR = resolve(args.from);
} else {
  if (process.env.UI_SRC_PATH) {
    SRC_DIR = resolve(process.env.UI_SRC_PATH);
  } else {
    SRC_DIR = resolve(__dirname, '../../..');
  }
}

const webpack_dir = join(SRC_DIR, 'webpack')
let ALIASES = {};

/**
 * 
 */
function build_aliases() {
  let aliases_file = join(webpack_dir, 'resolve.js');
  if (existsSync(aliases_file)) {
    let { alias } = require(aliases_file)(SRC_DIR);
    for (let k in alias) {
      if (existsSync(alias[k])) {
        ALIASES[alias[k]] = k;
      }
    }
  }
}

/**
 * 
 * @param {*} path 
 * @returns 
 */
function item(path) {
  const tpl_file = resolve(__dirname, 'promise.tpl');
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
        if (args.verbose) console.log(`${i.kind} declared multiple times`)
      }
    }
  }
  return values(kinds);
}

/**
 * 
 * @param {*} items 
 */
function render(seeds_root, items) {
  const tpl_file = resolve(__dirname, 'classes.tpl');
  const dest_file = resolve(SRC_DIR, seeds_root, 'core/kind/seeds/builtins.js');
  if (!existsSync(tpl_file)) {
    fatal(`[Template not found]: ${tpl_file}`);
  }
  let now = new Date;
  let data = {
    items: optimize(items),
    filename: dest_file.replace(SRC_DIR, ''),
    year: now.getFullYear()
  };

  let tpl = readFileSync(tpl_file, 'utf-8');
  let content = String(tpl).trim().toString();
  const renderer = template(content);
  writeFileSync(dest_file, renderer(data), 'utf-8');
}

function debug(line, path) {
  if (/modules\/desk/.test(path)) {
    console.log(`LINE:${line}`, path)
  }
}
/**
 * 
 */
function make() {
  console.log("Compiling seeds from ....", SRC_DIR);
  let libs = [
    "src/drumee",
  ];
  if (args.libs) {
    libs = args.libs.split(/[,;:]/);
  }
  build_aliases();
  const walk = require('walkdir');
  for (let dir of libs) {
    let data = [];
    let root = new RegExp('^' + join(SRC_DIR, dir));
    let f = resolve(SRC_DIR, dir);
    console.log("SCANNING", f);
    let files = walk.sync(f);
    let parent;
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
          let basedir = './';
          debug(149, path)
          if (/^\./.test(path) || (!/^\//.test(path))) {
            basedir = resolve(dirname(file), path);
          }
          if (basedir && existsSync(basedir)) {
            if (ALIASES[basedir]) {
              path = basedir
              debug(152, path)
            } else {
              parent = ALIASES[dirname(file)]
              if (parent) {
                path = join(parent, v[kind]);
              }
              else {
                parent = dirname(file);
                path = resolve(parent, v[kind]);
                path = path.replace(SRC_DIR, '').replace(/^\//, '');
              }
            }
          } else {
            parent = dirname(basedir);
            path = resolve(SRC_DIR, dir, v[kind]);
            let realpath = `${path}.js`
            if (!existsSync(path) && !existsSync(realpath)) {
              path = parent;
            }
            realpath = `${path}.js`
            if (!existsSync(path) && !existsSync(realpath)) {
              path = v[kind];
            }
          }
          path = path.replace(/\\+/g, '/');
          path = path.replace(root, '');
          path = path.replace(/^\/+/, '');
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
    render(dir, data);
  }
  if (!isEmpty(not_found)) {
    console.warn("Following files have not been resolved", not_found);
  }
}

make();
