// pages/company/info/index.js
const { Company } = require('@/api/index')
const { getUserInfo } = require('@/utils/auth')
const { getImageUrl } = require('@/utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remark :'普通员工',
    company_id:null,    //公司ID
    company_name :null, //公司名称
    company_logo:null,  //公司LOGO
    loading:false,
    company: null,
    isCSR :false,  //是否是公司创始人
    isADM :false,  //是否是公司管理员
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
    const user_id = getUserInfo().user_id;
    this.setData({loading :true})
    Company.getInfo(id).then(async (result) => {
      let data = result.data;
      data.logo = getImageUrl(data.logo)
      if(user_id == data.user_id._id){
        // 如果登陆的用户是创世人的话允许操作
        this.setData({isCSR : true , remark :'创始人'})
      }else{
        // 否则去库里看看这个用户是否为管理员
        // 为了保证页面不闪 所以这边用同步方法
        try {
          const inResult = await Company.getUtoCInfo(id);
          let utc = inResult.data
          let identity_type = utc.identity_type;
          if(utc){
            this.setData({remark :utc.remark })
          }
          // 2就是管理员
          if(identity_type == 2){
            this.setData({isADM : true })
          }
        } catch (error) {}
      }
      this.setData({ company :data ,company_name :data.name ,company_logo:data.logo})
    }).finally(()=>{
      this.setData({loading :false})
    })
  },
  // 去往员工管理页面
  toCompanyEmployeesPage(){
    let company_id = this.data.company_id
    wx.navigateTo({
      url: `/pages/work/company/employees/list/index?id=${company_id}`,
    })
  },
  // 去往公司监控列表页面
  toCompanyCamerasPage(){
    let company_id = this.data.company_id
    wx.navigateTo({
      url: `/pages/work/company/camera/list/index?id=${company_id}`,
    })
  },
  // 去往公司设置页面
  toCompanySettingsPage(){
    let company_id = this.data.company_id
    wx.navigateTo({
      url: `/pages/work/company/settings/index?id=${company_id}`,
    })
  },
  // 去往公司设置页面
  toCompanyOrderPage(){
    let company_id = this.data.company_id
    wx.navigateTo({
      url: `/pages/work/order/create/index?id=${company_id}`,
    })
  },
  // 去往员工添加二维码
  toCompanyEmployeesQrcodePage(){
    let company_id = this.data.company_id
    let company_name = this.data.company_name
    let company_logo = this.data.company_logo
    let url = `/pages/shared/qrcode/company_employee/index?id=${company_id}&company_name=${company_name}`;
    if(company_logo){
      url = url + `&company_logo=${company_logo}`
    }
    wx.navigateTo({url})
  }

})