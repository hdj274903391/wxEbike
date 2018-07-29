const constant = require("./constant.js");

const opoen_id_key = ('opoen_id_' + constant.version);
const token_key = ('token_' + constant.version);
const member_avatar_path_key = ('member_avatar_path_' + constant.version);
const member_nick_name_key = ('member_nick_name_' + constant.version);
const orderId_key = ('orderId_' + constant.version);
function getIsLanuch() {
  var is_lanuch = wx.getStorageSync('is_lanuch');

  if (is_lanuch == "") {
    return false;
  }

  return is_lanuch;
}

function setIsLanuch() {
  wx.setStorageSync('is_lanuch', true);
}

function getOpenId() {
  return wx.getStorageSync(opoen_id_key);
}

function setOpenId(opoen_id) {
  wx.setStorageSync(opoen_id_key, opoen_id);
}

function getToken() {
  return wx.getStorageSync(token_key);
}

function setToken(token) {
  wx.setStorageSync(token_key, token);
}

function getMemberAvatarPath() {
  return wx.getStorageSync(member_avatar_path_key);
}

function setMemberAvatarPath(member_avatar_path) {
  wx.setStorageSync(member_avatar_path_key, member_avatar_path);
}

function getMemberNickName() {
  return wx.getStorageSync(member_nick_name_key);
}

function setMemberNickName(memberNickName) {
  wx.setStorageSync(member_nick_name_key, memberNickName);
}
function setOrderId(orderId) {
  wx.setStorageSync(orderId_key, orderId);
}
function getOrderId(orderId) {
  wx.setStorageSync(orderId_key);
}
module.exports = {
  getIsLanuch: getIsLanuch,
  setIsLanuch: setIsLanuch,
  getOpenId: getOpenId,
  setOpenId: setOpenId,
  getToken: getToken,
  setToken: setToken,
  getMemberAvatarPath: getMemberAvatarPath,
  setMemberAvatarPath: setMemberAvatarPath,
  getMemberNickName: getMemberNickName,
  setMemberNickName: setMemberNickName,
  setOrderId:setOrderId,
  getOrderId:getOrderId
};