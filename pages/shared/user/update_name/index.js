// pages/user/update_name/index.js
const { getUserInfo ,setUserInfo } = require('@/utils/auth')
const { User } = require('@/api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:null,
    loading :false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const info = getUserInfo();
    this.setData({ name : info.name })
  },
  handleUserNameInput (e) {
    this.setData({ name :e.detail.value})
  },
  updateUserName(){
    this.setData({loading:true})
    let name = this.data.name
    User.updateUserName(name).then((result) => {
      let userInfo = getUserInfo()
      userInfo = Object.assign(userInfo,{name :name})
      setUserInfo(userInfo)
      this.setData({loading:false})
      wx.navigateBack({ delta: 1 })
    }).finally(() => {
      this.setData({loading:false})
    })
  }

})