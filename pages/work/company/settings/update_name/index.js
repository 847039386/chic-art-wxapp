// pages/work/company/settings/update_name/index.js
const { Company } = require('@/api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:null,
    loading :false,
    isError :false,
    isUpdate :false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const company_id = options.id;
    const name  = options.name
    this.setData({ name ,company_id })
  },
  handleNameInput (e) {
    this.setData({ name :e.detail.value})
  },
  updateName(){
    this.setData({loading:true})
    let name = this.data.name
    let company_id = this.data.company_id;
    Company.updateName(company_id,name).then((result) => {
      wx.setStorageSync("needRefresh", true);
      this.setData({loading:false ,isError:false ,isUpdate :true})
      wx.navigateBack({ delta: 1 })
    }).catch(() => {
      this.setData({isError :true})
    }).finally(() => {
      this.setData({loading:false})
    })
  },
  // 卸载页面时为上一页面赋值
  onUnload(){
    let that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    if(prevPage.data.companyData && prevPage.data.companyData.name && !that.data.isError && that.data.isUpdate){
      let newCompanyData = Object.assign(prevPage.data.companyData,{ name :that.data.name })
      prevPage.setData({ companyData :newCompanyData })
    }
  }
})