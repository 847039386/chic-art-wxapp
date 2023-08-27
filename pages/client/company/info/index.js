// pages/client/company/info/index.js
const { Company } = require('@/api/index')
const { getUserInfo } = require('@/utils/auth')
const { getImageUrl } = require('@/utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    companyData: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({company_id:options.id})
    this.getCompanyInfo(options.id)
  },

  // 获取公司信息
  getCompanyInfo(id){
    this.setData({loading :true})
    Company.getInfo(id).then(async (result) => {
      let data = result.data;
      data.logo = getImageUrl(data.logo)
      this.setData({ companyData :data , })
    }).finally(()=>{
      this.setData({loading :false})
    })
  },

})