// pages/work/company/settings/update_address/index.js
const { Company } = require('@/api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:null,
    loading :false,
    isError :false,
    isUpdate :false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const company_id = options.id;
    const address  = options.address
    this.setData({ address ,company_id })
  },
  handleAddressInput (e) {
    this.setData({ address :e.detail.value})
  },
  updateAddress(){
    this.setData({loading:true})
    let address = this.data.address
    let company_id = this.data.company_id;
    Company.updateAddress(company_id,address).then((result) => {
      wx.setStorageSync("needRefresh", true);
      this.setData({loading:false ,isError:false ,isUpdate :true})
      wx.navigateBack({ delta: 1 })
    }).catch(() => {
      this.setData({isError :true})
    }).finally(() => {
      this.setData({loading:false})
    })
  },
  openMap (){
    wx.chooseLocation({
      success:(res) => {
        this.setData({ address :res.address })
      }
    })
  },
  // 卸载页面时为上一页面赋值
  onUnload(){
    let that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    if(prevPage.data.companyData && prevPage.data.companyData.address && !that.data.isError && that.data.isUpdate){
      let newCompanyData = Object.assign(prevPage.data.companyData,{ address :that.data.address })
      prevPage.setData({ companyData :newCompanyData })
    }
  }
})