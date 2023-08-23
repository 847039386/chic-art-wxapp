// pages/order/settings/update_address/index.js
const { ProjectOrder } = require('@/api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    address:null,
    loading :false,
    isError:false,
    oldAddress:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const address = options.address;
    const id = options.id;
    this.setData({ address ,id ,oldAddress:address })
  },
  handleAddressInput (e) {
    this.setData({ address :e.detail.value})
  },
  openMap (){
    wx.chooseLocation({
      success:(res) => {
        this.setData({ address :res.address })
      }
    })
  },
  updateAddress(){
    this.setData({loading:true})
    let id = this.data.id;
    let address = this.data.address;
    ProjectOrder.updateAddress(id,address).then((result) => {
      wx.setStorageSync("needRefresh", true);
      wx.navigateBack({ delta: 1 })
    }).catch(() => {
      this.setData({ isError:true })
    }).finally(() => {
      this.setData({loading:false})
    })
  },
})