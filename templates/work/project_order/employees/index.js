// templates/project_order/employees/index.js
const { ProjectOrder ,Company } = require('@/api/index')
const { getUserInfo } = require('@/utils/auth')
const { getImageUrl ,uniqueArray } = require('@/utils/util')
const app = getApp();

Component({
  options: {
    addGlobalClass: true
  },
  properties:{
    aid :String,
    cid :String,
    isAdm :Boolean
  },
  lifetimes : {
    ready:function(){
      const id = this.properties.aid;
      const company_id = this.properties.cid;
      this.setData({ id ,company_id })
      this._init();
    }
  },
  pageLifetimes:{
    show(){
      this._init();
    }
  },
  data: {
    CustomBar: app.globalData.CustomBar,
    id:null,
    company_id :null,
    loading:false,
    employeeModal :false,
    // 新的
    projectOrderEmployees:[],  //订单员工
    companyEmployees :[]  // 可分配的公司员工
  },
  methods: {
    formatProjcetOrderEmployees(datas){
      let a_Datas = [];   // 存放订单负责人
      let e_Datas = [];   // 存放订单员工
      datas.forEach(element => {
        let avatar = '';
        if(element.user_id && element.user_id.avatar){
          avatar = getImageUrl(element.user_id.avatar);
        }
        if(element.company_employee_id){
          element.user_id = Object.assign(element.user_id,{ avatar })
          element.ce_remark = element.company_employee_id.remark;
          e_Datas.push(element)
        }else{
          element.user_id = Object.assign(element.user_id,{ avatar })
          element.ce_remark = '项目负责人';
          a_Datas.push(element)
        }
      });
      let newDatas = a_Datas.concat(e_Datas)  // 创始人始终在前
      return newDatas;
    },
    openEmployeeModal(){
      this.setData({employeeModal : true})
    },
    closeEmployeeModal(){
      this.setData({employeeModal : false})
    },
    addEmployee(event){
      const user_id = event.currentTarget.dataset.user_id;
      const company_employee_id = event.currentTarget.dataset.id;
      const project_order_id = this.data.id
      wx.showModal({
        title: '提示',
        content: '是否添加员工到该订单',
        complete: (res) => {
          if (res.confirm) {
            wx.showLoading({mask:true})
            ProjectOrder.addEmployee(user_id ,project_order_id,company_employee_id).then(() => {
              this._init();
            }).finally(() => {
              wx.hideLoading()
            })
          }
        }
      })
    },
    _init(){
      const id = this.data.id;
      const company_id = this.data.company_id;
      this.setData({ loading :true , projectOrderEmployees :[] ,companyEmployees:[]})
      // 需同步进行计算结果
      Promise.all([
        ProjectOrder.getEmployees(id),
        Company.getEmployees(company_id)
      ]).then((value) => {
        let projectOrderEmployees = value[0].data;
        let companyEmployees = value[1].data.list;
        const newEmployeeDatas = this.getOptionalEmployeeList(projectOrderEmployees,companyEmployees);
        const newProjectOrderEmployees = this.formatProjcetOrderEmployees(projectOrderEmployees)
        this.setData({companyEmployees :newEmployeeDatas ,projectOrderEmployees :newProjectOrderEmployees })  
      }).catch((err) => {
        console.log('报错',err)
      }).finally(() => {
        this.setData({ loading :false })
      })
    },
    // 将订单员工和公司员工进行去重，获取到可添加列表，即添加后员工不显示
    getOptionalEmployeeList(projectOrderEmployees ,companyEmployees){
      let newList = []
      if(companyEmployees.length > 0){
        // 去除掉所有审核未通过的员工
        companyEmployees = companyEmployees.filter((item) => {
          return item.audit_state == 1;
        })
        // 去重已经在订单内的员工
        for (let index = 0; index < companyEmployees.length; index++) {
          let isExist = false;
          const item = companyEmployees[index]
          for (let jndex = 0; jndex < projectOrderEmployees.length; jndex++) {
            const element = projectOrderEmployees[jndex];
            if(item.user_id._id == element.user_id._id){
              isExist = true;
              break
            }
          }
          if(!isExist){
            if(item.user_id){
              item.user_id.avatar = getImageUrl(item.user_id.avatar)
            }
            newList.push(item)
          }
        }
        return this.formatGroup(newList)
      }else{
        return { total : 0, rows:[] }
      }
    },
    // 格式化分组更清晰展示列表
    formatGroup(arr){
      const total = arr.length;
      let groups = [];
      let rows = [];
      if(total > 0){
        arr.forEach((item) => {
          groups.push(item.group_name)
        })
        // 将组去重获得新组 此组不重复作为列表使用
        groups = uniqueArray(groups);
        // 给组初始化数据
        groups.forEach((element,index)=>{
          rows.push({
            list:[],
            checked:true,
            group_name :element
          })
        })
        // 为生成好的组重新赋值
        for (let index = 0; index < arr.length; index++) {
          const employee = arr[index];
          for (let jndex = 0; jndex < rows.length; jndex++) {
            const group = rows[jndex];
            const group_name = group.group_name
            if(employee.group_name == group_name){
              let list = group.list;
              list.push(Object.assign(employee,{ checked :false }))
              rows[jndex].list = list;
              break
            }
          }
        }

      }
      const result = { total , rows }
      return result
    },
    openGroup (event) {
      const index = event.currentTarget.dataset.index;
      let companyEmployees = this.data.companyEmployees;
      companyEmployees.rows[index].checked = !companyEmployees.rows[index].checked
      this.setData({ companyEmployees })
    },
    removeProjectOrderEmployee(event){
      wx.showModal({
        title: '提示',
        content: '删除后，该员工将访问不到该订单是否继续？',
        complete: (res) => {
          if (res.confirm) {
            const id = event.currentTarget.dataset.id;
            ProjectOrder.removeEmployee(id).then(() => {
              wx.showToast()
            }).finally(() => {
              this._init();
            })
          }
        }
      })
    },
    toEmployeeManage(event){
      const isAdm = this.properties.isAdm;
      if(isAdm){
        const info = event.currentTarget.dataset.info;
        const visible_state = info.visible_state;
        const user_id = info.user_id._id
        const id = info._id;
        wx.navigateTo({
          url: `/pages/work/order/employee/update_info/index?id=${id}&user_id=${user_id}&visible_state=${visible_state}`,
        })
      }
    },
    
  }
})
