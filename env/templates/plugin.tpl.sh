export REMOTE_USER=<%= user %>
export UI_RUNTIME_HOST=<%= server %>
export UI_RUNTIME_PATH=<%= runtime_dir %>/plugins/ui/<%= endpoint %>/<%= plugin %>
export UI_BUILD_PATH=$HOME/build/<%= endpoint %>/plugins/<%= plugin %>
export UI_BUILD_MODE=<%= build_mode %>
export OUTPUT_FILENAME="[name]-[fullhash].js"
export BUILD_TARGET=<%= plugin %>
<% if (endpoint==="main") { %>
export PUBLIC_PATH=/-/plugins/<%= plugin %>/ 
<% } else { %> 
export PUBLIC_PATH=/-/<%= endpoint %>/plugins/<%= plugin %>/ 
<% } %>