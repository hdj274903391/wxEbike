const http = require("../../../common/http.js")
const util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sumTotalMileage:0,
    travelList:[],
    NowYear:2000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleCyclingList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  handleToDetail:function(e){
    
    console.log(e.currentTarget.dataset.orderid)
    wx.navigateTo({
      url: './travelDetail/travelDetail?orderId=' + e.currentTarget.dataset.orderid ,
    })
  },
  //骑行订单列表
  handleCyclingList:function(){
    const year = new Date()
    const NowYear = year.getFullYear(4);
    http.request({
      url:"/ebike/cycling/order/mobile/v1/list",
      data:{
        "pageIndex": 1,
        "pageSize": 5,
      },success:function(res){
        console.log(res)

        const travelList=res.list.map(item =>{
          return{
            cyclingTotalTime: Math.ceil(item.cyclingTotalTime / 60) ,
            cyclingTotalPrice: item.cyclingTotalPrice,
            orderStartTime: util.formatTimeReturn(item.orderStartTime / 1000 , "M月D日") + util.formatTimeReturn(item.orderStartTime /1000, "h:m"),
            cyclingOrderId: item.cyclingOrderId
          }
        })
        this.setData({
          sumTotalMileage: res.sumTotalMileage,
          travelList: travelList,
          NowYear: NowYear
        })

        console.log(this.data.travelList)
    
      }.bind(this)
    })
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