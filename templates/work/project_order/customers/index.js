// templates/project_order/customers/index.js
const { ProjectOrder } = require('@/api/index')
const { getImageUrl } = require('@/utils/util')
Component({
  options: {
    addGlobalClass: true
  },
  properties:{
    aid :String,
    isAdm :Boolean
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
    auditCustomerList :[] // 未通过审核的客户
  },
  methods: {
    getCustomers(){
      const id = this.properties.aid;
      const isAdm = this.properties.isAdm;
      this.setData({loading :true})
      let customerList = [];
      let auditCustomerList = [];
      ProjectOrder.getCustomers(id).then((result) => {
        if(!isAdm){
          // 当不是项目管理员的时候过滤掉所有不允许客户员工查看的客户
          result.data = result.data.filter((item) => {
            return item.visible_state == 0;
          })
        }
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
          // 过滤审核和未审核的员工
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
    },
    removeProjectOrderCustomer(event){
      wx.showModal({
        title: '提示',
        content: '删除后，该客户将访问不到该订单是否继续？',
        complete: (res) => {
          if (res.confirm) {
            const id = event.currentTarget.dataset.id;
            ProjectOrder.removeCustomer(id).then(() => {
              wx.showToast()
            }).finally(() => {
              const id = this.data.id;
              this.getCustomers(id)
            })
          }
        }
      })
    },
    toCustomerManage(event){
      const isAdm = this.properties.isAdm;
      if(isAdm){
        const id = event.currentTarget.dataset.id;
        const visible_state = event.currentTarget.dataset.visible_state;
        wx.navigateTo({
          url: `/pages/work/order/customer/update_info/index?id=${id}&visible_state=${visible_state}`,
        })
      }
    }
  }
})
