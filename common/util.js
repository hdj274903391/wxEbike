const constant = require("./constant.js");
const storage = require("./storage.js");

function isPhone(phone) {
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
        return false;
    }
    return true;
}

function showSuccessToast(config) {
    wx.showToast({
        title: config.title,
        icon: 'success',
        mask: true,
        duration: constant.duration,
        success: config.success
    });
}

function showFailToast(config) {
    wx.showToast({
        title: config.title,
        icon: "none",
        mask: true,
        duration: constant.duration,
        success: config.success
    });
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
} 

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function timeToDateStr(time) {
  var differTime = parseInt((new Date().getTime() - time) / 1000);
  if (differTime <= 0) {
    return "刚刚";
  } else if (differTime < 60) {
    return differTime + "秒前";
  } else if (differTime < 3600) {
    return parseInt(differTime/60) + "分钟前";
  } else if (differTime < 86400) {
    return parseInt(differTime/3600) + "小时前";
  } else if (differTime < 2592000) {
    return parseInt(differTime / 86400) + "天前";
  } else if (differTime < 31104000) {
    return parseInt(differTime / 2592000) + "月前";
  } else {
    return parseInt(differTime / 31104000) + "年前";
  }

}

//gmc
function timeToDateStrTime(time) {
	  var differTime = parseInt((new Date().getTime() - time) / 1000);
	  
	  var date = new Date(time);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	  var Y = '';
	  var M = '';
	  var D = '';
	  var h = '';
	  var m = '';
	  if (differTime < 60) {
		  h = date.getHours() + ':';
		  m = date.getMinutes();
	    return h+m;
	  } else if (differTime < 3600) {
		  h = date.getHours() + ':';
		  m = date.getMinutes();
	    return h+m;

	  } else if (differTime < 86400) {
		  h = date.getHours() + ':';
		  m = date.getMinutes();
	    return h+m;

	  } else if (differTime < 2592000) {
		  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		  D = date.getDate() + ' ';
		  return M+D;
	  } else if (differTime < 31104000) {
		  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		  D = date.getDate() + ' ';
		  return M+D;
	  } else {
		  Y = date.getFullYear() + '-';
		  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		  D = date.getDate();
		  return Y+M+D;
	  }
}

function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    // var h = date.getHours() + ':';
    // var m = date.getMinutes() + ':';
    // var s = date.getSeconds();
    // return Y+M+D+h+m+s;
    return  Y+M+D;
}

module.exports = {
    isPhone: isPhone,
    showSuccessToast: showSuccessToast,
    showFailToast: showFailToast,
    timeToDateStr: timeToDateStr,
    formatTime: formatTime,
    timestampToTime:timestampToTime,
    timeToDateStrTime: timeToDateStrTime
};