// pages/company/info/index.js
const { Company } = require('../../../api/index')
const { getImageUrl } = require('../../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    loading:false,
    company: null,
    iconOtherList: [{icon: 'location', color: 'blue',badge: 0,name: '创建订单' ,bindtap:"toCompanyOrderPage"}, 
    {icon: 'service',color: 'blue',badge: 0,name: '申请监控',bindtap: "bindZan"}, 
    {icon: 'mark',color: 'blue', badge: 0,name: '员工管理',bindtap: "toCompanyEmployeesPage"}, 
    {icon: 'mail',color: 'blue',badge: 0,name: '投诉',bindtap: "bindCollect"}, 
    {icon: 'settings',color: 'blue',badge: 0,name: '设置',bindtap: "toCompanySettingsPage"}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({id:options.id})
    this.getCompanyInfo(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  // 获取公司信息
  getCompanyInfo(id){
    this.setData({loading :true})
    Company.getInfo(id).then((result) => {
      let data = result.data;
      data.logo = getImageUrl(data.logo)
      this.setData({ company :data ,loading :false})
    }).catch(()=>{
      this.setData({loading :false})
    })
  },
  // 去往员工管理页面
  toCompanyEmployeesPage(){
    let id = this.data.id
    wx.navigateTo({
      url: `/pages/company/employees/index?id=${id}`,
    })
  },
  // 去往公司设置页面
  toCompanySettingsPage(){
    let id = this.data.id
    wx.navigateTo({
      url: `/pages/company/settings/index?id=${id}`,
    })
  },
  // 去往公司设置页面
  toCompanyOrderPage(){
    let id = this.data.id
    wx.navigateTo({
      url: `/pages/order/create/index?id=${id}`,
    })
  },

})