// pages/company/employees/index.js
const { Company } = require('../../../api/index')
const { getImageUrl ,uniqueArray } = require('../../../utils/util')
const { setLocalEmployeeGroup ,getLocalEmployeeGroup } = require('../../../utils/storage/company_employee')
Page({

  data: {
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
    this.getEmployees();
  },

  getEmployees (){
    const company_id = this.data.company_id;
    // 正式员工
    let employeeDatas = [];
    // 正在申请的员工
    let auditEmployeeDatas = [];
    // 组名称
    let remoteEmployeeGroup = []; // 远程组
    wx.showLoading({title: '加载中'})
    Company.getEmployees(company_id).then((result) =>{
      if(result.data.length > 0){
        result.data.map((element) => {
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
      this.formatemployeeDatas(remoteEmployeeGroup,employeeDatas)
      this.setData({auditEmployeeDatas ,remoteEmployeeGroup ,employeeDatas})
    }).finally(() => {
      wx.hideLoading()
    })
  },

  auditEmployee(e){
    let id = e.currentTarget.dataset.id
    let remoteEmployeeGroup = this.data.remoteEmployeeGroup //远程组
    wx.showLoading({title:'加载中',mask:true})
    Company.auditEmployeeOk(id).then(() =>{
      let index = e.currentTarget.dataset.index
      let currentEmployee = this.data.auditEmployeeDatas[index]
      // 审核通过后在审核数组删除这条数据
      let auditEmployeeDatas = this.data.auditEmployeeDatas
      auditEmployeeDatas.splice(index,1)
      let employeeDatas = this.data.employeeDatas;
      employeeDatas.push(currentEmployee)
      this.formatemployeeDatas(remoteEmployeeGroup,employeeDatas)
      this.setData({ auditEmployeeDatas ,employeeDatas })
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
          let formatEmployeeDatas = this.data.formatEmployeeDatas;
          formatEmployeeDatas.push({
            list:[],
            checked:false,
            group_name:content
          })
          this.setData({formatEmployeeDatas ,allEmployeeGroup:getLocalEmployeeGroup()})
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
  formatemployeeDatas (remoteEmployeeGroup ,employeeDatas){
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

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  // 转移到组
  
  onMoveGroupOk(event){
    let that = this;
    let id = event.currentTarget.dataset.id
    let value = event.detail.value;
    let group_name = this.data.allEmployeeGroup[value]
    Company.updateEmployeeGroupName(id,group_name).then(() => {
      that.getEmployees();
    })
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
              wx.showLoading({title:'加载中',mask:true})
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


  }
  

})