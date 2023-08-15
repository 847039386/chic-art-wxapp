// pages/order/info/index.js
const { ProjectOrder } = require('../../../api/index')
Page({
  data: {
    id:null,
    PageCur: 'InfoTemplate'
  },
  onLoad(options){
    let id = options.id;
    this.setData({id})
  },
  onShow(){

  },
  onSwitchTab:function(e){
    const PageCur = e.currentTarget.dataset.cur;
    this.setData({ PageCur })
  }
})