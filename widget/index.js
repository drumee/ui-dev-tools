#!/usr/bin/env node

const {
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  mkdirSync
} = require('fs');
const RECURVISE = { recurvise: true };

const { camelCase, template } = require('lodash');
const Minimist = require('minimist');
const { basename, resolve, dirname, join } = require('path');
const { exit, argv } = process;
const ARGV = Minimist(argv.slice(2));
const prog_name = basename(argv[1]);
let dest_dir;

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

function render(filename) {
  const tpl_file = resolve(__dirname, 'template', filename);
  let dest_file = resolve(dest_dir, filename);
  dest_file = dest_file.replace(/\.tpl/, '');
  if (!existsSync(tpl_file)) {
    fatal(`[Template not found]: ${tpl_file}`);
  }
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
    date: new Date().toISOString()
  };
  let templateFile = readFileSync(tpl_file, 'utf-8');
  let content = String(templateFile).trim().toString();
  const renderer = template(content);
  mkdirSync(dirname(dest_file), RECURVISE);
  content = renderer(data).replace(/\#\{/g, '${');
  writeFileSync(dest_file, content, 'utf-8');

}

// -----------------------------------------------------------------
function check_sanity(cb) {
  let target;
  ARGV.fig || usage('fig');
  ARGV.dest || usage('dest');
  if (/^\//.test(ARGV.dest)) {
    target = ARGV.dest;
  } else {
    target = ARGV.dest.replace(/^\.(\/)*/g, '')
    target = resolve(__dirname, '..', ARGV.dest)
  }
  let base_dir;
  if (!ARGV.name) {
    ARGV.name = basename(target);
    base_dir = dirname(target);
  } else {
    base_dir = target;
  }

  if (!existsSync(base_dir)) {
    fatal(`Parent ${base_dir} dir does not exists`);
  }
  dest_dir = resolve(base_dir, ARGV.name);
  if (existsSync(dest_dir)) {
    fatal(`Destination ${dest_dir} already exist!`);
  } else {
    mkdirSync(dest_dir, RECURVISE);
  }
}

function build(e) {
  const folders = [];
  folders.push(resolve(__dirname, 'template'));
  folders.push(resolve(__dirname, 'template', 'skeleton'));
  folders.push(resolve(__dirname, 'template', 'skin'));
  for (var dir of folders) {
    readdirSync(dir).forEach(function (f) {
      let full_path = resolve(dir, f);
      let stat = statSync(full_path);
      if (stat.isDirectory()) {
        let dest = resolve(dest_dir, f);
        mkdirSync(dest, RECURVISE);
      } else if (stat.isFile()) {
        let base = dir.replace(`${__dirname}/template`, '');
        base = base.replace(/^\//, '');
        render(join(base, f));
      }
    });
  }
}

check_sanity();
build();
console.log(`The new Drumee Widget was created and placed a ${dest_dir}`);
