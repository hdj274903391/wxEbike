
const http = require('../../common/http.js');
const constant = require('../../common/constant.js');
const storage = require('../../common/storage.js');
const util = require("../../utils/util.js");
const notification = require('../../common/notification.js');
const app = getApp()

Page({
  data: {
    order:false,
    orderSuccess:false,
    running:false,
    customService:"none",
    latitude: "",
    longitude: "",
    newlatitude:null,//移动后的坐标
    newlongitude:null,
    markers:[],
    markersId:1,//网点所在下标
    areaPointId:0, //网点Id
    price:0,//收费价格
    orderId:"",//订单号
    orderInfo:{},//订单信息
    orderStatus:"",
    isOrder:false,
    isScan:false,
    isDone:false,
    polyline: [
      {
        points: [{
          longitude: 120.1,
          latitude: 30
        }, {
          longitude: 120.2,
          latitude: 30
        }, {
            longitude: 120.2,
            latitude: 29.9
        }, {
          longitude: 120.1,
          latitude: 29.9
        }, {
            longitude: 120.1,
            latitude: 30
        }],
        color: "#0000ffDD",
        width: 2,
      }
    ]
   
  },
  onLoad: function (e) {  
  
    notification.on("member-bike-running", this, function (data) {
      this.handleOrderStatus();
    }) 
    notification.on("member-login", this, function (data) {
      this.handleOrderStatus();
    }) 
    //获取当前坐标
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude,
          })
   
        this.handleUserLogin();
      }.bind(this)
    })
  },
 
  onShow: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap');
  
  },
  //获取当前坐标
  handleLocalOrigin:function(){
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          newlatitude:null,
          newlongitude:null
        })

        this.handleOrderStatus();
      }.bind(this)
    })
  },
  //发送坐标
  handleSendOrigin: function (facilitiesBikeId){
    wx.getLocation({
      success: function (res) {
        http.request({
          url: "/ebike/cycling/order/mobile/v1/send/latLat",
          data: {
            lockId: facilitiesBikeId,
            latitude: res.latitude,
            longitude: res.longitude,
          },success:function(){
            if (!this.data.isDone) {
              setTimeout(function () {
                this.handleSendOrigin(facilitiesBikeId)
              }.bind(this), 10000)
            }

          }.bind(this)
        })
      }.bind(this),
    })
  },
  //获取锁的状态
  handleLockStatus:function(){
    http.request({
      url: "/ebike/cycling/order/mobile/v1/lock/bike/order",
      data:{},success: function (res) {
        if (res.lockStatu) {
            this.setData({
              isDone:true
            })
            setTimeout(function(){
              wx.redirectTo({
                url: '../endPage/endPage?orderId=' + this.data.orderId + '&price=' + this.data.price,
              })
            }.bind(this),500)
        }else{
          setTimeout(function(){
            this.handleLockStatus()
          }.bind(this),3000)
        }
      }.bind(this)
    })
  },
  //发送当前坐标
  handleSetTimeout: function (facilitiesBikeId) {
    this.handleAreaList();
     this.handleSendOrigin(facilitiesBikeId);
    this.handleLockStatus();
  },
  // //判断用户是否存在
  handleUserLogin:function(){
    const openId = storage.getOpenId()
    http.request({
      url:"/ebike/member/mobile/v1/wxauto/login",
      data:{
        openId: openId
      },success:function(res){
        if (res.token != ''){

          storage.setToken(res.token)
          this.handleOrderStatus();
        }else{
          wx.navigateTo({
            url: '../login/login',
          })
        }
        
      }.bind(this)
    })
  },

  //获取订单状态
  handleOrderStatus:function(){
    http.request({
      url:"/ebike/cycling/order/mobile/v1/home/order/status",
      data:{},
      success:function(res){
       if(res.orderId){
         this.setData({
           orderId: res.orderId
         })
       }
      
        switch (res.type){
          case "cyclingSubOrder":
          this.setData({
            order:true,
            orderSuccess:true,
            isScan:false
          })
          break;
          case "openLock":
            this.handleCyclingOrderDetail()
            this.setData({
              orderStatus: "cycling",
              running: true,
              order: false,
              isScan: true
            })

            break;
          case "cycling":
            this.handleCyclingOrderDetail()
            var timer= setInterval(function(){
              this.handleCyclingOrderDetail()

            }.bind(this),180000)
            
            this.setData({
              orderStatus:"cycling",
              running: true,
              order:false,
              isScan: true
             
            })

          break;
          case "tempLock":
      
            wx.redirectTo({
              url: '../endPage/temporary?orderId=' + this.data.orderId + '&price=' + this.data.price,
            })
            break;
          default:
          
          this.setData({
            running:false,
            order: false,
            isScan:false
          })
            this.handleAreaList()
         ;
        }
      }.bind(this)
    })
  },
  //获取骑行订单详情
  handleCyclingOrderDetail:function(){
    this.setData({
      running: true
    })
    http.request({
      url:"/ebike/cycling/order/mobile/v1/find/just/end",
      data:{
        cyclingOrderId: this.data.orderId
      },
      success:function(res){
        //         for (let i = 0; i < travelList.length; i++) {
        //    let orderStartTime = travelList[i].orderStartTime
        //    console.log(orderStartTime)
        //   // orderStartTime = util.formatTime(new Date(orderStartTime))
        //   orderStartTime=util.js_date_time(orderStartTime)
        //   console.log(orderStartTime)
        // }
        let nowTime =  Date.parse(new Date());
        let cyclingTime = Math.ceil((nowTime - res.orderStartTime) / 60000)
        res.cyclingTotalTime = cyclingTime;
        let totalPrice =0;
        if (cyclingTime > res.minTime){
           totalPrice = Math.ceil(cyclingTime / (res.timeUnit)) * (res.unitTimePrice)
          res.cyclingTotalPrice = totalPrice
        }
        
        this.setData({
          orderInfo:res
        })
          this.handleSetTimeout(res.facilitiesBikeId)
      }.bind(this)
    })
  },
  //点击markers触发事件
  handlemarkerstap:function(e){
 if (this.data.running){
      this.setData({
        order:false
      })
    }else{
      this.setData({
        order: true
      })
    }
     console.log(this.data.markers)
    let  markerId = e.markerId  ;
    let iconPath = "markers[" + markerId + "].iconPath";
    let markers = this.data.markers;

    let areaPointMarkers = markers.filter(item =>item.iconType == "areaPoint" );
    console.log(areaPointMarkers)
     let bikeMarkers = markers.filter(item =>item.iconType == "bike");
    for (let i = 0; i < areaPointMarkers.length; i++) {
      areaPointMarkers[i].iconPath ="../../resources/origin1.png"
    }
    let newMarkers = areaPointMarkers.concat(bikeMarkers)
    this.setData({
      markers: newMarkers,
      markersId: markerId,
      areaId: this.data.markers[markerId].areaId,
      areaPointId: this.data.markers[markerId].areaPointId,
      [iconPath]:"../../resources/originSelect.png",
    })

      this.handleAreaPrice()
  },

  //获取网点列表，
  handleAreaList:function(){
   let thislatitude = this.data.latitude;
  let  thislongitude = this.data.longitude;
  if (this.data.newlatitude != null){
      thislatitude = this.data.newlatitude;
      thislongitude = this.data.newlongitude
    }
   
    http.request({
      url:"/ebike/area/point/mobile/v1/list",
      data:{
        latitude: this.data.latitude,
        longitude: this.data.longitude,
      },
      success:function(res){
        var polyline = [];   
         for (var i = 0; i < res.areaPointAroundList.length;i++ ){
          var polylin = {};
          if (res.areaPointAroundList[i].scopeList.length > 0){
            var point = res.areaPointAroundList[i].scopeList.map(item => {
              return {
                longitude: item.longitude,
                latitude: item.latitude
              }
            });
            var point_first = point[0];
            if (point.length > 2) {
              point.push(point_first)
            }
            polylin.points = point;
            polylin.color = "#0000ffDD",
            polylin.width = 2,
            polyline.push(polylin)
          }
         }
        const resMarkers = res.areaPointResultList.map((item ,index)=>{
           item.id= index
          return{
            id:item.id,
            iconType:"areaPoint",
            areaId: item.areaId,
            areaPointId: item.areaPointId,
            iconPath:"../../resources/origin1.png",
            longitude: item.centerLongitude,
            latitude: item.centerLatitude,
            width: 45,
            height:50,
            distance:0
          }
        })
        let temp = 0;
        //判断最近网点
        for (let i = 0; i < resMarkers.length ;i++){
          
          let x = Math.abs(resMarkers[i].longitude - this.data.longitude);
          let y = Math.abs(resMarkers[i].latitude - this.data.latitude)
          resMarkers[i].distance = Math.pow(x, 2) + Math.pow(y, 2)
         
          if (resMarkers[temp].distance >= resMarkers[i].distance ){
            temp = i 
          }    
        }

        //设置默认网点图标不同
        var iconPath = "markers[" + temp + "].iconPath" ;
        this.setData({
         
          polyline: polyline,
          markers: resMarkers,
          [iconPath]: "../../resources/originSelect.png",
          areaPointId: resMarkers[temp].areaPointId,
          markersId: temp 
        })
        this.handleGetBike();
        this.handleAreaPrice()
      }.bind(this)
    })
  },
  //计费策略
  handleAreaPrice: function (){
    let index = this.data.markersId;
      http.request({
        url:"/ebike/area/strategy/price/mobile/v1/sub/order/find",
        data:{
          areaId: this.data.markers[index].areaId
        },success:function(res){
          this.setData({
            price: res.subPrice
          })
        }.bind(this)
      })
    },
  //控件事件
  handleFirst: function () {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      scale: 18,

    })
  },
  handleSecond:function(){
    const token = storage.getToken();
    if (token != "") {
      if (this.data.isScan) {
        this.setData({
          order: false,
        })
      } else {
        this.orderDisplay()
      }

    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    };
  },
  handleThird:function(){
    this.handleLocalOrigin();
  },
  handleFourth:function(){
    console.log(0)
    const token = storage.getToken();
    if (token != "") {
      wx.navigateTo({
        url: '../my/my',
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    };
  },
  handleFive:function(){
    const token = storage.getToken();
    if (token != "") {
      if (!this.data.isScan) {
        wx.navigateTo({
          url: '../selectionKey/selectionKey',
        })
      }
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  //获取网点外车辆
  handleGetBike: function () {
    http.request({
      url: '/ebike/facilities/bike/current/data/mobile/v1/list',
      data: {
        "latitude": this.data.latitude,
        "longitude": this.data.longitude,
        "pageIndex": 0,
        "pageSize": 10,
      },
      success: function (res) {
        let markers = this.data.markers;
        let bikeList = res.resultList.map(item => {
          return {
            longitude: item.longitude,
            latitude: item.latitude,
            iconPath: "../../resources/bike.png",
            width: 45,
            height: 50,
            iconType:"bike"
          }
        })
     var newmarkers =  markers.concat(bikeList)
      this.setData({
        markers: newmarkers
      })
      }.bind(this)
    })
  },
  //地图拖动事件
  handLeRegionChange:function(e){
    if (e.type == "end"){
      this.mapCtx.getCenterLocation({
        success: function (res) {
          this.setData({
            newlatitude: res.latitude,
            newlongitude: res.longitude
          })
          this.handleAreaList()
        }.bind(this)
      })
    }else{

    }
  },
  //预约显示
  orderDisplay:function(){
    const token = storage.getToken();
    if(token === ""){
        wx.navigateTo({
          url:"../login/login"
        })
    }else{
      if (!this.data.order){
        this.setData({
          order: true,
          isOrder: true
        })
      }else{
        this.setData({
          order: false,
          isOrder:false
        })
      }
     
    }
  },
  //预约成功
  orderSuccess: function () {
    if(this.data.markers.length < 2){
      wx.showToast({
        title: '附近网点暂无可用车辆',
        icon:"none"
      })
    }else{
      http.request({
        url: "/ebike/cycling/sub/order/mobile/v1/save",
        data: {
          areaPointId: this.data.areaPointId,
        }, success: function (res) {
          console.log(res);
          wx.showToast({
            title: res.message
          })
          if (res.result) {
           
            this.setData({
              orderSuccess: true,
              orderId: res.cyclingSubOrderId,
          
            })
          } else {
            wx.showToast({
              title: res.message,
              icon: "none"
            })
            if (res.message != "已有未支付预约订单") {
              // const markers= this.data.markers
              // const markersId= this.data.markersId
              // markers.splice(markersId, 1);
              // for (var i = 1; i < markers.length;i++ ){
              //   markers[i].id - 1;
              //   console.log(markers[i])
              // }
              // this.setData({
              //   markers: markers
              // })
              // console.log(this.data.markers)
            } else {
              this.setData({
                orderSuccess: true,
              })
            }
          }
        }.bind(this)

      })
    }
  },
  //取消预约
  cancleOrder: function () {
    // http.request({
    //   url: "/ebike/cycling/sub/order/mobile/v1/cancle",
    //   data:{},
    //   success:function(res){
    //     if(res.haveSubOrder){

    //     }
    //   }
    // })


    wx.showModal({
      title: '',
      content: '是否取消预约',
      success: (res) => {
       http.request({
         url: "/ebike/cycling/sub/order/mobile/v1/cancle",
         data:{
           cyclingSubOrderId: this.data.orderId,
          
         },success:function(res){
           console.log(res);
           if (res.result){
             wx.showToast({
               title: '成功取消预约',
             })
             this.setData({
               orderSuccess: false
             })
           }
         }.bind(this)
       })
      
      }
    })
  },
 
})
