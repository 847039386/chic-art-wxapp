
function getToken() {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  let accessToken = wx.getStorageSync("accessToken")
  return accessToken
}

function getExpires() {
  let expires = wx.getStorageSync("expires")
  return expires
}

function getRefreshToken() {
  let refreshToken = wx.getStorageSync("refreshToken")
  return refreshToken
}

function setToken(data){
  let expires = 0
  const { accessToken, refreshToken } = data;
  expires = new Date(Number(data.expires) * 1000).getTime();
  if(expires > 0){
    wx.setStorageSync("expires", expires);
    wx.setStorageSync("accessToken", accessToken);
    wx.setStorageSync("refreshToken", refreshToken);
  }
}

// 验证token是否存在或者，是否过期，如过期或者不存在那么导向登陆页面
function verifyToken() {
  let token = getToken();
  let expires = getExpires();
  let isExpire = false;
  if(expires - Date.now() <= 0){
    // token 过期
    isExpire = true;
  }
  // 当token不存在 或者token过期
  if(!token || isExpire){
    return false;
  }
  return true
}

function setUserInfo(user){
  wx.setStorageSync("user_info", user);
}

function getUserInfo(){
  let user_info = wx.getStorageSync("user_info")
  return user_info
}

module.exports = {
  setToken,
  getToken,
  getExpires,
  getRefreshToken,
  verifyToken,
  setUserInfo,
  getUserInfo
}
