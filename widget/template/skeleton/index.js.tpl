/* ==================================================================== *
* Widget skeleton automatically generated on <%= date %>
* npm run make-widget -- 
* ==================================================================== */

/**
 * 
 * @param {*} ui 
 * @returns 
 */

function skl_<%= group %>_<%= name %>(ui) {
  const skeleton = Skeletons.Box.Y({
    className  : `#{ui.fig.family}__main`,
    debug      : __filename,
    kids       : [
      Skeletons.Box.X({
        className  : `#{ui.fig.family}__container`,
        kids : [
          Skeletons.Note({
            className  :`#{ui.fig.family}__text`,
            content : "Hello world!"
          }),
          Skeletons.Button.Svg({
            className  :`#{ui.fig.family}__icon`,
            ico : "message_smile"
          }),
        ]
      })
    ]
  })

  return skeleton;
}
module.exports = skl_<%= group %>_<%= name %>;
