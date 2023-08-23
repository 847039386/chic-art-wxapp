const app = getApp()
const { User } = require('../../../api/index')
const { verifyToken } = require('../../../utils/auth')
Page({
  data: {
    PageCur: 'templates'
  },
  onLoad(){
    if(!verifyToken()){
      wx.redirectTo({
        url: '/pages/shared/login/index/index',
      })
    }
  },
  onShow(){

  },
  onSwitchTab:function(e){
    let PageCur = e.detail.PageCur;
    this.setData({ PageCur })
  }
})