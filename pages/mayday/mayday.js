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
  },
  handleSec(e) {
    let that = this
    wx.request({
      url: app.globalData.host + '/users',
      header: {  
        "Content-Type": "application/x-www-form-urlencoded"  
      },  
      method: "POST",
      data:  { uid: app.globalData.uid }, 
      success(result) {
        let data = result.data
        if (data.status == 0) {
          if(data.data.length == 0) {
            app.register()
          }else {
            if(data.data[0].isSe === 0) {
              wx.navigateTo({url:'/pages/notSec/notSec'})
            }else {
              let index = e.currentTarget.dataset.value
              wx.setStorageSync('destination', that.data.list[index].address)
              wx.setStorageSync('connphone', that.data.list[index].phone)
              wx.navigateTo({url:'/pages/go/go'})
            }
          }
        }
      }
    })
  }
})