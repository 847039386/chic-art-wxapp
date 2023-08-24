// pages/work/company/settings/update_description/index.js
const { Company } = require('@/api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    description:null,
    loading :false,
    isError :false,
    isUpdate :false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    const company_id = options.id;
    const description  = options.description
    this.setData({ description ,company_id })
  },
  handleDescriptionInput (e) {
    this.setData({ description :e.detail.value})
  },
  updateDescription(){
    this.setData({loading:true})
    let description = this.data.description
    let company_id = this.data.company_id;
    Company.updateDescription(company_id,description).then((result) => {
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
    if(prevPage.data.companyData && prevPage.data.companyData.description && !that.data.isError && that.data.isUpdate){
      let newCompanyData = Object.assign(prevPage.data.companyData,{ description :that.data.description })
      prevPage.setData({ companyData :newCompanyData })
    }
  }
})