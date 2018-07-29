const http = require("../../common/http.js");
const notification = require("../../common/notification.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:null,
    orderInfo: { cyclingTotalPrice: 0, cyclingTotalMileage: 0, cyclingTotalTime: 0, cyclingTotalTime:0},
    price:0,
    time:30,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var timer = this.data.time;
    var timeInterval = setInterval(function () {
         if (timer >= 0) {
           timer --  
           this.setData({
             time: timer
           })
           }else{
           clearInterval(timeInterval);
           wx.navigateTo({
             url: './paySuccess/paySuccess?orderId=' + this.data.orderId,
           })
           }
      }.bind(this), 1000)

    this.setData({
      orderId: options.orderId,
      price:options.price
    })
    this.handleOrderDetail();
  },
  //
  handleOrderEnd:function(){
    wx.navigateTo({
      url: './paySuccess/paySuccess?orderId=' + this.data.orderId,
    })
  },
  //订单详情
  handleOrderDetail:function(){
    http.request({
      url: "/ebike/cycling/order/mobile/v1/find/just/end",
      data: {
        cyclingOrderId: this.data.orderId
      },
      success: function (res) {
        console.log(res)
        this.setData({
          orderInfo: res
        })
        }.bind(this)
        
      })
  },
  //临时上锁
  handleCyclingLock:function(){
    if (this.data.time >= 0){
      http.request({
        url: "/ebike/cycling/order/mobile/v1/temp/lock",
        data: {
          cyclingOrderId: this.data.orderId
        }, success: function (res) {
          wx.navigateTo({
            url: 'temporary?orderId=' + this.data.orderId + '&price=' + this.data.price,
          })

        }.bind(this)
      })
    }else{
      wx.navigateTo({
        url: './paySuccess/paySuccess?orderId=' + this.data.orderId,
      })
    }
  
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