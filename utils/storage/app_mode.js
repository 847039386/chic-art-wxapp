function getAppMode(){
  let mode = wx.getStorageSync("APP_MODE")
  if(mode){
    return mode;
  }else{
    wx.setStorageSync("APP_MODE", 'CLIENT');
    return 'CLIENT'
  }
}
function switchClientAppMode(){
  wx.setStorageSync("APP_MODE", 'CLIENT');
}

function switchWorkAppMode(){
  wx.setStorageSync("APP_MODE", 'WORK');
}

module.exports = {
  getAppMode,
  switchClientAppMode,
  switchWorkAppMode
}