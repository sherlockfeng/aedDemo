let app = getApp();
let wechat = require("../../utils/wechat");
Page({
  data: {
    list: []
  },
  onLoad(e) {

  },
  onShow(e) {
    let that = this
    wx.request({
      url: app.globalData.host + '/maydays',
      success(result) {
        if(result.data.status === '0') {
          that.setData({
            list: result.data.data
          })
        }
      }
    })
  }
})