export REMOTE_USER=<%= user %>
export UI_RUNTIME_HOST=drumee.in
export UI_RUNTIME_PATH=/srv/drumee/runtime/plugins/ui/<%= endpoint %>/<%= plugin %>
export UI_BUILD_PATH=$HOME/build/<%= endpoint %>/plugins/<%= plugin %>
export UI_BUILD_MODE=development
export OUTPUT_FILENAME="[name]-[fullhash].js"
export PUBLIC_PATH=/-/<%= endpoint %>/plugins/<%= plugin %>/ 
export BUILD_TARGET=<%= plugin %>
