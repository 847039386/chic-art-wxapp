// pages/user/update_phone/index.js
const { getUserInfo ,setUserInfo } = require('../../../utils/auth')
const { User } = require('../../../api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:null,
    loading :false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const info = getUserInfo();
    this.setData({ phone : info.phone })
  },
  handleUserPhoneInput (e) {
    this.setData({ phone :e.detail.value})
  },
  updateUserPhone(){
    this.setData({loading:true})
    let phone = this.data.phone
    User.updateUserPhone(phone).then((result) => {
      let userInfo = getUserInfo()
      userInfo = Object.assign(userInfo,{phone})
      setUserInfo(userInfo)
      this.setData({loading:false})
      wx.navigateBack({ delta: 1 })
    }).finally(() => {
      this.setData({loading:false})
    })
  }
})