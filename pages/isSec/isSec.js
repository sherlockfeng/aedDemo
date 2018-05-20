let app = getApp()
let wechat = require("../../utils/wechat")
let util = require("../../utils/util")

Page({
  data: {
    name: '',
    id: '',
    seId: '',
    btnBac: 'red',
    company: '当前选择：',
    index: 0,
    array: ['红十字会', '民政部', 'AHA', '120急救中心', '其他'],
  },
  onLoad(e) {
    if(!app.globalData.userInfo.phone) {
      wx.showToast({
        title: '请先绑定手机号',
        icon: 'none',
        duration: 2000
      })
      wx.redirectTo({
        url: '/pages/phone/phone'
      })
    }
  },

  input(e) {
    let value = e.currentTarget.dataset.name
    this.setData({
      [value]: e.detail.value
    })
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
        index: e.detail.value,
        company: '当前选择：'+ this.data.array[e.detail.value]
    })
  },

  submit() {
    let that = this
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
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(this.data.id))) {
      wx.showToast({
        title: '请填写正确的身份证信息',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showModal({
      title: '提交审核信息',
      content: '提交之后请等待审核，成功后将电话通知',
      confirmText: "确认提交",
      cancelText: "取消",
      confirmColor: 'red',
      success(res) {
        if (res.confirm) {
          wx.request( {  
            url: app.globalData.host+"/users/modify",  
            header: {  
              "Content-Type": "application/x-www-form-urlencoded"  
            },  
            method: "POST",
            data:  { 
              seId: that.data.seId,
              userId: that.data.id,
              uid: app.globalData.uid,
              company: that.data.index,
              isSe: 1,
            },  
            success:( result ) => {
              if(result.data.status === '0'){
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 2000
                })
                app.globalData.userInfo.seId = result.data.data[0].seId
                app.globalData.userInfo.userId = result.data.data[0].userId
                app.globalData.userInfo.company = result.data.data[0].company
                app.globalData.userInfo.updatetime = result.data.data[0].updatetime
              }
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      }
    })
 


  }
})