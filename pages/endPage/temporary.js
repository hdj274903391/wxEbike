const http=require("../../common/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
  orderId:null,
  orderInfo:{},
  price:0,
  time:0,
  pay:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.setData({
      orderId:options.orderId,
      price:options.price
    })
    this.handleSetInterval()
  },
  //计时器
  handleSetInterval:function(){
    var  time = 0
    setInterval(function(){
      time ++ ;
       console.log(time)
      this.setData({
        time:time
      })
    }.bind(this),60000)
  },
  //行程结束
    handleCyclingOver:function(){
      http.request({
        url:"/ebike/cycling/order/mobile/v1/over",
        data:{
          cyclingOrderId:this.data.orderId
        },
        success:function(res){
          wx.showToast({
            title: '行程已结束！',
            icon: "none"
          })
        }
      })
    },
  //开锁接口
  handleCyclingLock:function(){
    http.request({
      url:"/ebike/cycling/order/mobile/v1/open/temp/lock",
      data:{},
      success:function(res){
        wx.showToast({
          title: '开锁请求已发送',
          icon:"none"
        })
        this.handleGetLockStatus();
      }.bind(this)
    })
  },
 //监听锁的状态
 handleGetLockStatus:function(){
   
   var timer2 = setInterval(function () {
     http.request({
       url: "/ebike/cycling/order/mobile/v1/lock/bike/order",
       data: {}, success: function (res) {
         if (!res.lockStatu) { 
         }else{
           http.request({
             url: "/ebike/cycling/order/mobile/v1/home/order/status",
             data: {},
             success: function (res) {
               if (res.type == "cycling"||res.type =="openLock") {
                 clearInterval(timer2)
                 wx.navigateTo({
                   url: '../bikePassword/bikePassword',
                 })
               }
             }.bind(this)
           })
         }
       }.bind(this)
     })

   },
     3000)
 },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})