// pages/work/order/settings/update_phone/index.js
const { ProjectOrder } = require('@/api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    phone:null,
    loading :false,
    isError:false,
    oldPhone:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const phone = options.phone;
    const id = options.id;
    this.setData({ phone ,id ,oldPhone:phone })
  },
  handlePhoneInput (e) {
    this.setData({ phone :e.detail.value})
  },
  updatePhone(){
    this.setData({loading:true})
    let id = this.data.id;
    let phone = this.data.phone;
    ProjectOrder.updatePhone(id,phone).then((result) => {
      wx.setStorageSync("needRefresh", true);
      wx.navigateBack({ delta: 1 })
    }).catch(() => {
      this.setData({ isError:true })
    }).finally(() => {
      this.setData({loading:false})
    })
  },
})