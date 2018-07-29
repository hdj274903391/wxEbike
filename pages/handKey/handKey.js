const http = require('../../common/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFocus: false,
    wallets_password:[],
    latitude: 0,
    longitude: 0
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
        })

      }.bind(this)
    })
    this.ctx = wx.createCameraContext()
  },
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  changeToPassword:function(){
    wx.navigateTo({
      url: '../bikePassword/bikePassword',
    })
  },
  //输入车辆编号
  set_wallets_password(e) {

    this.setData({
      wallets_password: e.detail.value
    });
  },
  set_Focus() {//聚焦input

    this.setData({
      isFocus: true
    })
  },
  set_notFocus() {//失去焦点
    this.setData({
      isFocus: false
    })
  },
  //解锁
  bikePassword:function(){
    if (this.data.wallets_password.length < 7){
      wx.showToast({
        title: '请输入7位数字',
        icon:'none'
      })
    }else{
      // const lockId = parseInt(JSON.stringify(this.data.wallets_password));
      // console.log(lockId)
      http.request({
        url: "/ebike/cycling/order/mobile/v1/save",
        data: {
          lockId: this.data.wallets_password ,
          latitude: this.data.latitude,
          longitude: this.data.longitude
        },
        success: function (res) {
          console.log(res)
          wx.navigateTo({
            url: '../bikePassword/bikePassword',
          })
        }
      })
    }
    
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