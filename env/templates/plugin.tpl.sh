export REMOTE_USER=<%= user %>
export UI_RUNTIME_HOST=<%= server %>
export UI_RUNTIME_PATH=<%= runtime_dir %>/plugins/ui/<%= endpoint %>/<%= plugin %>
export UI_BUILD_PATH=$HOME/build/<%= endpoint %>/plugins/<%= plugin %>
export UI_BUILD_MODE=development
export OUTPUT_FILENAME="[name]-[fullhash].js"
export PUBLIC_PATH=/-/<%= endpoint %>/plugins/<%= plugin %>/ 
export BUILD_TARGET=<%= plugin %>/
