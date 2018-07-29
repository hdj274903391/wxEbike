// pages/test/test.js
const http = require('../../common/http.js');
const util = require("../../utils/util.js");
const storage = require("../../common/storage.js");
const constant = require("../../common/constant.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    auth:true,
    phoneNumber: '',
    captchaCode: '',
    openId: "",
    time:"",
    token:"",
    selectPay:false,
    userInfo:{

    }
  },
  selectPay: function () {
    this.setData({
      selectPay: !this.data.selectPay
    })
  },
  phoneNumberInput: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  captchaCodeInput: function (e) {
    this.setData({
      captchaCode: e.detail.value
    })
  },
  SendCaptcha: function (e) {
    http.request({
      url: '/ebike/member/mobile/v1/sendSms',
      data: {
        phoneNumber: this.data.phoneNumber,
        token:"",
        ipAddress:""
      },
      success: function (result) {
        wx.showToast({
          title: '验证码发送成功',
          icon: 'success',
          duration: 2500
        })
      },
      fail: function (result) {
        console.log(result)
        wx.showToast({
          title: result,
          icon: 'loading',
          duration: 2500
        })
      }
    })
  },
 //获取用户信息按钮
  handleGetUserInfo:function(userinfo){
    if (userinfo.detail.errMsg == 'getUserInfo:ok') {
      console.log(userinfo)
    wx.login({
      success: (res) => {
        var code = res.code;
            if (code) {
              http.request({
                url: '/wechat/wechat/mini/mobile/v1/auth',
                data: {
                  wechatMiniAppId: constant.wechatAppId,
                  jsCode: code,
                  encryptedData: userinfo.detail.encryptedData,
                  iv: userinfo.detail.iv,
                  version: constant.version
                }, success: function (res) {
                  console.log(res);
                  storage.setOpenId(res.openId);
                  storage.setMemberNickName(res.nickName);
                  storage.setMemberAvatarPath(res.avatarUrl);
                  http.request({
                    url: "/ebike/member/mobile/v1/wxauto/login",
                    data: {
                      openId: res.openId
                    }, success: function (res) {
                      console.log(res)
                      if (res.token != '') {

                        storage.setToken(res.token)
                        wx.navigateTo({
                          url: '../index/index',
                        })
                      }
                    }.bind(this)
                  })
                  this.setData({
                    userInfo: res,
                    auth: false
                  })
                }.bind(this) 
              })
            }
        
      }
    });
    } else if (userinfo.detail.errMsg == 'getUserInfo:fail auth deny') {
      config.fail();
    }
  },
  //用户注册登录
  handleLogin:function(){
    var time = util.formatTime(new Date());
    time = time.replace(/\//g, '-');
    this.setData({
      time: time
    }); 
    if (this.data.selectPay){
      http.request({
        url: '/ebike/member/mobile/v1/phone/login',
        data: {
          "phoneNumber": this.data.phoneNumber,
          "code": this.data.captchaCode,
          "codeSendTime": this.data.time,
          "wechatOpenId": this.data.userInfo.openId,
          "wechatUnionId": "",
          "province": this.data.userInfo.province,
          "city": this.data.userInfo.city,
          "memberName": this.data.userInfo.nickName,
          "token": "",
          "idCardNo": "",
          "sex": "",
          "memberAvatarPath": this.data.userInfo.avatarUrl,
        },
        success: function (data) {
          console.log(data)
          if (data.token === undefined || data.token === null || data.token.trim() === '') {
            return;
          }
          storage.setToken(data.token);
          wx.showToast({
            title: '登录成功',
            success: function () {
              wx.navigateTo({
                url: '../index/index',
              })
            }
          })
        }.bind(this),
      })
    }else{
      wx.showToast({
        title: '请同意服务条款',
      })
    }
        
   
  },

  formBindsubmit: function (e) {
    // var requestData = {
    //   wechatOpenId: this.data.openId,
    //   wechatUnionId: '',
    //   wechatNickName: app.globalData.userInfo.nickName,
    //   wechatSex: app.globalData.userInfo.gender == 1 ? 'MAN' : 'WOMAN',
    //   wechatCountry: app.globalData.userInfo.country,
    //   wechatProvince: app.globalData.userInfo.province,
    //   wechatCity: app.globalData.userInfo.city,
    //   wechatLanguage: app.globalData.userInfo.language,
    //   wechatHeadImgUrl: app.globalData.userInfo.avatarUrl,
    //   smsCaptchaMobile: this.data.phoneNumber,
    //   smsCaptchaCode: this.data.captchaCode,
    //   systemRequestUserId: '14463951d1d94d39a9216dbd818fc984',
    //   appId: 'ce217abe0f4646d380c68aa179361980'
    // }
    http.request({
      url: 'http://192.168.1.123:20500/ebike/member/mobile/v1/phone/login',
      data: {
        phoneNumber: this.data.phoneNumber,
      },
      success: function (result) {
        console.log(result);
        wx.setStorage({
          key: 'appId',
          data: {
            openId: result.data.data.openId,
            memberId: result.data.data.memberId,
            token: result.data.data.memberId
          },
          success: function (res) {

            console.log(1);
          }
        })
        if (result.error) {
          wx.showToast({
            title: result.error,
            icon: iconVar,
            duration: 2500
          })
        } else {
          var msg = '登录验证通过！';
          var iconVar = 'success';
          if (result.data.result == false) {
            msg = result.data.message;
            iconVar = 'loading';

          } else {
            setTimeout(function () {
              wx.navigateTo({
                url: '../index/index',
              })
            }, 1000)
          }
          wx.showToast({
            title: msg,
            icon: iconVar,
            duration: 2500
          })


          // wx.navigateTo({
          //    url: '../index/index',
          // })
        }
      },
      fail: function (result) {
        console.log(result)
        wx.showToast({
          title: result.errMsg,
          icon: 'loading',
          duration: 2500
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // this.handleFind();
  },
//跳转租赁规则
  handleToRules:function(e){
    wx.navigateTo({
      url: '../my/set/rules/rules?rule=' + e.currentTarget.dataset.rule,
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