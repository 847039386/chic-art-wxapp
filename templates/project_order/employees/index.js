// templates/project_order/employees/index.js
const { ProjectOrder } = require('../../../api/index')
const { getImageUrl } = require('../../../utils/util')
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
      console.log('employess')
      this.getEmployees(id)
      this.setData({id})
    }
  },
  data: {
    id:null,
    loading:false,
    employeeList:[]
  },
  methods: {
    getEmployees(id){
      this.setData({loading :true})
      ProjectOrder.getEmployees(id).then((result) => {
        let data = result.data;
        let a_Datas = [];   // 存放订单负责人
        let e_Datas = [];   // 存放订单员工
        result.data.forEach(element => {
          let avatar = '';
          if(element.user_id && element.user_id.avatar){
            avatar = getImageUrl(element.user_id.avatar);
          }
          if(element.company_employee_id){
            e_Datas.push(Object.assign(element.user_id,{ avatar ,ce_remark :element.company_employee_id.remark }))
          }else{
            a_Datas.push(Object.assign(element.user_id,{ avatar ,ce_remark :'项目负责人' }))
          }
        });
        let newDatas = a_Datas.concat(e_Datas)  // 创始人始终在前
        this.setData({employeeList:newDatas})
      }).finally(() => {
        this.setData({loading:false})
      })
    }
  }
})
