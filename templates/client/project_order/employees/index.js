// templates/client/project_order/employees/index.js
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
  },
  lifetimes : {
    ready:function(){
      const id = this.properties.aid;
      this.setData({ id })
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
    loading:false,
    // 新的
    projectOrderEmployees:[],  //订单员工
  },
  methods: {
    _init(){
      const id = this.data.id;
      this.setData({ loading :true , projectOrderEmployees :[] })
      ProjectOrder.getEmployees(id).then((result) => {
        let newList = []
        if(result.data.length > 0 ){
          result.data.forEach(element => {
            if(element.visible_state == 0){
              if(element.user_id && element.user_id.avatar){
                element.user_id.avatar = getImageUrl(element.user_id.avatar)
              }
              newList.push(element)
            }
          })
        }
        this.setData({projectOrderEmployees :newList }) 
        console.log(newList)
      }).finally(() => {
        this.setData({ loading :false })
      })
    },
  }
})

