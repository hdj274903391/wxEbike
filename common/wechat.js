const constant = require("./constant.js");
const http = require("./http.js");
const storage = require("./storage.js");
const notification = require("./notification.js");

function auth(config) {
  var token = storage.getToken();
  if (token == '') {
    if (storage.getIsLanuch()) {
      if (config.checkLogin) {
      
        
        // wx.navigateTo({
        //   url: '/view/login/wx-login'
        // });
        // notification.on("login-callback", this, function(data) {
        //   if (data.success && config.success) {
        //     config.success();
        //   } else {
        //     if (config.fail) {
        //       config.fail();
        //     }
        //   }
        // });
      }
    } else {
      storage.setIsLanuch();
      // wx.navigateTo({
      //   url: '/view/login/wx-login'
      // });
      // notification.on("login-callback", this, function (data) {
      //   if (data.success && config.success) {
      //     config.success();
      //   } else {
      //     if (config.fail) {
      //       config.fail();
      //     }
      //   }
      // });
    }
  } else {
    config.success();
  }
}

function login(userinfo, config) {
  if (userinfo.detail.errMsg == 'getUserInfo:ok') {
    wx.login({
      success: function(res) {
        var code = res.code;
        console.log(res)
        if (code) {
          http.request({
            url: '/wechat/wechat/mini/mobile/v1/auth',
            data: {
              wechatMiniAppId: constant.wechatAppId,
              jsCode: code,
              encryptedData: userinfo.detail.encryptedData,
              iv: userinfo.detail.iv
            },
            success: function (data) {
              console.log(data)
              if (data.openId) {
                var params = {
                  "wechatUnionId": "",
                  "memberAccount": "",
                  "memberPassword": "",
                  "memberMobile": "",
                  "memberEmail": "",
                  "nickname": data.nickName ? data.nickName : '',
                  "openId": data.openId,
                  "avatar": data.avatarUrl ? data.avatarUrl : '',
                  "memberAvatarId": "",
                  "memberGender": "",
                  "memberBirthday": ""
                }
                wechatAuthLogin(config, params);
              }
            }.bind(this),
            fail: function () {
              config.fail();
            }
          });
        }
      }.bind(this)
    });
  } else if (userinfo.detail.errMsg == 'getUserInfo:fail auth deny') { 
    config.fail();
  }
}

function wechatAuthLogin(config, params) {
  http.request({
    url: '/lixiaonong/member/mobile/v1/wechat/login',
    data: params,
    success: function (data) {
      if (data.token === undefined || data.token === null || data.token.trim() === '') {
        config.fail();
        return;
      }
      storage.setToken(data.token);
      storage.setOpenId(data.openId);
      storage.setMemberNickName(data.memberNickName);
      storage.setMemberAvatarPath(data.memberAvatarPath);
      config.success();
    }, 
    fail: function () {
      config.fail();
    }
  });
}

module.exports = {
  auth: auth,
  login: login
};