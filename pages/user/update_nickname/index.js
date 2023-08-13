// pages/user/update_nickname/index.js
const { getUserInfo ,setUserInfo } = require('../../../utils/auth')
const { User } = require('../../../api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:null,
    loading :false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const info = getUserInfo();
    this.setData({ nickname : info.nickname })
  },
  handleUserNameInput (e) {
    this.setData({ nickname :e.detail.value})
  },
  updateUserNickName(){
    this.setData({loading:true})
    let nickname = this.data.nickname
    User.updateUserNickName(nickname).then((result) => {
      let userInfo = getUserInfo()
      userInfo = Object.assign(userInfo,{nickname :nickname})
      setUserInfo(userInfo)
      this.setData({loading:false})
      wx.navigateBack({ delta: 1 })
    }).finally(() => {
      this.setData({loading:false})
    })
  }
})