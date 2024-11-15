#!/usr/bin/env node

const {
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  mkdirSync
} = require('fs');
const RECURVISE = { recursive: true };

const { camelCase, template } = require('lodash');
const Minimist = require('minimist');
const { basename, resolve, dirname, join } = require('path');
const { exit, argv, env } = process;
const ARGV = Minimist(argv.slice(2));
const prog_name = basename(argv[1]);
const tpl_base = new RegExp(`^${__dirname}/template/`)

/**
 * 
 * @param {*} a 
 */
function fatal(a) {
  console.log(`[Fatal error]: ${a}`);
  exit(1);
}

function usage(a) {
  console.log(`Missing argument : ${a}`,)
  console.log(`Usage ${prog_name} 
    --fig=figGroup.figName 
    --dest=/where/to/place/code
    `);
  exit(1);
}

function render(target, tpl_file) {
  if(!/\.tpl$/.test(tpl_file)){
    return
  }

  if (!existsSync(tpl_file)) {
    fatal(`[Template not found]: ${tpl_file}`);
  }

  let filename = tpl_file.replace(tpl_base, '').replace(/\.tpl$/, '')
  console.log({filename, __dirname}, tpl_file);
  let dest_file = resolve(target, filename);
  let fig = ARGV.fig.split(/[.-_\/]/);
  let group = fig.shift();
  let name = camelCase(fig.join('_'));
  let family = `${group}_${name}`;
  let data = {
    group,
    name,
    family,
    filename: dest_file.replace(resolve(__dirname, '..'), ''),
    parent: ARGV.parent || 'LetcBox',
    service: "trigger-my-service",
    date: new Date().toISOString()
  };
  let templateFile = readFileSync(tpl_file, 'utf-8');
  let content = String(templateFile).trim().toString();
  const renderer = template(content);
  const dir = dirname(dest_file);
  if (!existsSync(dir)) {
    mkdirSync(dir, RECURVISE);
  }
  content = renderer(data).replace(/\#\{/g, '${');
  writeFileSync(dest_file, content, 'utf-8');

}

// -----------------------------------------------------------------
function targetDir() {
  let target;
  ARGV.fig || usage('fig');
  ARGV.dest || usage('dest');
  if (/^\//.test(ARGV.dest)) {
    target = ARGV.dest;
  } else {
    target = resolve(env.PWD, ARGV.dest)
  }

  if (existsSync(target)) {
    fatal(`Destination ${target} already exist!`);
    return
  }
  mkdirSync(target, RECURVISE);
  return target
}

/**
 * 
 * @param {*} target 
 */
function build(target) {
  const tpl_base = resolve(__dirname, 'template');
  const re = new RegExp(`^${__dirname}/`)
  const folders = [
    tpl_base,
    resolve(tpl_base, 'skeleton'),
    resolve(tpl_base, 'skin')
  ];
  for (var dir of folders) {
    readdirSync(dir).forEach(function (f) {
      let full_path = resolve(dir, f);
      let stat = statSync(full_path);
      if (stat.isDirectory()) {
        let dest = resolve(target, f);
        mkdirSync(dest, RECURVISE);
      } else if (stat.isFile()) {
        render(target, resolve(dir,f));
      }
    });
  }
}

const tartget = targetDir();
build(tartget);
console.log(`The new Drumee Widget was created and placed a ${tartget}`);
