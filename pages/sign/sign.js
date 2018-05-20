let app = getApp()
let wechat = require("../../utils/wechat")
let util = require("../../utils/util")

Page({
  data: {
    msgTip:'获取验证码',
    name: '',
    id: '',
    phone: '',
    verify: '',
    btnBac: 'red'
  },
  onLoad(e) {

  },

  input(e) {
    let value = e.currentTarget.dataset.name
    this.setData({
      [value]: e.detail.value
    })
  },

  getMsg() {
    let result = util.isPoneAvailable(this.data.phone)
    let that = this
    if(this.data.msgTip === '获取验证码') {
      if(!result) {
        wx.showToast({
          title: '请填写正确的手机号',
          icon: 'none',
          duration: 2000
        })
      }else {
        wx.request( {  
          url: app.globalData.host+"/msg",  
          header: {  
            "Content-Type": "application/x-www-form-urlencoded"  
          },  
          method: "POST",
          data:  { 
            phone: that.data.phone,
            uid: app.globalData.uid
          },  
          success:( res ) => {
            that.setData({
              msgTip: '60S',
              btnBac: 'grey',
            })
            let count = 60
            let inte = setInterval(()=>{
              if(count === 0) {
                clearInterval(inte)
                that.setData({
                  msgTip: '获取验证码',
                  btnBac: 'red',
                })
              }else {
                count -= 1
                that.setData({
                  msgTip: count + 'S'
                })
              }
            }, 1000)
            if(res.data.status === '1') {
              wx.showToast({
                title: '该手机号已被注册',
                icon: 'none',
                duration: 2000
              })
              clearInterval(inte)
              that.setData({
                msgTip: '获取验证码',
                btnBac: 'red',
              })
            }
            if(res.data.status === '0') {
              wx.showToast({
                title: '验证码发送成功',
                icon: 'success',
                duration: 2000
              })
            }
          }
        })
      }
    }
  },

  submit() {
    let that = this
    if(!this.data.verify) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!this.data.name) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!this.data.id) {
      wx.showToast({
        title: '请填写身份证信息',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!this.data.phone) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(this.data.id))) {
      wx.showToast({
        title: '请填写正确的身份证信息',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.request( {  
      url: app.globalData.host+"/msg/check",  
      header: {  
        "Content-Type": "application/x-www-form-urlencoded"  
      },  
      method: "POST",
      data:  { 
        verify: that.data.verify,
        uid: app.globalData.uid,
        phone: that.data.phone
      },  
      success:( res ) => {
        if(res.data.status === '-1000') {
          wx.showToast({
            title: '验证码不正确',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if(res.data.status === '1') {
          wx.showToast({
            title: '验证码过期，请重新获取',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if(res.data.status === '0') {
          wx.request( {  
            url: app.globalData.host+"/users/modify",  
            header: {  
              "Content-Type": "application/x-www-form-urlencoded"  
            },  
            method: "POST",
            data:  { 
              phone: that.data.phone,
              userId: that.data.id,
              username: that.data.name,
              uid: app.globalData.uid,
            },  
            success:( result ) => {
              if(result.data.status === '0'){
                wx.showToast({
                  title: '报名成功',
                  icon: 'success',
                  duration: 2000
                })
                app.globalData.userInfo.phone = result.data.data[0].phone
                app.globalData.userInfo.username = result.data.data[0].username
                app.globalData.userInfo.userId = result.data.data[0].userId
                app.globalData.userInfo.updatetime = result.data.data[0].updatetime
                wx.switchTab({url:'/pages/index/index'})
              }
            }
          })
        }
      }
    })

  }
})