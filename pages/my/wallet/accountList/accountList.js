const http = require("../../../../common/http.js");
const utils = require("../../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:1000,
    accountList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleAccountList()
  },
  //获取收支明细接口
  handleAccountList:function(){
    http.request({
      url: '/ebike/member/account/detail/mobile/v1/list',
      data: {
        "pageIndex": 1,
        "pageSize": 30,
      },
      success: function(res) {
        console.log(res)
        const accountList = res.list.map(item =>{
          return {
            transactionType: item.transactionType,
            moneyChange: item.moneyChange,
            systemUpdateTime: item.systemUpdateTime
          }
        })
        for (var i = 0; i < accountList.length;i++){
          
          accountList[i].systemUpdateTime = utils.formatTimeReturn(accountList[i].systemUpdateTime/1000,"Y-M-D" )
          switch (accountList[i].transactionType){
                case "0":
              accountList[i].transactionType = "充值金额"
              break;
                case "1":
              accountList[i].transactionType = "提现金额"
              break;
                case "2":
              accountList[i].transactionType = "支付金额"
              break;
              default:
              accountList[i].transactionType = "预约支付金额"
            }
        }
        console.log(accountList)
        this.setData({
          accountList: accountList
        })
      }.bind(this),

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