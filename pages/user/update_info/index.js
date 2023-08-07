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
    this.setData({ name : info.name ,phone :info.phone  })
  },

  toUserUpdateNamePage(){
    wx.navigateTo({
      url: '/pages/user/update_name/index',
    })
  },
  toUserUpdatePhonePage(){
    wx.navigateTo({
      url: '/pages/user/update_phone/index',
    })
  }

  

  

})