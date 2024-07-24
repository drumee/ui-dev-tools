#!/bin/bash

dest_host=$UI_RUNTIME_HOST
if [ "$dest_host" != "" ]; then
  src_path=$UI_BUILD_PATH
  dest_user=$REMOTE_USER
  dest_path=$UI_RUNTIME_PATH

  OPT=""
  if [ -f "$IGNORE_FILE" ]; then
    OPT=--exclude-from="$IGNORE_FILE"
  fi

  if [ -z $src_path ]; then 
    echo UI_BUILD_PATH env variable must be set
    exit 1
  fi 

  target="${dest_user}@${dest_host}:${dest_path}"

  echo "*******************************************************"
  echo "*SYNCING files : $src_path -> $target " 
  echo "*******************************************************"	
  export banner_shown=shown
  echo OPTION: $OPT
  rsync -avrp --delete --delete --delete-excluded  $OPT $src_path/ $target/

  echo "Done!"
fi