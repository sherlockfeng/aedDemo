let app = getApp();
let wechat = require("../../utils/wechat");
Page({
  data: {
    userinfo: {}
  },
  onLoad(e) {
  },
  onShow(e){
    this.setData({
      userinfo: app.globalData.userInfo,
    })
  }
})