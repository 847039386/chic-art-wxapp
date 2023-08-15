// templates/project_order/customers/index.js
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
      this.getCustomers(id)
      this.setData({id})
    }
  },
  data: {
    id:null,
    isAllowOperation :true,
    loading:false,
    customerList:[],   // 通过审核的客户
    auditCustomerList :[] // 未通过审核的客户
  },
  methods: {
    getCustomers(id){
      this.setData({loading :true})
      let customerList = [];
      let auditCustomerList = [];
      ProjectOrder.getCustomers(id).then((result) => {
        result.data.forEach(element => {
          let avatar = '';
          let user_id = {};
          let newData = {};
          if(element.user_id && element.user_id.avatar){
            avatar = getImageUrl(element.user_id.avatar);
          }
          if(element && element.user_id){
            user_id = Object.assign(element.user_id,{ avatar })
            newData = Object.assign(element,{ user_id })
          }
          if(element.state == 0){
            auditCustomerList.push(newData)
          }else{
            customerList.push(newData)
          }
        });
        this.setData({auditCustomerList ,customerList})
      }).finally(() => {
        this.setData({loading:false})
      })
    },
    auditCustomer(event){
      let id = event.currentTarget.dataset.id;
      let index = event.currentTarget.dataset.index;
      wx.showLoading({mask :true});
      ProjectOrder.auditCustomer(id).then(() => {
        let auditCustomerList = this.data.auditCustomerList;
        let customerList = this.data.customerList;
        let newCustomer = auditCustomerList[index];
        // 给通过申请的客户添加这个用户
        customerList.push(newCustomer)
        // 在申请列表删除该客户
        auditCustomerList.splice(index, 1);
        this.setData({ customerList ,auditCustomerList})
      }).finally(() => {
        wx.hideLoading();
      })
    },
    auditNotCustomer(event){
      let id = event.currentTarget.dataset.id;
      let index = event.currentTarget.dataset.index;
      wx.showLoading({mask :true});
      ProjectOrder.auditNotCustomer(id).then(() => {
        let auditCustomerList = this.data.auditCustomerList;
        auditCustomerList.splice(index, 1);
        this.setData({ auditCustomerList})
      }).finally(() => {
        wx.hideLoading();
      })
    }
  }
})
