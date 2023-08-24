// pages/company/settings/index.js
const { Company } = require('@/api/index')
const { getImageUrl } = require('@/utils/util')
Page({

  data: {
    company_id :null,
    companyData:null
  },

  onLoad(options) {
    const company_id = options.id;
    this.setData({company_id})
    this.getCompanyInfo()
  },
  getCompanyInfo(){
    const company_id = this.data.company_id;
    this.setData({loading :true})
    Company.getInfo(company_id).then(async (result) => {
      let companyData = result.data;
      companyData.logo = getImageUrl(companyData.logo)
      console.log(companyData)
      this.setData({ companyData })
    }).finally(()=>{
      this.setData({loading :false})
    })
  },
  toUpdateLogoPage(){
    const company_id = this.data.company_id
    const logo = this.data.companyData.logo
    wx.navigateTo({
      url: `/pages/work/company/settings/update_logo/index?id=${company_id}&logo=${logo}`,
    })
  },
  toUpdateNamePage(){
    const company_id = this.data.company_id
    const name = this.data.companyData.name
    wx.navigateTo({
      url: `/pages/work/company/settings/update_name/index?id=${company_id}&name=${name}`,
    })
  },
  toUpdateDescriptionPage(){
    const company_id = this.data.company_id
    const description = this.data.companyData.description
    wx.navigateTo({
      url: `/pages/work/company/settings/update_description/index?id=${company_id}&description=${description}`,
    })
  },
  toUpdateTagPage(){
    const company_id = this.data.company_id
    wx.navigateTo({
      url: `/pages/work/company/settings/update_tag/index?id=${company_id}`,
    })
  },
  toUpdateAddressPage(){
    const company_id = this.data.company_id
    const address = this.data.companyData.address
    wx.navigateTo({
      url: `/pages/work/company/settings/update_address/index?id=${company_id}&address=${address}`,
    })
  },
  // 卸载页面时为上一页面赋值
  onUnload(){
    let that = this;
    let needRefresh = wx.getStorageSync("needRefresh")
    if(needRefresh){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      const companyData = this.data.companyData
      prevPage.setData({ companyData })
    }

  }

  

})