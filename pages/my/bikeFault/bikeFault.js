const http=require("../../../common/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultType: [{ titile: "车辆故障描述", relationType: "bike" }, { titile: "违规停车描述", relationType: "disobey" }, { titile: "车桩故障描述", relationType: "knee" }, { titile: "问题描述", relationType:"other"} ],
    index:0,
    inputContent:"",
    bikeCode:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const index = parseInt(options.index);
  this.setData({
    index:index
  })
  wx.setNavigationBarTitle({
    title: this.data.defaultType[index].titile
  })
  },
  //textarea内容
  handleInputContent:function(e){
    console.log(e);
    this.setData({
      inputContent:e.detail.value
    })
  },
  //输入车辆编码
  codeNum:function(e){
    console.log(e.detail.value);
      this.setData({
        bikeCode:e.detail.value
      })
  },
  //提交
  handleSubmit:function(){
    http.request({
      url:"/ebike/operators/maintenance/fault/mobile/v1/save",
      data:{
        relationType: this.data.defaultType[this.data.index].relationType,
        relationId: this.data.bikeCode,
        faultDetail:this.data.inputContent
      },success:function(res){
        console.log(res)
        if(res.result){
          wx.showToast({
            title: '提交成功',
          })
            wx.navigateTo({
              url: '../my',
            })      
        }
      }
    })
  },
  //车辆扫码
  HandleBikeCode:function(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        let bikeCode = res.result.replace(/[^0-9]/ig, "")
        this.setData({
          bikeCode: bikeCode
        })
        console.log(bikeCode)
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
  onShareAppMessage: function () {
  
  }
})