// pages/user/update_info/index.js
const { getUserInfo } = require('../../../utils/auth') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name :null,
    phone:null
  },

  onShow(){
    let info = getUserInfo();
    this.setData({ name : info.name ,phone :info.phone , nickname :info.nickname })
  },

  toUserUpdateNamePage(){
    wx.navigateTo({
      url: '/pages/user/update_name/index',
    })
  },
  toUserUpdateNickNamePage(){
    wx.navigateTo({
      url: '/pages/user/update_nickname/index',
    })
  },
  toUserUpdatePhonePage(){
    wx.navigateTo({
      url: '/pages/user/update_phone/index',
    })
  },

  logout(){
    wx.showModal({
      title: '提示',
      content: '是否退出登陆？',
      complete: (res) => {
        if (res.confirm) {
          wx.removeStorage({
            key: 'accessToken',
            success (res) {
              wx.navigateTo({
                url: '/pages/login/index',
              })
            }
          })
        }
      }
    })
    
  }

  

  

})