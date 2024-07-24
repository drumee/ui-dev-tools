#!/bin/bash
set -e
script_dir=$(dirname $(readlink -f $0))
source $script_dir/setup.sh

env_file=$UI_SRC_PATH/.dev-tools.rc/devel.electron.sh
if [ -f $env_file ]; then
  source $env_file
fi

if [ "$UI_BUILD_MODE" = "development" ]; then
  watch="--watch"
fi

$UI_SRC_PATH/webpack/seeds/index.js
$UI_SRC_PATH/node_modules/.bin/webpack --config webpack.js --mode=$UI_BUILD_MODE --progress $watch
