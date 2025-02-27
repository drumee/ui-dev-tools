/* ==================================================================== *
* Widget automatically generated on <%= date %>
* npm run add-widget -- --fig=<grpup.family> --dest=/path/to/the/widget
* ==================================================================== */

class __<%= group %>_<%= name %> extends <%= parent %>{

  //constructor(...args) {
  //  super(...args);
  //}


  /**
   * 
   */
  initialize (opt={}){
    require('./skin');
    super.initialize(opt);
    this.declareHandlers();
    /* uncomment below line to subscribe to websocket events */
    // this.bindEvent("live");
  }

  /**
   * 
   * @param {View} child
   * @param {String} pn
   */
  onPartReady (child, pn){
    //this.debug("onPartReady", child, pn);
    switch(pn){
      case "my-part-name":
        /** Do something **/
        break;
      default:
        /** Delegate to parent if any **/
        //if(super.onPartReady) super.onPartReady(child, pn);
    }
  }

  /**
   * Upon DOM refresh, after element actually insterted into DOM
   */
  onDomRefresh(){
    this.feed(require('./skeleton')(this));
  }

  /**
   * User Interaction Evant Handler
   * @param {View} trigger
   * @param {Object} args
   */  
  onUiEvent (trigger, args={}){
    const service = args.service || trigger.get(_a.service);
    this.debug(`onUiEvent service was called with : `, {service, args, trigger})
    //switch(service){
    //  case  "my-service":
    //    /** Do something **/
    //  break;
    //  default:
    //    /** Delegate to parent if any **/
    //    if(super.onUiEvent) super.onUiEvent(trigger, args)
    //}
  }


  /** Optional. 
   * uncomment and call this.bindEvent to subscribe to websocket events
   **/
  /** 
   * Websocket Service Endpoint
   * @param {String} service
   * @param {Object} options
   */
  //onWsMessage(svc, data, options={}){
  //  const {service} = options || svc;
  //  switch(service){
  //  case  "my-service":
  //      this.debug("AAA:94",service, data)
  //    break;
  //    default:
  //      /** Delegate to parent if any **/
  //      if(super.onWsMessage) super.onWsMessage(service, data, options)
  //  }
  //}
}

module.exports = __<%= group %>_<%= name %>