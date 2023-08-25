// pages/work/order/settings/update_customer/index.js
const { ProjectOrder } = require('@/api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    customer:null,
    loading :false,
    isError:false,
    oldCustomer:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const customer = options.customer;
    const id = options.id;
    this.setData({ customer ,id ,oldCustomer:customer })
  },
  handleCustomerInput (e) {
    this.setData({ customer :e.detail.value})
  },
  updateCustomer(){
    this.setData({loading:true})
    let id = this.data.id;
    let customer = this.data.customer;
    ProjectOrder.updateCustomer(id,customer).then((result) => {
      wx.setStorageSync("needRefresh", true);
      wx.navigateBack({ delta: 1 })
    }).catch(() => {
      this.setData({ isError:true })
    }).finally(() => {
      this.setData({loading:false})
    })
  },
})