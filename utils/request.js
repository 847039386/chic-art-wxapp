const { setToken ,getToken , getExpires ,getRefreshToken ,setUserInfo } = require('./auth')
const { host } = require('./config')
const baseURL = host + '/api';


function refreshToken() {
  return new Promise(function (resolve,reject) {
    wx.request({
      url: baseURL + '/auth/refresh-token',
      method: 'POST',
      data: { refreshToken :getRefreshToken() },
      header :{
        'Content-Type': 'application/json'
      },
      timeout: 5000,
      success(res) { 
        if(res.data.success){
          setToken(res.data.data)
          resolve(res.data);
        }else{
          reject({message :res.data.message})
        }
      },
      fail (err) {
        reject(err)
      }
    })
  })
}

const wxLogin = () => {
  return new Promise((resolve, reject) => {
      wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (wx_ProfileRes) => {
        let nickname = wx_ProfileRes.userInfo.nickName
        let avatar = wx_ProfileRes.userInfo.avatarUrl
        wx.login({
          success: async (wx_LoginRes) => {
            let code = wx_LoginRes.code
            wx.request({
              url: baseURL + '/auth/wx_login',
              data:{code,avatar,nickname},
              method:"POST",
              success:(res) => {
                if(res.data.success){
                  let nickname = res.data.data.nickname;
                  let name = res.data.data.name || null;
                  let avatar = res.data.data.avatar;
                  let _id = res.data.data.user_id
                  setToken(res.data.data)
                  setUserInfo({_id,nickname,avatar,name})
                  resolve(res.data)
                }else{
                  reject({message : res.data.message})
                }
              },
              fail:(err) => {
                reject(err)
              }
            })
          },
          fail :(wx_LoginRes_err)=>{
            reject(wx_LoginRes_err)
          }
        })
      },
      fail :(wx_ProfileRes_err)=>{
        wx.showToast({
          title: '需要个人信息',
          icon: 'error',
          duration: 2000
        })
        reject(wx_ProfileRes_err)
      }
    })
  });
}



/**
 *  使用Promise 对wx.request进行分装
 * @param {*} params 
 */

function request(params = { methods, url, data }) {
  let token = getToken();
  let expires = getExpires();
  return new Promise(async function (resolve,reject) {
    let header = {
      'Content-Type': 'application/json'
    }
    if(token){
      if(expires - Date.now() <= 0){
        // token 过期
        refreshToken().then().catch((error) => {
          reject(error)
        })
      }
      header = Object.assign(header ,{ 'Authorization': "Bearer " + getToken() })
    }
    wx.request({
      url: baseURL + params.url,
      method: params.method,
      data: params.data ? JSON.stringify(params.data) : null,
      header,
      timeout: 5000,
      success(res) { 
        if(res.data.success){
          resolve(res.data);
        }else{
          reject({message :res.data.message})
        }
      },
      fail (err) {
        reject(err)
      }
    })
  })
}

function uploadFile(url ,filePath) {
  let token = getToken();
  let expires = getExpires();
  return new Promise(async function (resolve,reject) {
    let header = {
      'Content-Type':'multipart/form-data'
    }
    if(token){
      if(expires - Date.now() <= 0){
        // token 过期
        refreshToken().then().catch((error) => {
          reject(error)
        })
      }
      // header = Object.assign(header ,{ 'Authorization': "Bearer " + getToken() })
    }
    wx.uploadFile({
      url,
      header,
      filePath,
      name :'file',
      timeout: 5000,
      success(res) { 
        let res_data = { }
        if(typeof res.data == 'string'){
          res_data = JSON.parse(res.data)
        }else{
          res_data = res.data
        }
        if(res_data.success){
          resolve(res_data);
        }else{
          reject({message :res_data.message})
        }
      },
      fail (err) {
        reject(err)
      }
    })
  })
}

module.exports = {
  request,
  uploadFile,
  wxLogin,
}