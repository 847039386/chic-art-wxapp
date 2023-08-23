// pages/company/employees/index.js
const { Company } = require('@/api/index')
const { getImageUrl ,uniqueArray } = require('@/utils/util')
const { getUserInfo } = require('@/utils/auth')
const { setLocalEmployeeGroup ,getLocalEmployeeGroup } = require('@/utils/storage/company_employee')
Page({

  data: {
    isAllowOperation:false,
    loading:false,
    company:null,
    company_id:null,
    employeeDatas :[],    // 已经通过审核的员工
    formatEmployeeDatas : [], // 格式化通过审核员工数据
    auditEmployeeDatas:[],  //未通过审核的员工
    localEmployeeGroup:[],   // 本地组
    remoteEmployeeGroup:[],  // 远程组
    allEmployeeGroup:[], // 本地和远程的员工组审核通过的
  },

  onLoad(options) {
    this.setData({ company_id :options.id })
  },
  onShow(){
    this.getEmployees();
  },
  getEmployees(callback){
    const company_id = this.data.company_id;
    // 正式员工
    let employeeDatas = [];
    // 正在申请的员工
    let auditEmployeeDatas = [];
    // 组名称
    let remoteEmployeeGroup = []; // 远程组
    this.setData({ loading:true })
    Company.getEmployees(company_id).then((result) =>{
      let employeeList = result.data.list;
      let company = result.data.company;
      // 验证登陆的userid是否是创始人
      let userInfo = getUserInfo()
      let uid = userInfo.user_id
      if(company.user_id._id == uid){
        this.setData({isAllowOperation :true})
      }
      if(company.user_id){
        company.user_id.avatar = getImageUrl(company.user_id.avatar)
      }
      if(employeeList.length > 0){
        employeeList.map((element) => {
          if(element.user_id && element.user_id.avatar){
            element.user_id.avatar = getImageUrl(element.user_id.avatar)
          }
          if(element.identity_type == 0){
            // 0 是正在申请的人
            auditEmployeeDatas.push(element)
          } else {
            employeeDatas.push(element)
            // 只有通过审核的人才会调取他们的分组 这里获取数据库里的组
            remoteEmployeeGroup.push(element.group_name)
          }
          return element
        })
      }
      // 格式化数据
      this.getFormatemployeeDatas(remoteEmployeeGroup,employeeDatas)
      this.setData({auditEmployeeDatas ,remoteEmployeeGroup ,employeeDatas ,company})
    }).finally(() => {
      this.setData({ loading :false})
      if(callback){
        callback()
      }
    })
  },
  
  auditEmployee(e){
    let id = e.currentTarget.dataset.id
    let remoteEmployeeGroup = this.data.remoteEmployeeGroup //远程组
    wx.showLoading({mask:true})
    Company.auditEmployeeOk(id).then(() =>{
      let index = e.currentTarget.dataset.index
      let currentEmployee = this.data.auditEmployeeDatas[index]
      // 审核通过后在审核数组删除这条数据
      let auditEmployeeDatas = this.data.auditEmployeeDatas
      auditEmployeeDatas.splice(index,1)
      let employeeDatas = this.data.employeeDatas;
      employeeDatas.push(currentEmployee)
      this.getFormatemployeeDatas(remoteEmployeeGroup,employeeDatas)
      this.setData({ auditEmployeeDatas ,employeeDatas })
      // 已经通过的员工数组在添加一条信息
    }).finally(() => {
      wx.hideLoading()
    })
  },
  auditNotEmployee(e){
    let id = e.currentTarget.dataset.id
    wx.showLoading({mask:true})
    Company.removeEmployee(id).then(() =>{
      let index = e.currentTarget.dataset.index
      // 审核通过后在审核数组删除这条数据
      let auditEmployeeDatas = this.data.auditEmployeeDatas
      auditEmployeeDatas.splice(index,1)
      this.setData({ auditEmployeeDatas })
      // 已经通过的员工数组在添加一条信息
    }).finally(() => {
      wx.hideLoading()
    })
  },
  createGroup () {
    wx.showModal({
      title: '创建分组',
      placeholderText:'请输入组名称',
      editable:true,
      complete: (res) => {
        let content = res.content;
        if (res.confirm) {
          setLocalEmployeeGroup(content)
          let allEmployeeGroup = getLocalEmployeeGroup()
          let formatEmployeeDatas = this.data.formatEmployeeDatas;
          if(formatEmployeeDatas.length == allEmployeeGroup.length){
            wx.showModal({
              title: '错误',
              showCancel:false,
              content: '分组名称不能重复',
            })
          }else{
            formatEmployeeDatas.push({
              list:[],
              checked:false,
              group_name:content
            })
          }
          this.setData({formatEmployeeDatas ,allEmployeeGroup })
        }
      }
    })
  },
  toggleCell(event) {
    const index = event.currentTarget.dataset.index;
    const { formatEmployeeDatas } = this.data;
    if (formatEmployeeDatas[index].checked == true) {
      formatEmployeeDatas[index].checked = false
    } else {
      formatEmployeeDatas[index].checked = true
    }
    this.setData({ formatEmployeeDatas });
  },
  // 需要参数数据库中已经通过审核的员工
  getFormatemployeeDatas (remoteEmployeeGroup ,employeeDatas){
    let localEmployeeGroup = [];  // 本地组
    let allEmployeeGroup = []  //远程组和本地组
    // 去重分组
    localEmployeeGroup = getLocalEmployeeGroup()  //本地组
    remoteEmployeeGroup = uniqueArray(remoteEmployeeGroup); // 远程组
    allEmployeeGroup = uniqueArray(remoteEmployeeGroup.concat(localEmployeeGroup)) // 合并两组
    // 重新排序默认分组，把他分到第一位
    allEmployeeGroup.forEach((element,index) =>{
      if(element == '默认分组'){
        // 如果有默认分组删除他，然后排在第一位
        allEmployeeGroup.splice(index,1)
      }
    })
    allEmployeeGroup.unshift('默认分组')
    setLocalEmployeeGroup(allEmployeeGroup) // 将获取的组全部放在缓存中
    // 给远程员工分组,并给他们默认值
    let newEmployeeDatas = []
    allEmployeeGroup.forEach((element,index)=>{
      newEmployeeDatas.push({
        list:[],
        checked:element == '默认分组' ? true :false,
        group_name :element,
      })
    })
    for (let index = 0; index < employeeDatas.length; index++) {
      const employee = employeeDatas[index];
      for (let jndex = 0; jndex < newEmployeeDatas.length; jndex++) {
        const group = newEmployeeDatas[jndex];
        const group_name = group.group_name
        if(employee.group_name == group_name){
          let list = group.list;
          list.push(employee)
          newEmployeeDatas[jndex].list = list;
          break
        }
      }
    }
    this.setData({formatEmployeeDatas :newEmployeeDatas ,allEmployeeGroup})
  },
  removeGroup(event){
    let that = this;
    let company_id = this.data.company_id
    let value = event.detail.value;
    let group_name = this.data.allEmployeeGroup[value]
    let formatEmployeeDatas = this.data.formatEmployeeDatas
    let localEmployeeGroup = getLocalEmployeeGroup() 
    if(value == 0){
      wx.showToast({
        icon:'error',
        title: '不可删除',
      })
    } else {
      if(formatEmployeeDatas[value].list.length > 0){
        wx.showModal({
          title: '提醒',
          content: '删除分组后数据将保存到默认分组',
          complete: (res) => {
            if (res.confirm) {
              wx.showLoading({mask:true})
              Company.updateAllEmployeeGroupName(company_id,group_name).then(()=>{
                localEmployeeGroup.splice(value,1)
                // 下标0肯定是默认分组，为了防止多次调用API，所以将移除的分组数据放在默认分组里
                formatEmployeeDatas[0].list = formatEmployeeDatas[0].list.concat(formatEmployeeDatas[value].list)
                formatEmployeeDatas.splice(value,1)
                setLocalEmployeeGroup(localEmployeeGroup)
                that.setData({ formatEmployeeDatas ,allEmployeeGroup:getLocalEmployeeGroup() })
              }).finally(() => {
                wx.hideLoading()
              })
            }
          }
        })
      }else{
        // 如果没有的话证明本地存储那么删除本地存储
        localEmployeeGroup.splice(value,1)
        formatEmployeeDatas.splice(value,1)
        setLocalEmployeeGroup(localEmployeeGroup)
        that.setData({ formatEmployeeDatas ,allEmployeeGroup:getLocalEmployeeGroup()})
      }
    }
  },
  toEmployeeSettingsPage(event){
    let isAllowOperation = this.data.isAllowOperation
    if(isAllowOperation){
      const id = event.currentTarget.dataset.id;
      const group_name = event.currentTarget.dataset.group_name;
      const identity_type = event.currentTarget.dataset.identity_type
      const remark = event.currentTarget.dataset.remark
      wx.navigateTo({
        url: `/pages/work/company/employees/settings/info/index?id=${id}&group_name=${group_name}&identity_type=${identity_type}&remark=${remark}`,
      })
    }
  },
  onPullDownRefresh(){
    this.getEmployees(() =>{
      wx.stopPullDownRefresh();
    });
  },

})