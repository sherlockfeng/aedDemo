//index.js
//获取应用实例
let app = getApp();
let wechat = require("../../utils/wechat");
let amap = require("../../utils/amap");
let markersData = [];
let showChange = false
let inId = ''
let util = require("../../utils/util")

Page({
  data: {
    markers: [],
    lastLatitude: '',
    lastLongitude: '',
    latitude: '',
    longitude: '',
    textData: {},
    city: '',
    markerId: 0,
    controls: [],
    hasMap: false,
    pageBackgroundColor:'#4D8AD7',
    systems:'',
    selectMark:{}
  },
  onLoad(e) {
    wechat.getSystemInfo()
      .then(result => {
        this.setData({
          systems:result.system,
          controls: [
            {
              id: 0,
              position: {
                left: 10,
                top: result.windowHeight-150,
                width: 40,
                height: 40
              },
              iconPath: "/images/circle1.png",
              clickable: true
            },
            {
              id: 1,
              position: {
                left: 10,
                top: result.windowHeight-200,
                width: 40,
                height: 40
              },
              iconPath: "/images/help.png",
              clickable: true
            }
          ]
        })
      }).catch(e => {
        console.log(e)
      })
      inId = setInterval(() => {
        this.goLocation()
      },15000)
      this.goLocation()
  },
  goLocation() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) =>{
        let needFlase = false
        let latitude = res.latitude
        let longitude = res.longitude
        if(!this.data.lastLatitude || !this.data.lastLongitude) {
          this.setData({
            lastLatitude: latitude,
            lastLongitude: longitude
          })
          needFlase = true
        }else {
          let distance = util.getDisance(this.data.lastLatitude, this.data.lastLongitude, latitude, longitude)
          distance > 50 && (needFlase = true)
        }
        if(needFlase) {
          let city = '上海'
          let name = '当前位置'
          let desc = '当前位置'
          this.setData({
            city,
            latitude,
            longitude,
            textData: { name, desc }
          })
          wx.request( {  
            url: "https://heyunf.com/nearBy",  
            header: {  
              "Content-Type": "application/x-www-form-urlencoded"  
            },  
            method: "POST",
            data:  { latitude,longitude,city},  
            complete:( res ) => {  
              if( res == null || res.data == null ) {  
                console.error( '网络请求失败' );  
                return;  
              } 
              res.data.data.push({
                iconPath: "/images/location.png",
                width :20,
                height : 35,
                // id : 0,
                latitude:latitude+'',
                longitude:longitude+'',
                distance:0,
                address:'当前位置',
                name:'当前位置',
                imglist:[]
              })
              let markers = res.data.data;
              if(markers.length > 1){
                markers.forEach((item, index) => {
                  if(index !==markers.length - 1){
                    if(item.ismr===0){
                      item.iconPath = "/images/aedMR.png"
                    }else{
                      item.iconPath = "/images/aedIcon.png"
                    }
                    item.width = 32
                    item.height = 42
                  }
                  item.id = index
                })
                
                markers[0].callout= { content: "离我最近",  
                  color: "white",  
                  fontSize: "12",   
                  borderRadius: "5",  
                  bgColor: "grey",  
                  padding: "8",  
                  display:"ALWAYS" ,
                  textAlign: "center"
                }
                this.setData({ markers,selectMark: markers[0],pageBackgroundColor:'#4D8AD7'});
                console.log(markers[0])
                this.showMarkerInfo(markers[0]);
                this.changeMarkerColor(0);
              }else{
                this.showMarkerInfo({
                  name: '附近暂无AED设备',
                  address:''
                })
                this.setData({
                  pageBackgroundColor:'grey',
                  markers
                })
              }
              this.setData({
                hasMap:true,
              })
              showChange = true
            }
          }) 
        }
      }
    })
  },
  onShow(){
    if(showChange){
      clearInterval(inId)
      inId = setInterval(() => {
        this.goLocation()
      },15000)
      this.goLocation()
      this.setData({
        hasMap:false
      })
      this.setData({
        hasMap:true
      })
    }
  },
  makertap(e) {
    let { markerId } = e;
    let { markers } = this.data;
    let marker = markers[markerId];
    this.setData({
      selectMark: marker
    })
    this.showMarkerInfo(marker);
    this.changeMarkerColor(markerId);
  },
  showMarkerInfo(data) {
    let { name, address: desc } = data;
    this.setData({
      textData: { name, desc }
    })
  },
  changeMarkerColor(markerId) {
    let { markers } = this.data;
    markers.forEach((item, index) => {
      if(index!==markers.length-1){
        if(item.ismr===0){
          item.iconPath = "/images/aedMR.png"
        }else{
          item.iconPath = "/images/aedIcon.png"
        }
        if (index == markerId) item.iconPath = "/images/aedSelect.png";
      }

    })
    this.setData({ markers, markerId });
  },
  getRoute() {
    // 起点
    let { latitude, longitude, markers, markerId, city, textData } = this.data
    let { name, desc } = textData
    if (!markers.length) return
    // 终点
    let { latitude: latitude2, longitude: longitude2 } = markers[markerId]
    clearInterval(inId)
    // wx.openLocation({
    //   latitude: +latitude2,
    //   longitude: +longitude2,
    //   name,
    //   address: desc
    // });
    let url = `/pages/routes/routes?longitude=${longitude}&latitude=${latitude}&longitude2=${longitude2}&latitude2=${latitude2}&city=${city}&name=${name}&desc=${desc}`;
    wx.navigateTo({ url });
  },
  clickcontrol(e) {
    console.log(e)
    if(e.controlId === 0) {
      let { controlId } = e;
      console.log("回到用户当前定位点");
      this.goLocation()
      // let mpCtx = wx.createMapContext("map");
      // mpCtx.moveToLocation();
    }else{
      clearInterval(inId)
      wx.navigateTo({url:'/pages/intro/intro'});
    }
  },
  mapchange() {
    console.log(this.data.systems)
    if(this.data.systems.indexOf('iOS')!=-1) {
      let temp = this.data.markers.slice(0)
      this.setData({ markers:[] });
      this.setData({ markers:temp });
      console.log("改变视野");
    }

  },
  onShareAppMessage () {
    return {
      title: 'AED',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  previewImg:function(e){
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.selectMark.imglist;
    imgArr = imgArr.map((value, index)=>{
      return "https://heyunf.com/images/"+this.data.selectMark._id+"/"+value
    })
    console.log(imgArr)
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})
