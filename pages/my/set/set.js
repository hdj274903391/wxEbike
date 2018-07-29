const http = require('../../../common/http.js');
const storage = require('../../../common/storage.js');
const notification = require('../../../common/notification.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: "157****6821",
      score: "3462",
      avatarUrl: "",
     
    },
    bottomContent: "登录",
    lock: false,
    code:"",
    phoneNumber: '',
    captchaCode: '',
    openId: ""
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.getStorage({
    //   key: 'userInfo',
    //   success: (res) => {
    //     wx.hideLoading();
    //     this.setData({
    //       userInfo: {
    //         score: res.data.userInfo.score,
    //         nickName: res.data.userInfo.nickName,
    //         avatarUrl: res.data.userInfo.avatarUrl,
    //       },
    //       bottomContent: res.data.bottomContent,
    //       lock: true
    //     })
    //   }
    // })
    this.handleLogin();
  },
  //判断用户是否登录
  handleLogin:function(){
    const openId = storage.getOpenId();
    if (openId){
      this.setData({
        bottomContent: "退出",
        lock: true,
      })
    }else{
      this.setData({
        bottomContent: "登录",
        lock: false,
      })
    }
  },
  aboutService: function () {
    wx.navigateTo({
      url: './aboutService/aboutService',
    })
  },
  handleGoOut: function () {
    var thisData = this.data;
    this.data.lock = !this.data.lock
     // 如果没有登录，登录按钮操作
     if(this.data.lock){
       wx.showLoading({
         title: '正在登陆',
       });
       wx.navigateTo({
         url: '../../login/login',
       })
     }else{
       wx.showModal({
         title: '',
         content: '确认退出？',
         success: (res) => {
         
           if (res.confirm) {
             wx.clearStorage()
            
             this.setData({
               bottomContent: "登录",
               lock: false,
             })
             notification.emit("member-login", {});
             wx.showToast({
               title: '成功退出',
             })
            
           }
         }
       })
     }
    console.log(this)
  },
  handleToRule: function (e) {
    console.log(e)
    wx.navigateTo({
      url: './rules/rules?rule=' + e.currentTarget.dataset.rule + "&navigation=" + e.currentTarget.dataset.navigation,
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