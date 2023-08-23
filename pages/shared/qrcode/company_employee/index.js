// pages/qrcode/company_employee/index.js
const drawQrcode = require('@/common/weapp_qrcode/weapp.qrcode.common')
const { getUserInfo } = require('@/utils/auth')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo:null
  },
  onLoad(options){
    let company_id = options.id
    let company_name = options.company_name
    let company_logo = options.company_logo
    this.setData({ company_id ,company_name ,company_logo : company_logo || '/images/nlogo.png'})
    const jsonData = {
      type:'EmployeeAddCompany',
      content :'员工进入公司',
      company_id
    }
    drawQrcode({
      width: 130,
      height: 130,
      canvasId: 'myQrcode',
      text: JSON.stringify(jsonData),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    
  },

  companyQrcodeOptions(){
    
  }

})