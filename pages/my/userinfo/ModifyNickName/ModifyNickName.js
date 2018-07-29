const http = require("../../../../common/http.js")
const notification = require("../../../../common/notification.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      nickName: options.nickName
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
  handleChangeName:function(e){
    this.setData({
      nickName: e.detail.value
    })
  },
  handleSubmit:function(){
    http.request({
      url: '/ebike/member/mobile/v1/update',
      data: {
        memberName: this.data.nickName
      },
      success: function(res) {
        wx.showToast({
          title: '修改成功',
          success:function(){
            setTimeout(function(){
              wx.navigateTo({
                url: '../../my',
              })
            },1000)
          }
        })
        notification.emit("member-info-update", {
        })
      }.bind(this),
  
    })
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