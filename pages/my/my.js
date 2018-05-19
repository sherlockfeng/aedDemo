let app = getApp();
let wechat = require("../../utils/wechat");
Page({
  data: {
    userinfo: app.globalData.userInfo
  },
  onLoad(e) {
    console.log(this.data.userinfo)
  },
})