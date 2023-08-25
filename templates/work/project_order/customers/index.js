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
      this.getCustomers(id)
      this.setData({ id })
      console.log(this.properties)
    }
  },
  data: {
    id:null,
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
      ProjectOrder.removeCustomer(id).then(() => {
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
  }
})
