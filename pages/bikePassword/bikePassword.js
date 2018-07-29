const notification = require("../../common/notification.js");
const http = require("../../common/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var timer = setInterval(function(){
      http.request({
        url: "/ebike/cycling/order/mobile/v1/home/order/status",
        data: {},
        success: function (res) {
          if (res.type == "openLock" || res.type == "cycling") {
            wx.navigateTo({
              url: '../index/index',
            })
            clearInterval(timer)
          }
        }.bind(this)
      })
    },1000)
  },
  //跳转报修
  handleTofalut:function(){
    notification.emit("member-bike-running", {});
    wx.navigateTo({
      url: '../my/bikeFault/bikeFault?index=' + 0,
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
  onShareAppMessage: function () {
  
  }
})