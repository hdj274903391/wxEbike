const http = require("../../../common/http.js");
const notification = require("../../../common/notification.js");
const storage = require("../../../common/storage.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      memberName: "未填写",
      score: "0",
      nickName:"",
      memberAvatarPath: ""
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    notification.on("member-info-update", this, function (data) {
      console.log(2)
      this.handleUserNews();
    })
    this.handleUserNews()
  },
  handleToModifyNickName:function(){
    wx.navigateTo({
      url: './ModifyNickName/ModifyNickName?nickName=' + this.data.userInfo.memberName,
    })
  },
  //获取我的消息
  handleUserNews:function(){
    http.request({
      url:"/ebike/member/mobile/v1/find",
      data:{
        "memberActivityMessageId": "",
      },success:function(res){
        const nickName=storage.getMemberNickName()
        console.log(res)
          this.setData({
            nickName: nickName,
            userInfo:res
          })
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
  onShareAppMessage: function () {
  
  }
})