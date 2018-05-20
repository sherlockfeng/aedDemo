let app = getApp();
let wechat = require("../../utils/wechat");
Page({
  data: {
    phone: '',
    destination: '',
  },
  onLoad(e) {
    this.setData({
      phone:wx.getStorageSync('connphone'),
      destination:wx.getStorageSync('destination')
    })
  },
  onShow(e){
    this.setData({
      userinfo: app.globalData.userInfo,
    })
  }
})