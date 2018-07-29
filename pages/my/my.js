
const http = require('../../common/http.js');
const constant = require('../../common/constant.js');
const storage = require('../../common/storage.js');
const notification = require("../../common/notification.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customService:false,
    userInfo: {
      memberName: "未登录",
      score: "0",
      memberAvatarPath: "",
      accountBalance:0,
      routeDistance:0
    },
    userdetail:{
      routeDistance:0,
      accountBalance:0
    },
    serviceItem: [{
      class: "icon-repair",
      name: "车辆故障"
    }, {
      class: "icon-notice",
      name: "举报违停"
    }, {
      class: "icon-battery",
      name: "车桩故障"
    }, {
      class: "icon-news",
      name: "其他问题"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    notification.on("member-pay", this, function (data) {
      this.handleTokenStorge();
    })
    notification.on("member-info-update", this, function (data) {
      this.handleTokenStorge();
    })
    notification.on("member-login", this, function (data) {
      console.log("aaa")
      this.handleTokenStorge()
    })
    this.handleTokenStorge()
  },
  //获取缓存的用户数据
  handleTokenStorge: function () {
    const token = storage.getToken()
    if (token) {
      http.request({
        url: "/ebike/member/mobile/v1/find",
        data: {},
         success: function (res) {
          this.setData({
            userInfo:res
          })
          this.handleUserInfo();
        }.bind(this)
      })
    }
    else {
      const userInfo = {
        memberName: "未登录",
        score: "0",
        memberAvatarPath: "",
        accountBalance: 0,
        routeDistance: 0
      }
      this.setData({
        userInfo: userInfo
      })
    }
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
  //跳转问题，故障提交页面
  handleToSubmit:function(e){
    wx.navigateTo({
      url: './bikeFault/bikeFault?index=' +e.currentTarget.dataset.index,
    })
  },
  changeToUserinfo: function () {
    wx.navigateTo({
      url: './userinfo/userinfo'
    })
  },
  changeToWallet: function () {
    wx.navigateTo({
      url: './wallet/wallet'
    })
  },
  changeToTravel: function () {
    wx.navigateTo({
      url: './travel/travel'
    })
  },
  changeToCardpackage: function () {
    wx.navigateTo({
      url: './cardpackage/cardpackage'
    })
  },
  changeToInvitation: function () {
    wx.navigateTo({
      url: './invitation/invitation'
    })
  },
  changeToSet: function () {
    wx.navigateTo({
      url: './set/set'
    })
  },
  changeToInstructions: function () {
    wx.navigateTo({
      url: './instructions/instructions'
    })
  },
  changeToNews: function () {
    wx.navigateTo({
      url: '../mynews/mynews'
    })
  },
  customService:function(){
    this.setData({
      customService: !this.data.customService
    })
  },
  //获取会员相关信息里程，钱包
  handleUserInfo:function(){
    http.request({
      url: "/ebike/member/account/mobile/v1/find",
      data: {},
      success: function (res) {
   
        this.setData({
          userdetail:res
        })
      }.bind(this)
    })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'e电车',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功")
      },
      fail: function (res) {
        console.log("转发失败")
      }
    }
   
  }
})