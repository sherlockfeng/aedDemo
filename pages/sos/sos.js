let app = getApp()
let wechat = require("../../utils/wechat")

Page({
  data: {
  },
  onLoad(e) {

  },
  callAn()  {
    wx.makePhoneCall({
      phoneNumber: '120' //仅为示例，并非真实的电话号码
    })
  },
  jumpToSecure() {
    if(app.globalData.userInfo.phone) {
      wx.navigateTo({url:'/pages/secure/secure'})      
    }else {
      wx.showModal({
        title: '请先绑定手机号',
        content: '紧急情况拨打120',
        confirmText: "确认",
        cancelText: "取消",
        confirmColor: 'red',
        success(res) {
            console.log(res);
            if (res.confirm) {
                wx.navigateTo({url:'/pages/secure/secure'})  
            }else{
                // console.log('用户点击辅助操作')
            }
        }
      })
    }
  }
})