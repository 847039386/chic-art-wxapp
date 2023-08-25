// pages/order/create/index.js
const { ProgressTemplate ,Company ,ProjectOrder } = require('@/api/index')
const { getImageUrl ,uniqueArray } = require('@/utils/util')
const { getUserInfo } = require('@/utils/auth')
const { getMyProgressTemplate } =require('@/utils/storage/progress_template')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    loadingTemplates:false,
    loadingEmployees:false,
    createProjectOrderLoading:false,
    company_id:null,
    formData : {
      name:null,
      customer:null,
      address:null,
      phone:null,
    },
    employeeDatas:[], //员工列表
    employeeModal:false,  // 员工列表模态框
    currentSelectEmployees:[],  //当前
    officialProgressTemplate :[], // 官方模板
    progressTemplates:[{name:'默认模板',template:['开始','结束']}],   //进度模板
    currentProgressTemplatesName:'默认模板',
    currentProgressTemplates:['开始','结束'], //当前选中的模板
    // 用户选择自己的进度模板
    ProgressTemplateRadio:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const company_id = options.id;
    this.setData({company_id});
    this.getCompanyEmployees();
    this.getProgressTemplate();
  },
  openMap (){
    wx.chooseLocation({
      success:(res) => {
        this.setData({ 'formData.address' :res.address })
      }
    })
  },
  handleNameInput(e){
    this.setData({ 'formData.name' :e.detail.value })
  },
  handleAddressInput(e){
    this.setData({ 'formData.address' :e.detail.value })
  },
  handlePhoneInput(e){
    this.setData({ 'formData.phone' :e.detail.value })
  },
  handleCustomerInput(e){
    this.setData({ 'formData.customer' :e.detail.value })
  },
  bindPTPickerChange(event){
    let value = event.detail.value
    let name = this.data.progressTemplates[value].name;
    let template = this.data.progressTemplates[value].template;
    this.setData({currentProgressTemplates:template ,currentProgressTemplatesName:name})
  },
  getCompanyEmployees(){
    let company_id = this.data.company_id
    this.setData({loadingEmployees:true})
    Company.getEmployees(company_id).then((result) =>{
      let groups = []
      let employeeDatas = [];
      let employeeList = result.data.list;
      // 验证登陆的userid是否是创始人
      let userInfo = getUserInfo()
      let uid = userInfo.user_id  // 自己的ID
      if(employeeList.length > 0){
        employeeList.map((element) => {
          if(element.user_id && element.user_id.avatar){
            element.user_id.avatar = getImageUrl(element.user_id.avatar)
          }
          // identity_type > 0 是通过申请的员工
          if(element.identity_type > 0){
            // Uid是登陆者的ID，当前功能为创建订单那么订单绑定的人就是登陆者id，所以不应添加自己，因为本身自己就是存在的
            // 所以该代码过滤自己的ID
            if(uid != element.user_id._id){
              employeeDatas.push(element)
              groups.push(element.group_name)
            }
          } 
          return element
        })
        // 去重组
        groups = uniqueArray(groups)
        // 将默认分组放到第一位
        groups.forEach((element,index) =>{
          if(element == '默认分组'){
            // 如果有默认分组删除他，然后排在第一位
            groups.splice(index,1)
          }
        })
        groups.unshift('默认分组')
        // 初始化分组员工
        let newEmployeeDatas = []
        groups.forEach((element,index)=>{
          newEmployeeDatas.push({
            list:[],
            checked:true,
            group_name :element
          })
        })
        // 赋值分组员工
        for (let index = 0; index < employeeDatas.length; index++) {
          const employee = employeeDatas[index];
          for (let jndex = 0; jndex < newEmployeeDatas.length; jndex++) {
            const group = newEmployeeDatas[jndex];
            const group_name = group.group_name
            if(employee.group_name == group_name){
              let list = group.list;
              list.push(Object.assign(employee,{ checked :false }))
              newEmployeeDatas[jndex].list = list;
              break
            }
          }
        }
        this.setData({employeeDatas:newEmployeeDatas})
      }
      
    }).finally(() => {
      this.setData({loadingEmployees:false})
    })
  },
  getProgressTemplate(){
    this.setData({ loadingTemplates :true })
    ProgressTemplate.getList().then((res) => {
      let progressTemplates = res.data
      if(progressTemplates.length > 0){
        this.setData({ 
          officialProgressTemplate:progressTemplates, // 这个是官方模板传进来之后会保存不变
        })
      }else{
        this.setData({ 
          officialProgressTemplate:[{name:'默认模板',template:['开始','结束']}],
        })
      }
    }).catch(() => {
      this.setData({ 
        officialProgressTemplate:[{name:'默认模板',template:['开始','结束']}],
      })
    }).finally(() => {
      this.getDefalutTemplate();
      this.setData({ loadingTemplates :false })
    })
  },
  bindEmployeeChange(event){
    const group_index = event.currentTarget.dataset.group_index;
    const list_index = event.currentTarget.dataset.list_index;
    let employeeDatas = this.data.employeeDatas;
    let currentEmployee = employeeDatas[group_index].list[list_index];
    let currentSelectEmployees = []
    currentEmployee.checked = !currentEmployee.checked;
    for (let index = 0; index < employeeDatas.length; index++) {
      const employee = employeeDatas[index];
      for (let jndex = 0; jndex < employee.list.length; jndex++) {
        const element = employee.list[jndex];
        if(element.checked){
          currentSelectEmployees.push(element)
        }
      }
    }
    this.setData({ employeeDatas ,currentSelectEmployees })
    
  },
  openEmployeeModal(){
    this.setData({employeeModal : true})
  },
  closeEmployeeModal(){
    this.setData({employeeModal : false})
  },
  createOrder(){
    let company_id = this.data.company_id;
    let name = this.data.formData.name;
    let customer = this.data.formData.customer;
    let address = this.data.formData.address;
    let phone = this.data.formData.phone;
    let progress_template = this.data.currentProgressTemplates;
    let employee_ids = this.data.currentSelectEmployees.map((item) => {
      return {
        _id :item._id,
        user_id :item.user_id._id
      };
    })
    let err_msg = null
    let namePattern = /^[0-9A-Za-z\u4e00-\u9fa5\s]{1,16}$/;
    let customerPattern = /^[0-9A-Za-z\u4e00-\u9fa5\s]{1,16}$/;
    let phonePattern = /^\d{7,8}$|^1\d{10}$|^(0\d{2,3}-?|0\d2,3 )?[1-9]\d{4,7}(-\d{1,8})?$/;
    let addressPattern = /^.{1,120}$/;
    if(!name || !namePattern.test(name)){
      err_msg = '项目名称只允许数字英文或汉文还有空格1-16位'
    }
    if(!customer || !customerPattern.test(customer)){
      err_msg = '客户名称只允许数字英文或汉文还有空格1-16位'
    }
    if(!phonePattern.test(phone)){
      err_msg = '请输入正确的手机号码，可以是固定电话'
    }
    if(!address || !addressPattern.test(address)){
      err_msg = '地址的字符长度应在1-120个字符之间'
    } 
    if(err_msg){
      wx.showModal({
        title: '错误',
        content: err_msg,
        showCancel:false
      })
    }else{
      let data = {customer,address,phone ,employee_ids ,progress_template ,company_id ,name}
      this.setData({createProjectOrderLoading :true})
      ProjectOrder.add(data).then((result) => {
        wx.redirectTo({
          url: `/pages/shared/qrcode/user_add_project_order/index?id=${result.data._id}`,
        })
      }).finally(() => {
        this.setData({createProjectOrderLoading:false})
      })
    }
  },
  getDefalutTemplate(){
    let myProgressTemplate = getMyProgressTemplate();
    let officialProgressTemplate = this.data.officialProgressTemplate;
    let currentProgressTemplatesName = '';
    let currentProgressTemplates = [];
    let progressTemplates = [];
    if(myProgressTemplate.length > 0){
      currentProgressTemplatesName = myProgressTemplate[0].name;
      currentProgressTemplates = myProgressTemplate[0].template;
      progressTemplates = myProgressTemplate
      this.setData({
        ProgressTemplateRadio : [
          { value :'Customer' ,checked :true ,label :'我的模板' },  // 自定义
          { value :'Official' , checked:false ,label :'官方模板' } // 官方
        ],
      })
    } else {
      currentProgressTemplatesName = officialProgressTemplate[0].name;
      currentProgressTemplates = officialProgressTemplate[0].template;
      progressTemplates = officialProgressTemplate;
    }
    this.setData({ progressTemplates ,currentProgressTemplatesName ,currentProgressTemplates })
  },
  selectedTemplateType(event){
    const value = event.detail.value;
    let myProgressTemplate = getMyProgressTemplate();
    let officialProgressTemplate = this.data.officialProgressTemplate;
    let currentProgressTemplatesName = '';
    let currentProgressTemplates = [];
    let progressTemplates = [];
    if(value == 'Customer'){
      currentProgressTemplatesName = myProgressTemplate[0].name;
      currentProgressTemplates = myProgressTemplate[0].template;
      progressTemplates = myProgressTemplate
    }else{
      currentProgressTemplatesName = officialProgressTemplate[0].name;
      currentProgressTemplates = officialProgressTemplate[0].template;
      progressTemplates = officialProgressTemplate;
    }
    this.setData({ progressTemplates ,currentProgressTemplatesName ,currentProgressTemplates })
  },
  showTip(){
    wx.showModal({
      showCancel:false,
      content: '您可以在个人中心中管理自己的进度模板，当您创建了自定义模板，创建订单时才会显示自己的进度模板',
    })
  },
  openGroup (event) {
    const index = event.currentTarget.dataset.index;
    let employeeDatas = this.data.employeeDatas;
    employeeDatas[index].checked = !employeeDatas[index].checked
    this.setData({ employeeDatas })
  }
})