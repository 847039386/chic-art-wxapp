// templates/project_order/settings/index.js
const { ProjectOrder ,Company } = require('@/api/index');
const { getImageUrl } = require('@/utils/util');
const { getUserInfo } = require('@/utils/auth')
const app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  properties:{
    aid :String
  },
  lifetimes : {
    ready:function(){
      const id = this.properties.aid;
      this.setData({id})
      this.getInfo(id);
    }
  },
  pageLifetimes:{
    show(){
      const id = this.data.id;
      this.getInfo(id);
    }
  },
  data: {
    CustomBar: app.globalData.CustomBar,
    loading:true,
    id : null,
    errMsg :null,
    delButtonLoading :false,
    isDel:false,
    projectOrder : { },
    // 转移项目所需要的
    employeeAdmsModal :false,
    companyEmployeeAdmsLoading:false,
    companyEmployeeAdms :[]   // 这里包含了所有公司员工并且是管理的
  },
  methods: {
    getInfo(id){
      this.setData({loading:true})
      ProjectOrder.getInfoById(id).then((result) => {
        this.setData({ projectOrder : result.data })
      }).catch((err) => {
        this.setData({ errMsg : err.message })
      }).finally(() => {
        this.setData({loading:false})
      })
    },
    toUpdateNamePage(){
      let name = this.data.projectOrder.name;
      let id = this.data.id;
      wx.navigateTo({
        url: `/pages/work/order/settings/update_name/index?id=${id}&name=${name}`,
      })
    },
    toUpdateCustomerPage(){
      let customer = this.data.projectOrder.customer;
      let id = this.data.id;
      wx.navigateTo({
        url: `/pages/work/order/settings/update_customer/index?id=${id}&customer=${customer}`,
      })
    },
    toUpdatePhonePage(){
      let phone = this.data.projectOrder.phone;
      let id = this.data.id;
      wx.navigateTo({
        url: `/pages/work/order/settings/update_phone/index?id=${id}&phone=${phone}`,
      })
    },
    toUpdateAddressPage(){
      let address = this.data.projectOrder.address;
      let id = this.data.id;
      wx.navigateTo({
        url: `/pages/work/order/settings/update_address/index?id=${id}&address=${address}`,
      })
    },
    removeOrder () {
      wx.showModal({
        title: '警告',
        content: '订单删除后将不可恢复，请谨慎操作',
        complete: (res) => {
          if (res.confirm) {
            const id = this.data.id;
            this.setData({ delButtonLoading :true })
            ProjectOrder.remove(id).then(() => {
              wx.navigateBack({ delta: 1 })
              // 因为删除了订单，但是上级页面是模板，所以用笨方法告诉上级页面要刷新页面了
              wx.setStorageSync("needRefresh", true);
              this.setData({ isDel :true })
            }).finally(() => {
              this.setData({ delButtonLoading :false })
            })
          }
        }
      })
    },
    updateUid(event){
      // 转移项目，
      const id = this.data.id;
      const user_id = event.currentTarget.dataset.user_id;
      let content = '转移项目无需对方同意，转移后您将退出该订单，是否继续？';
      wx.showModal({
        title: '提示',
        content,
        complete: (res) => {
          if (res.confirm) {
            wx.showLoading({mask:true})
            ProjectOrder.handOver(id,user_id).then(() => {
              wx.setStorageSync("needRefresh", true);
              wx.navigateBack({ delta: 1 })
            }).finally(() => {
              wx.hideLoading()
            })
          }
        }
      })
    },
    openEmployeeAdmsModal(){
      if(this.data.companyEmployeeAdms.length < 1){
        this.getEmployeeAdms();
      }
      this.setData({employeeAdmsModal : true})
    },
    closeEmployeeAdmsModal(){
      this.setData({employeeAdmsModal : false})
    },
    getEmployeeAdms(){
      const userinfo = getUserInfo()
      const projectOrder = this.data.projectOrder;
      const company_id = projectOrder.company_id._id;
      this.setData({companyEmployeeAdmsLoading:true ,companyEmployeeAdms:[]})
      Company.getEmployees(company_id).then((result) => {
        const data = result.data;
        let list = data.list;
        list = list.filter((item) => {
          item.user_id.avatar = getImageUrl(item.user_id.avatar)
          return item.identity_type > 0 && item.user_id._id != userinfo.user_id;
        })
        this.setData({companyEmployeeAdms :list})
      }).finally(() => {
        this.setData({ companyEmployeeAdmsLoading :false })
      })
    }
  }
})
