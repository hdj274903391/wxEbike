const http = require('../../common/http.js');
const wechat = require('../../common/wechat.js');
const constant = require("../../common/constant.js");
const storage = require('../../common/storage.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login:false,
    latitude:0,
    longitude:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          lockId: options.lockId
        })
      
      }.bind(this)
    })
    if (options.lockId){
      this.handleScanCode()
    }
  },
  changeToHandKey:function(){
    wx.navigateTo({
      url: '../handKey/handKey',
    })
  },
  handleScanCode:function(){
    const openId = storage.getOpenId()
    if(openId){
      http.request({
        url: "/ebike/cycling/order/mobile/v1/save",
        data: {
          lockId: this.data.lockId,
          latitude: this.data.latitude,
          longitude: this.data.longitude
        },
        success: function (res) {
          wx.navigateTo({
            url: '../bikePassword/bikePassword',
          })
        }
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
   
  },
  scanCode: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        let bikeCode = res.result.replace(/[^0-9]/ig, "")
        this.setData({
          bikeCode: bikeCode
        })
        http.request({
          url:"/ebike/cycling/order/mobile/v1/save",
          data:{
            lockId: bikeCode,
            latitude: this.data.latitude,
            longitude: this.data.longitude
          },
          success:function(res){
              console.log(res)
              wx.navigateTo({
                url: '../bikePassword/bikePassword',
              })
          }
        })
        console.log(bikeCode)
      }
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