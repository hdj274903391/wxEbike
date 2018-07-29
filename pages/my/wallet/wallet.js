const http = require('../../../common/http.js');
const notification = require('../../../common/notification.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      walletDetail:{
        accountBalance:0,
        score:0,
        redEnvelope:0
      }
  },
  changeToMoney:function(){
    wx.navigateTo({
      url: './money/money',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    notification.on("member-pay", this, function (data) {
      this.handleWalletDetail();
    })
    this.handleWalletDetail()
  },
  handleWalletDetail:function(){
    http.request({
      url:"/ebike/member/account/mobile/v1/find",
      data:{},
      success:function(res){
        this.setData({
          walletDetail:res
        })
      }.bind(this)
    })
  },
  //跳转收支详情
  handleToAccountList:function(){
  wx.navigateTo({
    url: './accountList/accountList',
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