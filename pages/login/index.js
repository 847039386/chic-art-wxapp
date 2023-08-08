// pages/login/index.js
const { User } = require('../../api/index')
const { wxLogin } = require('../../utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginLoading :false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onLogin () {
    this.setData({loginLoading :true})
    wxLogin().then(()=>{
      this.setData({loginLoading :false})
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }).catch((error) =>{
      this.setData({loginLoading :false})
      wx.showToast({
        title: '失败',
        icon: 'error',
        duration: 2000
      })
    })
  }

})