// pages/client/order/info/index.js
const { getUserInfo } = require('@/utils/auth')
Page({
  data: {
    id:null,
    company_id :null,
    PageCur: 'InfoTemplate',
  },
  onLoad(options){
    let id = options.id;
    let company_id = options.company_id;
    this.setData({id ,company_id })
  },
  onSwitchTab:function(e){
    const PageCur = e.currentTarget.dataset.cur;
    this.setData({ PageCur })
  }
})