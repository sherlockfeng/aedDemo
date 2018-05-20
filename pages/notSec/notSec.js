let app = getApp();
let wechat = require("../../utils/wechat");
Page({
  data: {
    list: []
  },
  onLoad(e) {

  },
  jumpTo(e) {
    let value = e.currentTarget.dataset.value
    wx.redirectTo({
      url: '/pages/'+value+'/'+value
    })
  }
})