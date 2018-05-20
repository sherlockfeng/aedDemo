//app.js
let wechat = require('./utils/wechat.js');
App({
  globalData:{    
    wxuserInfo: null,    
    uid: null,
    // host: 'https://heyunf.com',
    // host: 'http://localhost:3001',
    host: 'https://www.hzhtyl.com',
    userInfo: {}
  },  
  onLaunch() {
    this.login()
    this.register()
  },
  login() {
    let that = this
    that.globalData.uid = wx.getStorageSync('aedUid')
    if (that.globalData.uid) {
      wx.request({
        url: this.globalData.host + '/users',
        header: {  
          "Content-Type": "application/x-www-form-urlencoded"  
        },  
        method: "POST",
        data:  { uid: that.globalData.uid }, 
        success(result) {
          if (result.data.status == 0) {
            that.globalData.userInfo = result.data.data[0];
          }
        }
      })
    }
  },

  register() {
    let that = this;
    wx.login({
      success(res) {
        wx.request({
          url: that.globalData.host + '/users/register',
          header: {  
            "Content-Type": "application/x-www-form-urlencoded"  
          },  
          method: "POST",
          data:  { code: res.code },  
          success:(result) => {
            wx.setStorageSync("aedUid", result.data.data[0].uid)
            that.globalData.userInfo = result.data.data[0]
            that.globalData.uid = result.data.data[0].uid
          }
        })
      }
    })
  }
})
