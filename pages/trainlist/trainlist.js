let app = getApp();
let wechat = require("../../utils/wechat");
Page({
  data: {
  },
  onLoad(e) {
  },
  jumpTo() {
    wx.navigateTo({
      url: '/pages/sign/sign'
    })
  }
})