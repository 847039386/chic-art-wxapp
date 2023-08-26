// templates/client/project_order/customers/index.js
const { ProjectOrder } = require('@/api/index')
const { getImageUrl } = require('@/utils/util')
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
      this.getCustomers();
    }
  },
  pageLifetimes:{
    show(){
      this.getCustomers();
    }
  },
  data: {
    id:null,
    loading:false,
    customerList:[],   // 通过审核的客户
  },
  methods: {
    getCustomers(){
      const id = this.properties.aid;
      this.setData({loading :true})
      let customerList = [];
      ProjectOrder.getCustomers(id).then((result) => {
        result.data = result.data.filter((item) => {
          return item.state == 1;
        })
        // 遍历循环
        result.data.forEach(element => {
          let avatar = '';
          let user_id = {};
          let newData = {};
          // 转换图片真实地址
          if(element.user_id && element.user_id.avatar){
            avatar = getImageUrl(element.user_id.avatar);
          }
          // 赋值
          if(element && element.user_id){
            user_id = Object.assign(element.user_id,{ avatar })
            newData = Object.assign(element,{ user_id })
          }
          customerList.push(newData)
        });
        this.setData({customerList})
      }).finally(() => {
        this.setData({loading:false})
      })
    },
  }
})
