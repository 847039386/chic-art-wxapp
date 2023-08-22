// pages/order/info/index.js
const { getUserInfo } = require('../../../utils/auth')
Page({
  data: {
    id:null,
    admUserId:null,
    company_id :null,
    PageCur: 'InfoTemplate',
    isAdm :false
  },
  onLoad(options){
    let id = options.id;
    let company_id = options.company_id;
    let admUserId = options.user_id;  // 订单负责人
    this.setData({id ,company_id ,admUserId})
    let userInfo = getUserInfo();
    let uid = userInfo.user_id;
    if(uid == admUserId){
      this.setData({ isAdm :true })
    }
  },
  onSwitchTab:function(e){
    const PageCur = e.currentTarget.dataset.cur;
    this.setData({ PageCur })
  }
})