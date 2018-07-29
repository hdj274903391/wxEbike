// pages/my/wallet/money/refund/refund.js
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
  
  },
  handleToRefund:function(){
    wx.navigateTo({
      url: './refundSubmit/refundSubmit',
    })
  }
,
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})