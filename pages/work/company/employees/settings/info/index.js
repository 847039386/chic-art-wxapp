// pages/company/employees/settings/index.js
const { Company } = require('@/api/index')
const { getImageUrl ,uniqueArray } = require('@/utils/util')
const { getLocalEmployeeGroup } = require('@/utils/storage/company_employee')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    upAdmLoading:false,
    switchAdminChecked:false,
    localEmployeeGroup:[],
    remark:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    let switchAdminChecked = false;
    let localEmployeeGroup = getLocalEmployeeGroup()
    let id = options.id
    let group_name = options.group_name;
    let identity_type = Number(options.identity_type)
    let remark = options.remark
    switchAdminChecked = identity_type == 2 ? true : false;
    // 获取该用户所在分组，去除掉用户本身分组
    localEmployeeGroup = localEmployeeGroup.filter(function(item) {
      return item !== group_name
    });
    this.setData({id ,localEmployeeGroup ,switchAdminChecked ,remark})
  },
  // 转移到组
  onMoveGroupOk(event){
    let id = this.data.id;
    let value = event.detail.value;
    let group_name = this.data.localEmployeeGroup[value]
    wx.showLoading({ title: '移动中'})
    Company.updateEmployeeGroupName(id,group_name).then(() => {
      wx.navigateBack({ delta: 1 })
    }).finally(()=>{
      wx.hideLoading()
    })
  },
  removeEmployee(){
    let id = this.data.id;
    wx.showLoading({ title: '删除中'})
    Company.removeEmployee(id).then(() => {
      wx.navigateBack({ delta: 1 })
    }).finally(()=>{
      wx.hideLoading()
    })
  },
  toUpdateremarkPage(){
    let id = this.data.id;
    let remark = this.data.remark;
    wx.navigateTo({
      url: `/pages/work/company/employees/settings/update_remark/index?id=${id}&remark=${remark}`,
    })
  },
  switchAdmin(event){
    let id = this.data.id;
    let value = event.detail.value
    let identity_type = 0
    this.setData({upAdmLoading :true})
    if(value){
      identity_type = 2;
    }else{
      identity_type = 1
    }
    Company.updateEmployeeIdentityType(id,identity_type).catch(() => {
      this.setData({switchAdminChecked : !value })
    }).finally(() =>{
      this.setData({upAdmLoading :false})
    })
  }
})