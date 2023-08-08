// pages/company/info/index.js
const { Company } = require('../../../api/index')
const { getImageUrl } = require('../../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_id:null,    //公司ID
    company_name :null, //公司名称
    company_logo:null,  //公司LOGO
    loading:false,
    company: null,
    iconOtherList: [{icon: 'location', color: 'blue',badge: 0,name: '创建订单' ,bindtap:"toCompanyOrderPage"}, 
    {icon: 'service',color: 'blue',badge: 0,name: '申请监控',bindtap: "bindZan"}, 
    {icon: 'mark',color: 'blue', badge: 0,name: '员工管理',bindtap: "toCompanyEmployeesPage"}, 
    {icon: 'qrcode',color: 'blue',badge: 0,name: '二维码',bindtap: "toCompanyEmployeesQrcodePage"}, 
    {icon: 'settings',color: 'blue',badge: 0,name: '设置',bindtap: "toCompanySettingsPage"}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({company_id:options.id})
    this.getCompanyInfo(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  // 获取公司信息
  getCompanyInfo(id){
    this.setData({loading :true})
    Company.getInfo(id).then((result) => {
      let data = result.data;
      data.logo = getImageUrl(data.logo)
      this.setData({ company :data ,loading :false ,company_name :data.name ,company_logo:data.logo})
    }).catch(()=>{
      this.setData({loading :false})
    })
  },
  // 去往员工管理页面
  toCompanyEmployeesPage(){
    let company_id = this.data.company_id
    wx.navigateTo({
      url: `/pages/company/employees/index?id=${company_id}`,
    })
  },
  // 去往公司设置页面
  toCompanySettingsPage(){
    let company_id = this.data.company_id
    wx.navigateTo({
      url: `/pages/company/settings/index?id=${company_id}`,
    })
  },
  // 去往公司设置页面
  toCompanyOrderPage(){
    let company_id = this.data.company_id
    wx.navigateTo({
      url: `/pages/order/create/index?id=${company_id}`,
    })
  },
  // 去往员工添加二维码
  toCompanyEmployeesQrcodePage(){
    let company_id = this.data.company_id
    let company_name = this.data.company_name
    let company_logo = this.data.company_logo
    let url = `/pages/qrcode/company_employee/index?id=${company_id}&company_name=${company_name}`;
    if(company_logo){
      url = url + `&company_logo=${company_logo}`
    }
    wx.navigateTo({url})
  }

})