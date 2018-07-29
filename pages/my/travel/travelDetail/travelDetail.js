const http= require("../../../../common/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale: 18,
    latitude: 0,
    longitude: 0,
    orderInfo: {},
    markers:[{
      longitude: 121.46,
      latitude: 31.2,
      iconPath: "../../../../../resources/origin.png",
      width: 22,
      height: 45
    },
      {
        longitude: 121.26,
        latitude: 31.5,
        iconPath: "../../../../resources/origin.png",
        width: 22,
        height: 45
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.handleCyclingOrderDetail(options.orderId)
  },
  handleCyclingOrderDetail: function (orderId){
  
    http.request({
      url:"/ebike/cycling/order/mobile/v1/find/just/end",
      data:{
        cyclingOrderId: orderId
      },success:function(res){
        const markers1latitude = "markers[" + 0 +"].latitude";
        const markers1longitude = "markers[" + 0 + "].longitude";
        const markers2latitude = "markers[" + 1 + "].latitude";
        const markers2longitude = "markers[" + 1 + "].longitude"
        console.log(res);
        var orderInfo = res;
        orderInfo.cyclingTotalTime = Math.ceil(res.cyclingTotalTime / 60)
        this.setData({
          orderInfo:orderInfo,
          [markers1latitude]: res.startLatitude,
          [markers1longitude]: res.startLongitude,
          [markers2latitude]: res.endLatitude,
          [markers1longitude]: res.endLongitude
        })
        console.log(this.data.orderInfo)
      }.bind(this)
    })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '行程明细',
      path: 'pages/my/travel/travelDetail/travelDetail',
      success: function (res) {
        // 转发成功
        console.log("转发成功")
      },
      fail: function (res) {
        console.log("转发失败")
      }
    }
  }
})