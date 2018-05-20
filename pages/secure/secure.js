let app = getApp()
let wechat = require("../../utils/wechat")
let util = require("../../utils/util")

Page({
  data: {
    files: [],
    address:''
  },
  onLoad(e) {
  },
  chooseImage (e) {
    var that = this;
    wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
              files: that.data.files.concat(res.tempFilePaths)
          })
        }
    })
  },
  previewImage(e){
    wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  bindFormSubmit(e) {
    let dec = e.detail.value.textarea
    let that = this
    if(dec === '') {
      wx.showToast({
        title: '请填写现场描述',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(this.data.files.length === 0) {
      wx.showToast({
        title: '请上传现场照片',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(this.data.address === '') {
      wx.showToast({
        title: '请填写地址',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showModal({
      title: '发布求救信息',
      content: '请保持手机通畅,不要恶意呼救',
      confirmText: "确认发布",
      cancelText: "取消",
      confirmColor: 'red',
      success(res) {
          if (res.confirm) {
              wx.showLoading({
                title: '正在发布',
                mask: true
              })
              let fileName = []
              for(let i = 0; i < that.data.files.length; i++) {
                fileName.push(that.data.files[i].split('-UoNZtI.')[1].split('.')[0])
              }
              let data = {
                uid: app.globalData.uid,
                phone: app.globalData.userInfo.phone || '',
                secId: util.guid(),
                address: that.data.address,
                imgList: fileName,
                dec
              }
              wx.request({
                url: app.globalData.host + '/maydays',
                header: {  
                  "Content-Type": "application/x-www-form-urlencoded"  
                },  
                method: "POST",
                data, 
                success(result) {
                  if (result.data.status == 0) {
                    let cot = 0
                    for(let i = 0; i < that.data.files.length; i++) {
                      wx.uploadFile({
                        url: app.globalData.host + '/maydays/upload?filename=' + result.data.data.imgList[i] + '&pathname=' + result.data.data.secId,
                        filePath:  that.data.files[i],
                        name: 'file',
                        success: function(res){
                          var datas = res.data
                          if(JSON.parse(datas).status === '0') {
                            cot += 1
                          }
                          if(cot === that.data.files.length) {
                            wx.hideLoading()
                            wx.showToast({
                              title: '发布成功',
                              icon: 'success',
                              duration: 2000,
                              complete:function() {
                                wx.switchTab({url:'/pages/index/index'})
                              }
                            })
                          }
                        }
                      })
                    }
                  }
                }
              })
          }else{
              console.log('用户点击辅助操作')
          }
      }
    })
  },
  deleteImg(e) {
    let index = e.currentTarget.dataset.index;
    let temp = this.data.files
    temp.splice(index,1)
    this.setData({
      files: temp
    })
  },
  bindInput(e) {
    let address = e.detail.value
    this.setData({
      address
    })
  }
})