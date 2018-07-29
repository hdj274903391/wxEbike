// pages/endPage/endPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareNum:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        // 分享成功
        console.log('shareMenu share success')
        console.log('分享' + res)
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
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
  sharePeople:function(){
    
  },
  onShareAppMessage: function (res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: '邀请好友',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        let shareNum = this.data.shareNum + 1;

        this.setData({
          shareNum: shareNum
        })
        console.log("转发成功")
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) {},
          fail: function (res) { console.log(res) },
        
        })
      }.bind(this),
      fail: function (res) {
        console.log("转发失败")
      }
    }
  }
})