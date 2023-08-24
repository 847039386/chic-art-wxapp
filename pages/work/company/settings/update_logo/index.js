// pages/work/company/settings/update_logo/index.js
const { getUserInfo ,setUserInfo } = require('@/utils/auth') 
const { getImageUrl } = require('@/utils/util')
const {  Company ,File } = require('@/api/index'); 

Page({

  data: {
    company_id :null,
    logo :null,
    isError :false
  },

  onLoad(options) {
    const logo = options.logo;
    const company_id = options.id;
    this.setData({ logo ,company_id })
  },
  selectedImage(){
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType:['image'],
      sizeType: ['compressed'],//压缩
      sourceType: [ 'album'],//支持选取图片
      success (res) {
        const imgUrl = res.tempFiles[0].tempFilePath;
        that.updateLogo(imgUrl)
      }
    })
  },
  updateLogo(imgUrl){
    const that = this;
    const company_id = this.data.company_id;
    let logoLocalPath = ''
    wx.showLoading({ mask: true })
    File.uploadCompanyLogo(imgUrl).then((res) => {
      logoLocalPath = res.data.url;
      return Company.updateLogo(company_id,logoLocalPath)
    }).then(() => {
      wx.setStorageSync("needRefresh", true);
      that.setData({ isError:false , logo :getImageUrl(logoLocalPath) })
      wx.showToast()
    }).catch(()=>{
      this.setData({ isError :true })
    }).finally(() => {
      wx.hideLoading()
    })
  },
  // 卸载页面时为上一页面赋值
  onUnload(){
    let that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    if(prevPage.data.companyData && prevPage.data.companyData.name && !that.data.isError ){
      let newCompanyData = Object.assign(prevPage.data.companyData,{ logo :that.data.logo })
      prevPage.setData({ companyData :newCompanyData })
    }
  }
})