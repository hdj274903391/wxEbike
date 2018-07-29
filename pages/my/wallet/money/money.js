const http = require('../../../../common/http.js');
const storage = require('../../../../common/storage.js');
const notification = require('../../../../common/notification.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectItem: [{ firstNum: "5", secondNum: "1" }, { firstNum: "10", secondNum: "3" }, { firstNum: "20", secondNum: "7" }, { firstNum: "50", secondNum: "18" }],
    selectColor:0,
    selectPay:1,
    totalFee:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleRebateRule();
  },
  select:function(e){
    const i = e.currentTarget.dataset.findex;
    this.setData({
      selectColor: i,
      totalFee: this.data.selectItem[i].rechargeMoney
    })
    console.log(this.data.totalFee)
  },
  selectPay:function(e){
    const d = this.data;
    const i = e.currentTarget.dataset.pay;
    console.log(d.selectPay);
    if (d.selectPay == i) {
      this.setData({
        selectPay: null
      })
    } else {
      this.setData({
        selectPay: i,
      })
    }
  },
  //支付前
  handlePayBefore: function (res){
    http.request({
      url: '/wechat/wechat/pay/mobile/v1/unified/order',
      data: {
        openId: storage.getOpenId(),
        tradeType: "JSAPI",
        outTradeNo:res.cyclingRechargeId,
        body: "e电车-订单",
        totalFee: res.moneyChange,
        attach: JSON.stringify({ cyclingOrderId: res.cyclingRechargeId })
      }, 
      success:function(res){
        console.log(res)
        wx.requestPayment(
          {
            'timeStamp': res.timeStamp,
            'nonceStr': res.nonceStr,
            'package': res.packageStr,
            'signType': res.signType,
            'paySign': res.paySign,
            'appId': res.appId,
            'success': function (res) {
              notification.emit("member-pay", {})
              wx.showToast({
                title: '充值成功',
              })
              setTimeout(function(){
                wx.navigateBack({})
              },1000)
             },
      
          })
       // this.handlePayTest(res.outTradeNo);
      }.bind(this),
      })
  },
  //支付
  handlePay:function(){
    console.log(this.data.selectItem)
    http.request({
      url:"/ebike/cycling/recharge/mobile/v1/save",
      data:{
        memberActivityRedRuleId: this.data.selectItem[this.data.selectColor].memberActivityRedRuleId
      },
      success:function(res){
          console.log(res)
          this.handlePayBefore(res)
 
      }.bind(this)
    })
 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //红包返利规则列表
  handleRebateRule:function(){
    http.request({
      url:"/ebike/member/activity/red/rule/mobile/v1/list",
      data:{},
      success:function(res){
        this.setData({
          selectItem:res
        })
      }.bind(this)
    })
  },
  //跳转退还规则
  handleToRefund:function(){
    wx.navigateTo({
      url: './refund/refund',
    })
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