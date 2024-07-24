#!/bin/bash
set -e

script_dir=$(dirname $(readlink -f $0))
worker=$(basename $(readlink -f $0))
if [ "$UI_BUILD_PATH" = "" ]; then
  export UI_BUILD_PATH=$HOME/build/ui
fi
mkdir -p "$UI_BUILD_PATH"

if [ "$UI_SRC_PATH" = "" ]; then
  export UI_SRC_PATH=$(dirname $script_dir)
fi

proc_tag=$(echo $UI_SRC_PATH/$worker | sed -e "s/\//-/g" | sed -E "s/^\-|\-$|\.sh//g" )
if [ "$TMPDIR" = "" ]; then
  pidfile=/tmp/${proc_tag}.pid
  pidcheck=/tmp/${proc_tag}.check
else
  pidfile=$TMPDIR${proc_tag}.pid
  pidcheck=$TMPDIR${proc_tag}.check
fi

echo Using pidfile=$pidfile

if [ -f $pidfile ]; then
  pid=$(cat $pidfile)
  ps -p $pid | grep $pid | sed -E "s/^ *//" | sed -E "s/ .*$//" > $pidcheck
  plist=$(cat $pidcheck)
  echo "PLIST=$plist // $pid"
  if [ "$plist" = "$pid" ]; then
    echo there is already a watcher with $pid
    exit 1
  fi 
fi 

if [ -f $pidfile ]; then
  rm "$pidfile"
fi

echo $$ > $pidfile


echo "Start watching from $UI_SRC_PATH"
if [ -z $UI_BUILD_MODE ]; then
  export UI_BUILD_MODE=development
fi
