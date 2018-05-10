let app = getApp();
let wechat = require("../../utils/wechat");
Page({
  data: {
    secheight: 300,
    secwidth: 375
  },
  onLoad(e) {
    wechat.getSystemInfo()
      .then(result => {
        this.setData({
          secheight: result.windowHeight - 40,
          secwidth: result.windowWidth 
        })
      }).catch(e => {
        console.log(e)
      })
    
  },
})